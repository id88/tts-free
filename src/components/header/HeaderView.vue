<template>
    <div class="header" :class="{ 'win-style': winStyle }">
        <div class="win-tools" :class="{ 'win-style': winStyle }">
            <el-button type="danger" 
                size="small" 
                circle 
                class="circle-btn" 
                @click="ipcRenderer.send('close')"
                @mouseenter="currShow = 1" 
                @mouseleave="currShow = 0"
            >
                <el-icon v-show="currShow == 1"> 
                    <CloseBold /> 
                </el-icon>
            </el-button>

            <el-button type="warning" 
                size="small" 
                circle 
                class="circle-btn" 
                @click="ipcRenderer.send('min')"
                @mouseenter="currShow = 2" 
                @mouseleave="currShow = 0"
            >
                <el-icon v-show="currShow == 2"> 
                    <SemiSelect /> 
                </el-icon>
            </el-button>

            <el-button type="success" 
                size="small" 
                circle 
                class="circle-btn" 
                @click="ipcRenderer.send('window-maximize')"
                @mouseenter="currShow = 3" 
                @mouseleave="currShow = 0"
            >
                <el-icon v-show="currShow == 3" style="font-weight: bold; font-size: 14px;"> 
                    <FullScreen /> 
                </el-icon>
            </el-button>
        </div>
    </div>
</template>
  
<script lang="ts" setup>
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useTtsStore } from "@/store/firstStore";

const ttsStore = useTtsStore();
const { config } = storeToRefs(ttsStore);
const currShow = ref(0);

watch(() => config.value.titleStyle, (newValue) => {
        winStyle.value = !newValue;
    }
);

const { ipcRenderer } = require("electron");
const winStyle = ref(!config.value.titleStyle);
</script>
  
<style scoped>
.header {
    height: 30px;
    background: #eee;
    /* 里面的子元素弹性布局，水平排列 */
    display: flex;
    /* 子元素在垂直方向上居中对齐 */
    align-items: center;
    /* 子元素在水平方向上自动调整对齐方式 */
    justify-items: auto;
    /* 子元素在水平方向上平均分布，与父元素两侧保持间距 */
    justify-content: space-between;
}

.win-tools {
    /* 里面的子元素弹性布局，水平排列 */
    display: flex;
    /* 对元素进行缩放，缩放比例为0.8 */
    transform: scale(0.8);
    /* background-color: green; */
}

/* 父子选择器 */
.win-tools .el-button {
    /* 设置左边距为8像素 */
    margin-left: 8px;
}

.win-style {
    /* 设置主轴方向为逆向排列 */
    flex-direction: row-reverse;
}

</style>