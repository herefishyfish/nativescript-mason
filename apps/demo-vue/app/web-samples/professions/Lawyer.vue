<template>
    <Page>
      <ActionBar title="Lawyer — Cases" />
      <ScrollView class="page">
        <StackLayout>
          <Label text="Active Cases" class="hero" />
          <Label text="Case #123: Contract review" />
        </StackLayout>
      </ScrollView>
    </Page>
</template>

<script lang="ts" setup>
</script>

<style scoped>
.page { padding: 12 }
.hero { font-size: 20; font-weight: bold; margin-bottom: 8 }
</style>
