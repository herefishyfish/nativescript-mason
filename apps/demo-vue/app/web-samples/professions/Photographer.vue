<template>
    <Page>
      <ActionBar title="Photographer — Gallery" />
      <ScrollView class="page">
        <StackLayout>
          <Label text="Photographer Gallery" class="hero" />
          <GridLayout columns="*,*" class="photo-grid">
            <Label text="Photo 1" />
            <Label text="Photo 2" />
          </GridLayout>
        </StackLayout>
      </ScrollView>
    </Page>
</template>

<script lang="ts" setup>
</script>

<style scoped>
.page { padding: 12 }
.hero { font-size: 20; font-weight: bold; margin-bottom: 8 }
.photo-grid { gap: 8 }
</style>
