<template>
    <div class="aside">
        <el-menu mode="vertical" @select="menuChange" default-active="1">
            <el-menu-item index="1">
                <el-icon> <document /> </el-icon> <span>文本</span>
            </el-menu-item>
            <el-menu-item index="2">
                <el-icon> <Files /> </el-icon> <span>批量</span>
            </el-menu-item>
            <el-menu-item index="3">
                <el-icon> <Setting /> </el-icon> <span>设置</span>
            </el-menu-item>
            <el-menu-item index="4">
                <el-icon> <Notebook /> </el-icon> <span>文档</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script setup lang="ts">
import { useTtsStore } from "@/store/firstStore";
import { storeToRefs } from "pinia";

const ttsStore = useTtsStore();
const { page } = storeToRefs(ttsStore);

const menuChange = (index: number) => {
    console.log("点击的页面是", index)
    if (index === 4) return;
    page.value.asideIndex = index.toString();
};
</script>

<style scoped>
.aside{
    background-color: pink;
    border-radius: 5px;
}
.el-menu{
    /* background-color: brown; */
    width: 130px;
}

:deep(.el-menu){
    border-right: none;
    /* border-right: 3px solid red; */
}

.el-menu-item{
    /* background-color: greenyellow; */
    /* border-top: 1px solid  #dcdfe6; */
    box-sizing: border-box;
}


.el-menu-item.is-active {
    /* --el-menu-active-color 默认是#409eff */
    color: #f56c6c;
    background-color: #eef;
}
</style>