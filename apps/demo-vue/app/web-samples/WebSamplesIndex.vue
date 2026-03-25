<template>
  <Frame>
    <Page>
      <ActionBar title="Web Samples" />
      <ScrollView class="page">
        <StackLayout>
          <Label class="heading" text="Latest Web Features" />
          <GridLayout columns="*,*" rows="auto" class="samples-grid">
            <Button text="Grid Demo" @tap="$navigateTo(require('~/plugin-demos/GridDemo.vue').default)" />
            <Button text="Transform Demo" @tap="$navigateTo(require('~/plugin-demos/TransformDemo.vue').default)" />
            <Button text="Typography" @tap="$navigateTo(require('~/plugin-demos/TypographyDemo.vue').default)" />
            <Button text="Showcase" @tap="$navigateTo(require('~/plugin-demos/ShowcaseDemo.vue').default)" />
          </GridLayout>

          <Label class="sub" text="Mason Web Showcase" />
          <Frame class="showcase-frame">
            <Page>
              <ActionBar title="Mason Web Showcase" />
              <StackLayout class="showcase">
                <Label text="Responsive Header" class="showcase-hero" />
                <FlexboxLayout class="showcase-row" justifyContent="space-between">
                  <Label text="Left" />
                  <Label text="Center" />
                  <Label text="Right" />
                </FlexboxLayout>
                <GridLayout columns="*,*" class="showcase-grid">
                  <Label text="Card 1" col="0" />
                  <Label text="Card 2" col="1" />
                </GridLayout>
              </StackLayout>
            </Page>
          </Frame>

        </StackLayout>
      </ScrollView>
    </Page>
  </Frame>
</template>

<script lang="ts" setup>
</script>

<style scoped>
.page { padding: 16; }
.heading { font-size: 20; font-weight: bold; margin-bottom: 8 }
.sub { margin-top: 12; font-size: 14; color: #666 }
.samples-grid Button { margin: 6 }
.showcase { padding: 12; background-color: #fff; border-radius: 8 }
.showcase-hero { font-size: 18; font-weight: bold; margin-bottom: 8 }
.showcase-grid { margin-top: 10; gap: 8 }
</style>
