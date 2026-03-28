<template>
  <Page>
    <ActionBar title="Lynx — Animation" />
    <div style="overflow-y: auto; align-items: center; padding: 12;">
      <div ref="box" style="width:120; height:120; background-color: #4ECDC4; border-radius:8; margin-bottom:16;" />
      <button class="btn-primary" :text="'Animate Box'" @click="animateBox" />
      <p style="margin-top:12; color:#666; text-align:center; text-wrap: wrap;">Simple translate animation ported from Lynx animation examples.</p>
    </div>
  </Page>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const box = ref<any>(null);

const animateBox = () => {
  const el = box.value?.nativeView ?? box.value;
  if (!el || typeof el.animate !== 'function') return;
  el.animate({ translate: { x: 120, y: 0 }, duration: 500 }).then(() => {
    return el.animate({ translate: { x: 0, y: 0 }, duration: 500 });
  });
};
</script>

<style scoped>
/* simple styles for the sample */
  .btn-primary {
    background-color: #1a73e8;
    color: #fff;
    padding: 10 18;
    border-radius: 8;
    font-weight: bold;
    text-align: center;
  }
</style>
