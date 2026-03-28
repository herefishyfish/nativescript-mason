<template>
        <Page>
            <ActionBar>
                <Label text="Mason Demos" class="text-white" style="font-size: 20; font-weight: bold;" />
            </ActionBar>
            <view>
                <view class="container">
                    <text class="red">just red</text>
                    <text class="big-blue">just bigBlue</text>
                    <text class="big-blue red">bigBlue, then red</text>
                    <text class="red big-blue">red, then bigBlue</text>
                </view>
            </view>
        </Page>
</template>

<style scoped>
.container {
    margin-top: 50
}

.big-blue {
    color: blue;
    font-weight: bold;
    font-size: 30;
}

.red {
    color: red;
}
</style>