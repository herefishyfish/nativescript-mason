<template>
  <Div class="page" style="overflow-y: auto; padding: 12;">
    <Div>
      <Text class="hero" text="Sample 009: Login" />
      <Input placeholder="Username" />
      <Input placeholder="Password" secure="true" />
      <Button><Text text="Login" /></Button>
    </Div>
  </Div>
</template>

<script lang="ts" setup>
</script>

<style scoped>
.page{padding:12}
.hero{font-weight:bold;margin-bottom:8}
</style>
