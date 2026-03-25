<template>
  <Frame>
    <Page>
      <ActionBar>
        <Label text="Mason Demos" class="text-white" style="font-size: 20; font-weight: bold;" />
      </ActionBar>
      <div class="page">


        <view style="
        flex-direction: column;
        background: linear-gradient(to right, rgb(255,53,26), rgb(0,235,235));
        border-radius: 0 50% 0 0;
        box-shadow: 3 5 5 black;
        border-left: 2 rgb(0,235,235) dotted;
        border-top: 2 rgb(255,53,26) dashed;
        margin-top: 50%;
        transform: translate(-50%, -50%);
        margin-left: 50%;
        width: 150;
        height: 150;
      ">
        </view>

      </div>
    </Page>
  </Frame>
</template>

<script lang="ts" setup>
import { $navigateTo } from 'nativescript-vue';
import FlexboxDemo from '~/plugin-demos/FlexboxDemo.vue';
import GridDemo from '~/plugin-demos/GridDemo.vue';
import BoxShadowDemo from '~/plugin-demos/BoxShadowDemo.vue';
import TransformDemo from '~/plugin-demos/TransformDemo.vue';
import TypographyDemo from '~/plugin-demos/TypographyDemo.vue';
import SpacingDemo from '~/plugin-demos/SpacingDemo.vue';
import ShowcaseDemo from '~/plugin-demos/ShowcaseDemo.vue';
import GridArea from '~/plugin-demos/Grid-Area.vue';
import WebSamplesIndex from '~/web-samples/WebSamplesIndex.vue';
import ProfessionList from '~/web-samples/ProfessionList.vue';

const navigate = (demo: string) => {
  const demos = {
    flexbox: FlexboxDemo,
    grid: GridDemo,
    shadows: BoxShadowDemo,
    transforms: TransformDemo,
    typography: TypographyDemo,
    spacing: SpacingDemo,
    showcase: ShowcaseDemo,
    'grid-area': GridArea,
    'web-samples': WebSamplesIndex,
    professions: ProfessionList,
  };
  $navigateTo(demos[demo]);
};
</script>

<style scoped>
.page {
  padding: 16;
  background-color: #fafafa;
  overflow-y: scroll;
}

.hero {
  background-color: #1a1a2e;
  border-radius: 16;
  padding: 24;
  margin-bottom: 20;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.demo-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10;
}

.demo-card {
  background-color: white;
  border-radius: 12;
  padding: 14;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.icon-circle {
  width: 44;
  height: 44;
  border-radius: 22;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-text {
  color: white;
  font-size: 18;
  font-weight: bold;
}

.card-title {
  font-size: 14;
  font-weight: bold;
  color: #1a1a2e;
}

.card-desc {
  font-size: 10;
  color: #888;
  text-align: center;
}
</style>
