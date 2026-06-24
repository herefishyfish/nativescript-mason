<template>
  <Div class="page" style="overflow-y: auto; padding: 12;">
    <StackLayout>
      <Label text="Sample 024: Features Grid" class="hero" />
      <GridLayout columns="*,*" class="features">
        <Label text="Fast" />
        <Label text="Secure" />
      </GridLayout>
    </StackLayout>
  </Div>
</template>

<script lang="ts" setup>
</script>

<style scoped>
.page{padding:12}
.hero{font-weight:bold;margin-bottom:8}
.features{gap:8}
</style>
