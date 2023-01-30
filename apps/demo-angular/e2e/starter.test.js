const { takeScreenshot, compareScreens } = require('./screenshots');
const { device } = require('detox');

beforeAll(async () => {
  await device.launchApp();
});

describe('Example', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should take a screenshot and compare the absolute_layout_align_items_and_justify_content_center_and_bottom_position component', async () => {
    await element(by.id('absolute_layout_align_items_and_justify_content_center_and_bottom_position')).tap();
    await takeScreenshot('absolute_layout_align_items_and_justify_content_center_and_bottom_position');

    const result = await compareScreens('absolute_layout_align_items_and_justify_content_center_and_bottom_position');
    expect(result).toBe(0);
  });
});
