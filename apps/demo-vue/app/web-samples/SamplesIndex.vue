<template>
    <Page>
      <ActionBar title="All Samples" />
      <ScrollView class="page">
        <Div>
          <Text class="heading" text="100 Mason Web Samples" />
          <Div class="samples-grid">
            <Button v-for="s in samples" :key="s" @tap="open(s)">
              <Text :text="s" />
            </Button>
          </Div>
        </Div>
      </ScrollView>
    </Page>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const samples = ref(Array.from({ length: 100 }, (_, i) => `Sample${String(i + 1).padStart(3, '0')}`));

const open = (name: string) => {
  // dynamic require for sample components
  // @ts-ignore
  const component = require(`~/web-samples/samples/${name}.vue`).default;
  // @ts-ignore
  $navigateTo(component);
};
</script>

<style scoped>
.page { padding: 12 }
.heading { font-weight: bold; margin-bottom: 8 }
.samples-grid { gap: 8 }
.samples-grid Button { margin: 6 }
</style>
