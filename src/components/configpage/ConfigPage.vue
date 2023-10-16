<template>
    <div class="config-page">
        <div class="test">test</div>
        <div class="inner">ConfigPage</div>
    </div>
</template>
  
<script lang="ts" setup></script>

<style scoped>
.config-page{
    background-color: blueviolet;
    height: 300px;
    /* 相对定位 */
    position: relative; 
}
.inner{
    height: 50px;
    width: 100%;
    background-color: pink;
    position: absolute; /* 绝对定位 */
    bottom: 0; /* 将元素定位在底部 */
}
</style>
  