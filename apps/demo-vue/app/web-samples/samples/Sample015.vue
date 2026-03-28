<template>
  <Div class="page" style="overflow-y: auto; padding: 12;">
    <StackLayout>
      <Label text="Sample 015: Icon Cards" class="hero" />
      <GridLayout columns="*,*" class="icons">
        <Label text="★ Feature" />
        <Label text="⚑ Feature" />
      </GridLayout>
    </StackLayout>
  </Div>
</template>

<script lang="ts" setup>
</script>

<style scoped>
.page{padding:12}
.hero{font-weight:bold;margin-bottom:8}
.icons{gap:8}
</style>
