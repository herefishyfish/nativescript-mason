const cheerio = require('cheerio');
const fs = require('fs');
const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'cyan', 'gray', 'darkGray', 'lightGray', 'lightBlue', 'lightGreen', 'lightRed', 'lightYellow', 'lightPurple', 'lightCyan'];

function toPascalCase(str) {
  return str
    .replace(/_([a-z])/g, function (g) {
      return g[1].toUpperCase();
    })
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return word.toUpperCase();
    })
    .replace(/\s+/g, '');
}

function createTreeFromHtmlFile(testName) {
  // read the file and get the test props
  const html = fs.readFileSync(`taffy_tests/${testName}.html`, 'utf8');
  const $ = cheerio.load(html);

  $('div').each((i, elem) => {
    if (elem.children.length === 1 && elem.children[0].type === 'text') {
      elem.tagName = 'Label';
    } else {
      elem.tagName = 'TSCView';
      if (elem.attribs['id']) {
        elem.attribs['testID'] = elem.attribs['id'];
      }
    }

    elem.attribs['backgroundColor'] = colors[i % colors.length];
    if (elem.attribs['style']) {
      elem.attribs['style'] = elem.attribs['style'].replaceAll('px', 'dip');
    }
  });

  return $('body').html();
}

function writeComponentToFile(testName) {
  const testMarkup = createTreeFromHtmlFile(testName);
  const component = `
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: \`
  <ActionBar title="${testName}"></ActionBar>
  ${testMarkup.trim()}
  \`,
})
export class ${toPascalCase(testName)}Component {}
`;

  fs.writeFileSync(`../../../apps/demo-angular/src/tests/${testName.toLowerCase()}.component.ts`, component);
}

function writeHtmlWithColor(testName) {
  const html = fs.readFileSync(`taffy_tests/${testName}.html`, 'utf8');
  const $ = cheerio.load(html);

  $('div').each((i, elem) => {
    if (elem.attribs['style']) {
      elem.attribs['style'] += `background-color: ${colors[i % colors.length]};`;
    }
  });

  fs.writeFileSync(`./taffy_tests_with_color/${testName.toLowerCase()}.html`, $.html());
}

function writeTestsFile(items) {
  const template = (item, index) => `const { compareScreens } = require('./screenshots');
  const { device } = require('detox');
  
  beforeEach(async () => {
    await device.launchApp({ newInstance: true });
  });

  describe('${index + 1}:${item.name.replaceAll('_', ' ').toUpperCase()}', () => {
    it('Should take a screenshot and compare the component', async () => {
      await element(by.id('test-root-list')).scroll(35 * ${index + 1}, 'down',0);
      await element(by.text('${item.name}')).tap();
      await compareScreens(element(by.id('test-root')), '${item.name}');
    });
  });
  `;
  items.map((item, index) => {
    fs.writeFileSync(`../../../apps/demo-angular/e2e/${item.name}.test.js`, template(item, index));
  });
}

function writeComponentsToFile() {
  const routes = [];
  const items = [];

  fs.readdirSync('taffy_tests').forEach((file) => {
    const testName = file.replace('.html', '');
    console.log('writing component for test: ' + testName);
    writeComponentToFile(testName);
    writeHtmlWithColor(testName);

    routes.push(`{ path: '${testName.toLowerCase()}', loadComponent: () => import('./tests/${testName.toLowerCase()}.component').then((m) => m.${toPascalCase(testName)}Component)}`);
    items.push({ name: testName.toLowerCase() });
  });

  const routesFile = './routes.ts';
  fs.writeFileSync(routesFile, `export const routes = [${routes.join(',')}];`);

  const itemsFile = './items.ts';
  fs.writeFileSync(itemsFile, `export const items = ${JSON.stringify(items, null, 2)};`);
  writeTestsFile(items);
}

writeComponentsToFile();
