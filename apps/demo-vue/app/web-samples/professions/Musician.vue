<template>
    <Page>
      <ActionBar title="Musician — Tracks" />
      <ScrollView class="page">
        <StackLayout>
          <Label text="Latest Tracks" class="hero" />
          <Label text="Track 1 — Live" />
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
