<template>
    <Page>
      <ActionBar title="Doctor — Profile" />
      <ScrollView class="page">
        <StackLayout>
          <Label text="Doctor Profile" class="hero" />
          <Label text="Next appointment: Tomorrow" />
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
