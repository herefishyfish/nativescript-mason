#!/usr/bin/env node
// Driver for the NativeScript masonkit demo app on an Android emulator.
//
// The NativeScript CLI's `ns run android` is the *human* path: it stays in
// watch mode forever and its output is unreadable from a pipe. This driver
// uses the terminating path (`ns build` -> `adb install` -> `am start`) and
// gives you a programmatic handle on the running app: screenshots, taps by
// on-screen text, and filtered logcat.
//
// Usage:
//   node .claude/skills/run-demo/driver.mjs <command> [args]
//
//   doctor                 check emulator/python/env prerequisites
//   aar [abi]              rebuild the Rust+Kotlin AAR (default abi: x86_64)
//   build                  ns build android (bundles JS, compiles APK)
//   install                adb install -r the built APK
//   launch                 cold-start the app (clears logcat first)
//   shot <file.png>        screenshot to <file.png>
//   tap <x> <y>            tap device coordinates
//   tap-text <string>      find a node by text via uiautomator, tap its centre
//   logs [regex] [ms]      dump matching logcat lines (default: FIXCHECK, 6s)
//   stop                   force-stop the app
//   all                    aar + build + install + launch  (full cold path)
//
// Every command shells out to tools that must be on PATH: adb, npx, and (for
// `aar`) a real python. See SKILL.md for the two environment traps on Windows.

