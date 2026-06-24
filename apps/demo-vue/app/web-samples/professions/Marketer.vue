<template>
    <Page>
      <ActionBar title="Marketer — Campaigns" />
      <ScrollView class="page">
        <StackLayout>
          <Label text="Active Campaigns" class="hero" />
          <Label text="Campaign A — 12% CTR" />
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
