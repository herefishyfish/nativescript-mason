const fs = require('fs');
const pixelMatch = require('pixelmatch');
const { device } = require('detox');

async function takeScreenshot(testName, delay = 1000) {
  const deviceName = device.name;

  const path = `./screenshots/${deviceName}/latest/${testName}.png`;
  if (!fs.existsSync(`./screenshots/${deviceName}/latest`)) {
    fs.mkdirSync(`./screenshots/${deviceName}/latest`, { recursive: true });
  }
  if (!fs.existsSync(`./screenshots/${deviceName}/baseline`)) {
    fs.mkdirSync(`./screenshots/${deviceName}/baseline`, { recursive: true });
  }
  if (!fs.existsSync(`./screenshots/${deviceName}/diff`)) {
    fs.mkdirSync(`./screenshots/${deviceName}/diff`, { recursive: true });
  }

  const tempPath = await device.takeScreenshot(testName);

  await fs.copyFileSync(tempPath, path);
  fs.unlink(tempPath, (err) => {
    if (err) {
      console.error(err);
    }
  });
}

function getBaselineImage(testName) {
  const deviceName = device.name;

  const path = `./screenshots/${deviceName}/baseline/${testName}.png`;
  if (!fs.existsSync(path)) {
    return false;
  }
  return path;
}

function compareScreens(testName) {
  const deviceName = device.name;

  const path = `./screenshots/${deviceName}/latest/${testName}.png`;
  if (!fs.existsSync(path)) {
    throw new Error(`Actual screenshot not found at ${path}`);
  }

  const baselinePath = getBaselineImage(testName);
  if(!baselinePath) {
    console.log('No baseline image found, creating one...');
    fs.copyFileSync(path, `./screenshots/${deviceName}/baseline/${testName}.png`);
    return 0;
  }

  const diffPath = `./screenshots/${deviceName}/diff/${testName}.png`;

  const result = pixelMatch(baselinePath, path, diffPath);

  return result;
}
