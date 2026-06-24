<template>
    <Page>
      <ActionBar title="Chef — Menu" />
      <ScrollView class="page">
        <StackLayout>
          <Label text="Chef Menu" class="hero" />
          <Label text="Today's special: Pan-seared salmon" />
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
