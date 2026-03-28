<template>
    <Page>
      <ActionBar title="Sample 001 — Responsive Card" />
      <ScrollView class="page">
        <Div>
          <Text class="hero" text="Sample 001: Responsive Card" />
          <Div class="card-grid" style="display:flex;flex-direction:row;gap:8">
            <Div style="flex:1;padding:8;background:#fff;border-radius:8">
              <Text text="Card Left" />
            </Div>
            <Div style="flex:1;padding:8;background:#fff;border-radius:8">
              <Text text="Card Right" />
            </Div>
          </Div>
        </Div>
      </ScrollView>
    </Page>
</template>

<script lang="ts" setup>

</script>

<style scoped>
.page { padding: 12 }
.hero { font-weight: bold; margin-bottom: 8 }
.card-grid { gap: 8 }
</style>