import { execFileSync, execSync } from 'node:child_process';
import { copyFileSync, existsSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SKILL_DIR = dirname(fileURLToPath(import.meta.url));
const APP_DIR = resolve(SKILL_DIR, '../../..'); // apps/demo
const REPO_ROOT = resolve(APP_DIR, '../..');
const APP_ID = 'org.nativescript.plugindemo';
const APK = join(APP_DIR, 'platforms/android/app/build/outputs/apk/debug/app-debug.apk');
const AAR_SRC = join(REPO_ROOT, 'packages/nativescript-masonkit/src-native/mason-android');
const AAR_OUT = join(AAR_SRC, 'masonkit/build/outputs/aar/masonkit-release.aar');
const AAR_DEST = join(REPO_ROOT, 'packages/nativescript-masonkit/platforms/android/masonkit-release.aar');

// `ns` spawns gradlew.bat as a bare command name relying on cwd resolution,
// which NoDefaultCurrentDirectoryInExePath=1 disables. Clearing it here is
// enough; it only affects our child processes.
const ENV = { ...process.env };
delete ENV.NoDefaultCurrentDirectoryInExePath;

const PATH_SEP = process.platform === 'win32' ? ';' : ':';

// Windows names the variable `Path`, and spreading process.env keeps that
// casing — so `env.PATH` reads undefined and writing it would strand the real
// value under the old key. Always go through these two helpers.
function pathKey(env) {
  return Object.keys(env).find((k) => k.toUpperCase() === 'PATH') ?? 'PATH';
}

function prependPath(env, ...dirs) {
  const key = pathKey(env);
  const existing = env[key] ?? '';
  env[key] = [...dirs.filter(Boolean), existing].join(PATH_SEP);
  return env;
}

function sh(cmd, opts = {}) {
  return execSync(cmd, { stdio: 'pipe', encoding: 'utf8', env: ENV, ...opts });
}

function shLoud(cmd, opts = {}) {
  return execSync(cmd, { stdio: 'inherit', env: ENV, ...opts });
}

// Shell-free sleep: `timeout`/`sleep` differ between cmd and the sh that
// Node uses for shell:true, and this driver runs from both.
function sleepSync(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function adb(args, opts = {}) {
  return execFileSync('adb', args, { encoding: 'utf8', env: ENV, maxBuffer: 64 * 1024 * 1024, ...opts });
}

function findPython() {
  // A bare `python` on Windows usually resolves to the Microsoft Store stub,
  // which exits 9009 and breaks the Rust linker wrapper. Find a real one.
  const candidates = [
    join(process.env.LOCALAPPDATA ?? '', 'Programs/Python/Python312/python.exe'),
    join(process.env.LOCALAPPDATA ?? '', 'Programs/Python/Python311/python.exe'),
    join(process.env.LOCALAPPDATA ?? '', 'Programs/Python/Python313/python.exe'),
  ];
  for (const c of candidates) if (c && existsSync(c)) return dirname(c);
  return null;
}

// Gradle needs JAVA_HOME. It is often unset here — `java` happens to be on
// PATH in Git Bash but not in PowerShell, so the AAR build fails depending on
// which shell you launched from. Resolve it explicitly.
function findJavaHome() {
  if (process.env.JAVA_HOME && existsSync(process.env.JAVA_HOME)) return process.env.JAVA_HOME;
  const candidates = [
    'C:/Program Files/Android/Android Studio/jbr',
    ...(() => {
      const base = 'C:/Program Files/Eclipse Adoptium';
      try {
        return readdirSync(base)
          .filter((d) => d.startsWith('jdk-'))
          .map((d) => join(base, d));
      } catch {
        return [];
      }
    })(),
  ];
  for (const c of candidates) if (existsSync(join(c, 'bin/java.exe')) || existsSync(join(c, 'bin/java'))) return c;
  return null;
}

const commands = {
  doctor() {
    const devices = adb(['devices']).trim().split('\n').slice(1).filter(Boolean);
    console.log(devices.length ? `adb devices:\n${devices.join('\n')}` : 'NO DEVICE — start an emulator first');
    const py = findPython();
    console.log(`real python dir: ${py ?? 'NOT FOUND (aar builds will fail)'}`);
    console.log(`java home: ${findJavaHome() ?? 'NOT FOUND (gradle will fail)'}`);
    console.log(`NoDefaultCurrentDirectoryInExePath=${process.env.NoDefaultCurrentDirectoryInExePath ?? '(unset)'} (cleared for children)`);
    console.log(`apk present: ${existsSync(APK)}`);
  },

  // Rust/Kotlin changes only reach the app through this AAR. `ns build` does
  // NOT rebuild it — it just consumes platforms/android/masonkit-release.aar.
  aar(abi = 'x86_64') {
    const py = findPython();
    const java = findJavaHome();
    const cargoBin = join(process.env.USERPROFILE ?? process.env.HOME ?? '', '.cargo/bin');
    const env = { ...ENV };
    if (java) env.JAVA_HOME = java;
    prependPath(env, py, java && join(java, 'bin'), existsSync(cargoBin) ? cargoBin : null);
    const gradlew = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';
    shLoud(`${gradlew} :masonkit:assembleRelease -Prust.targets=${abi} --console=plain`, { cwd: AAR_SRC, env });
    copyFileSync(AAR_OUT, AAR_DEST); // not `cp` — cmd.exe has no such command
    console.log(`copied AAR -> ${AAR_DEST}`);
  },

  build() {
    shLoud('npx ns build android --emulator', { cwd: APP_DIR });
  },

  install() {
    if (!existsSync(APK)) throw new Error(`APK missing at ${APK} — run \`build\` first`);
    // `ns build` can leave a stale APK: webpack rewrites assets/app/bundle.js
    // while gradle decides the APK is up to date, so you install yesterday's
    // JS and debug a change that was never on the device. Compare mtimes.
    const bundle = join(APP_DIR, 'platforms/android/app/src/main/assets/app/bundle.js');
    if (existsSync(bundle) && statSync(bundle).mtimeMs > statSync(APK).mtimeMs) {
      throw new Error(
        'APK is OLDER than the JS bundle — gradle did not repackage.\n' +
          'Fix: node driver.mjs rebuild   (removes the APK and rebuilds)',
      );
    }
    console.log(adb(['install', '-r', APK]).trim());
  },

  // Force gradle to repackage by removing the stale APK first.
  rebuild() {
    if (existsSync(APK)) rmSync(APK);
    commands.build();
  },

  launch() {
    try { adb(['logcat', '-c']); } catch {}
    adb(['shell', 'am', 'force-stop', APP_ID]);
    const out = adb(['shell', 'am', 'start', '-n', `${APP_ID}/com.tns.NativeScriptActivity`]);
    console.log(out.trim());
  },

  stop() {
    adb(['shell', 'am', 'force-stop', APP_ID]);
    console.log('stopped');
  },

  shot(file = 'screen.png') {
    // exec-out keeps the PNG bytes binary-clean; `adb shell screencap` alone
    // corrupts them with CRLF translation on Windows.
    const buf = execFileSync('adb', ['exec-out', 'screencap', '-p'], { maxBuffer: 64 * 1024 * 1024, env: ENV });
    writeFileSync(file, buf);
    console.log(`wrote ${file} (${buf.length} bytes)`);
  },

  tap(x, y) {
    adb(['shell', 'input', 'tap', String(x), String(y)]);
    console.log(`tapped ${x},${y}`);
  },

  // NativeScript views surface their text in the a11y tree, so uiautomator can
  // locate a button by label — far more robust than hardcoded coordinates.
  'tap-text'(needle) {
    if (!needle) throw new Error('usage: tap-text <string>');
    adb(['shell', 'uiautomator', 'dump', '/sdcard/ui.xml']);
    const xml = adb(['shell', 'cat', '/sdcard/ui.xml']);
    const re = new RegExp(`<node[^>]*text="([^"]*${needle}[^"]*)"[^>]*bounds="\\[(\\d+),(\\d+)\\]\\[(\\d+),(\\d+)\\]"`, 'i');
    const m = xml.match(re);
    if (!m) throw new Error(`no node with text matching "${needle}"`);
    const [, text, x1, y1, x2, y2] = m;
    const cx = Math.round((+x1 + +x2) / 2);
    const cy = Math.round((+y1 + +y2) / 2);
    adb(['shell', 'input', 'tap', String(cx), String(cy)]);
    console.log(`tapped "${text}" at ${cx},${cy}`);
  },

  logs(pattern = 'FIXCHECK', ms = '6000') {
    // -d dumps and exits; without it logcat blocks forever.
    const deadline = Date.now() + Number(ms);
    let out = '';
    while (Date.now() < deadline) {
      out = adb(['logcat', '-d']);
      if (new RegExp(pattern).test(out)) break;
      sleepSync(1000);
    }
    const lines = out.split(/\r?\n/).filter((l) => new RegExp(pattern).test(l));
    console.log(lines.length ? lines.join('\n') : `(no lines matching /${pattern}/)`);
  },

  all() {
    commands.aar();
    commands.build();
    commands.install();
    commands.launch();
  },
};

const [cmd, ...args] = process.argv.slice(2);
if (!cmd || !commands[cmd]) {
  console.error(`usage: node driver.mjs <${Object.keys(commands).join('|')}> [args]`);
  process.exit(1);
}
try {
  commands[cmd](...args);
} catch (e) {
  console.error(`FAILED: ${e.message}`);
  process.exit(1);
}
