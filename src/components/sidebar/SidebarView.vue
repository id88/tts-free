<template>
    <div class="aside">
        <el-menu class="el-menu-vertical-demo" @select="menuChange">
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




<!-- <template>
    <el-row class="tac">
        <el-col :span="12">
            <h5 class="mb-2">Default colors</h5>
            <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" >
                <el-sub-menu index="1">
                    <template #title>
                        <el-icon><location /></el-icon>
                        <span>Navigator One</span>
                    </template>
                    <el-menu-item-group title="Group One">
                        <el-menu-item index="1-1">item one</el-menu-item>
                        <el-menu-item index="1-2">item two</el-menu-item>
                    </el-menu-item-group>
                    <el-menu-item-group title="Group Two">
                        <el-menu-item index="1-3">item three</el-menu-item>
                    </el-menu-item-group>
                    <el-sub-menu index="1-4">
                        <template #title>item four</template>
                        <el-menu-item index="1-4-1">item one</el-menu-item>
                    </el-sub-menu>
                </el-sub-menu>

                <el-menu-item index="2">
                    <el-icon><icon-menu /></el-icon>
                    <span>Navigator Two</span>
                </el-menu-item>

                <el-menu-item index="3">
                    <el-icon><document /></el-icon>
                    <span>Navigator Three</span>
                </el-menu-item>

                <el-menu-item index="4">
                    <el-icon><setting /></el-icon>
                    <span>Navigator Four</span>
                </el-menu-item>
            </el-menu>
        </el-col>
    </el-row>
</template> -->






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







// 官网的案例 ------------------------------

// import { Document, Menu as IconMenu, Location, Setting, } from '@element-plus/icons-vue'

// const handleOpen = (key: string, keyPath: string[]) => {
//     console.log(key, keyPath)
// }
// const handleClose = (key: string, keyPath: string[]) => {
//     console.log(key, keyPath)
// }

</script>



<style scoped>
.aside{
    background-color: pink;
}
.el-menu-vertical-demo{
    /* background-color: brown; */
    width: 130px;
}
</style>