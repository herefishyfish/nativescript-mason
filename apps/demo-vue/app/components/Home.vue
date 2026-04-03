<template>
  <Frame>
    <Page>
      <ActionBar>
        <span text="Mason Demos" class="text-white" style="font-size: 20; font-weight: bold;" />
      </ActionBar>
      <div class="page" style="overflow-y: scroll;">
        <div class="hero">
          <p style="font-size: 18; font-weight: bold; color: white;">Mason Demos — Examples</p>
          <p style="font-size: 12; color: #eee; margin-top: 6">Quick access to plugin demos and web-style samples</p>
        </div>
        <div class="demo-grid">
          <div class="demo-card">
            <p class="card-title">Flexbox</p>
            <p class="card-desc">Flex layout patterns</p>
            <button class="btn-primary" :text="'Open'" @click="() => navigate('flexbox')" />
          </div>

          <div class="demo-card">
            <p class="card-title">Grid</p>
            <p class="card-desc">Grid layout examples</p>
            <button class="btn-primary" :text="'Open'" @click="() => navigate('grid')" />
          </div>

          <div class="demo-card">
            <p class="card-title">Web Samples</p>
            <p class="card-desc">100+ web-style samples</p>
            <button class="btn-primary" :text="'Open'" @click="() => navigate('web-samples')" />
          </div>

          <div class="demo-card">
            <p class="card-title">Professions</p>
            <p class="card-desc">10 profession examples</p>
            <button class="btn-primary" :text="'Open'" @click="() => navigate('professions')" />
          </div>

          <div class="demo-card">
            <p class="card-title">Lynx Examples</p>
            <p class="card-desc">Styling & animation ports</p>
            <button class="btn-primary" :text="'Open'" @click="() => navigate('lynx')" />
          </div>

          <div class="demo-card">
            <p class="card-title">Showcase</p>
            <p class="card-desc">Mason Showcase</p>
            <button class="btn-primary" :text="'Open'" @click="() => navigate('showcase')" />
          </div>

          <div class="demo-card">
            <p class="card-title">React Native</p>
            <p class="card-desc">React Native examples</p>
            <button class="btn-primary" :text="'Open'" @click="() => navigate('react-native')" />
          </div>
        </div>

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
import LynxIndex from '~/lynx/LynxIndex.vue';
import ReactNative from '~/react-native/sample.vue';

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
    lynx: LynxIndex,
    'react-native': ReactNative
  };
  $navigateTo(demos[demo]);
};
</script>

<style scoped>
.page {
  padding: 16;
  background-color: #fafafa;
  overflow-y: auto;
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.045);
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

.btn-primary {
  background-color: #1a73e8;
  color: #ffffff;
  padding: 10 18;
  border-radius: 10;
  font-weight: 600;
  border-style: none;
}

button:active {
  color: green;
  background-color: red;
}

.demo-card button {
  width: 80;
}
</style>
