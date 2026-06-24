<template>
  <Div class="page" style="overflow-y: auto; padding: 12;">
    <Div>
      <Text class="hero" text="Sample 004: Pricing Cards" />
      <Div class="pricing" style="display:flex;gap:8;flex-direction:row">
        <Div style="flex:1;padding:8;background:#fff;border-radius:8"><Text text="Basic" /></Div>
        <Div style="flex:1;padding:8;background:#fff;border-radius:8"><Text text="Pro" /></Div>
        <Div style="flex:1;padding:8;background:#fff;border-radius:8"><Text text="Enterprise" /></Div>
      </Div>
    </Div>
  </Div>
</template>

<script lang="ts" setup>

</script>

<style scoped>
.page{padding:12}
.hero{font-weight:bold;margin-bottom:8}
.pricing{gap:8}
</style>
