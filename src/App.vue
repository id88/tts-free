<script setup lang="ts">
import SidebarView from "./components/sidebar/SidebarView.vue";
import MainView from "./components/main/MainView.vue";
</script>

<template>
    <div class="app">
        <el-container>
            <el-aside> <SidebarView /> </el-aside>
            <el-main> <MainView /> </el-main>
        </el-container>
    </div>
</template>

<style>
*{  
    /* 避免边框改变元素的宽度和高度 */
    box-sizing: border-box !important;
}
body{
    margin: 0;
}
.app{
    /* background-color: brown; */
}
.el-container{
    /* background-color: palevioletred; */
}
.el-aside{
    /* background-color: aquamarine; */
    width: auto !important;
    /* border-radius: 15px; */
    border-top: 1px solid #dcdfe6;;
}
.el-main{
    /* background-color: gray; */
    /* 强制让子元素占满这个容器 */
    padding: 0 !important;
}

</style>
