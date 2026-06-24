<template>
    <Page>
      <ActionBar title="Designer — Portfolio" />
      <ScrollView class="page">
        <StackLayout class="site">
          <Label text="Designer Portfolio" class="hero" />
          <GridLayout columns="*,*" rows="auto" class="work-grid">
            <Label text="Project A" col="0" />
            <Label text="Project B" col="1" />
            <Label text="Project C" col="0" />
            <Label text="Project D" col="1" />
          </GridLayout>
          <Button text="Contact" class="cta" />
        </StackLayout>
      </ScrollView>
    </Page>
</template>

<script lang="ts" setup>
</script>

<style scoped>
.page { padding: 12 }
.hero { font-size: 22; font-weight: bold; margin-bottom: 8 }
.work-grid { gap: 8 }
.cta { margin-top: 12 }
</style>
