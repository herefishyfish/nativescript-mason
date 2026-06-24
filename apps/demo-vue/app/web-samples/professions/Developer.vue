<template>
    <Page>
      <ActionBar title="Developer — Dashboard" />
      <ScrollView class="page">
        <StackLayout>
          <Label text="Developer Dashboard" class="hero" />
          <Label text="Recent commits" />
          <Label text="Build status: ✅" />
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
