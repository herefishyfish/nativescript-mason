<template>
  <Page>
    <ActionBar title="Lynx Examples" />
    <ScrollView>
      <StackLayout style="padding: 16;">
        <Label text="Lynx Examples" class="card-title" />
        <Label text="Ports from https://lynxjs.org/guide/styling/animation.html" class="card-desc" />
        <Button text="Animation" @tap="() => open('animation')" style="margin-top:12" />
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script lang="ts" setup>
import { $navigateTo } from 'nativescript-vue';

const open = (name: string) => {
  const pages: Record<string, any> = {
    animation: require('~/web-samples/lynx/Animation.vue').default,
  };
  if (pages[name]) {
    $navigateTo(pages[name]);
  }
};
</script>

<style scoped>
.card-title {
  font-size: 18;
  font-weight: bold;
  color: #1a1a2e;
  margin-bottom: 6;
}
.card-desc {
  font-size: 12;
  color: #666;
}
</style>
