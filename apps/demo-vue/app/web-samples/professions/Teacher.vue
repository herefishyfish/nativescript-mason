<template>
    <Page>
      <ActionBar title="Teacher — Class" />
      <ScrollView class="page">
        <StackLayout>
          <Label text="Today's lesson: Algebra" class="hero" />
          <Label text="Homework assigned" />
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
