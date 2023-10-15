<script setup lang="ts">
import HeaderView from "./components/header/HeaderView.vue";
import SidebarView from "./components/sidebar/SidebarView.vue";
import MainView from "./components/main/MainView.vue";
import FooterView from "./components/footer/FooterView.vue";
</script>

<template>
    <div class="app">
        <el-container>
            <el-header> <HeaderView /> </el-header>
            <el-container>
                <el-aside> <SidebarView /> </el-aside>
                <el-container>
                    <el-main> <MainView /> </el-main>
                    <!-- <el-footer> <FooterView /> </el-footer> -->
                </el-container>
            </el-container>
        </el-container>
    </div>
</template>

<style>
body {
  margin: 0;
}
.app {
    background-color: brown;
}
.el-container{
    background-color: goldenrod;
    border-color: red;
}
.el-header{
    background-color: pink;
    /* 使用!important强制覆盖其他可能存在的xx设置 */
    padding: 0 !important;
    /* margin: 0 !important; */
    height: auto !important;
     /* 启用Webkit应用程序区域拖动功能 */
    -webkit-app-region: drag;
}
.el-button {
    -webkit-app-region: no-drag;
}

.el-container .el-container .el-container{
    height: 620px;
}
.el-main{
    background-color: gray;
    /* 强制让子元素占满这个容器 */
    padding: 0 !important;
}
.el-footer{
    background-color: green;
    /* 自动调整高度，和子元素高度保持一致 */
    height: auto !important;
    /* 强制让子元素占满这个容器 */
    padding: 0 !important;
}
.el-aside{
    background-color: aquamarine;
    width: auto !important;
}

</style>
