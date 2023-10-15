<template>
    <div class="main">
        <div class="input-area" v-show="page.asideIndex == '1'">
            <div class="menu">
                <!-- ellipsis 是否省略多余的子项（仅在横向模式生效） -->
                <el-menu mode="horizontal" @select="tabChange" default-active="1" :ellipsis="false">
                    <el-menu-item index="1">文本</el-menu-item>
                    <el-menu-item index="2">SSML</el-menu-item>
                </el-menu>
            </div>
            <div class="text-area" v-show="page.tabIndex == '1'">
                <el-input v-model="inputs.inputValue" type="textarea" placeholder="Please input" />
            </div>
            <div class="text-area2" v-show="page.tabIndex == '2'">
                <el-input v-model="inputs.ssmlValue" type="textarea" />
            </div>
        </div>

        <div class="input-area" v-show="page.asideIndex == '2'">
            <el-table :data="tableData" height="calc(100vh - 170px)" style="width: 100%">
                <el-table-column prop="fileName" label="文件名" show-overflow-tooltip="true" />
                <el-table-column prop="filePath" label="文件路径" show-overflow-tooltip="true" />
                <el-table-column prop="fileSize" label="字数" width="60" show-overflow-tooltip="true" />
                <el-table-column prop="status" label="状态" width="60">
                    <template #default="scope">
                        <div>
                            <el-tag class="ml-2" :type="scope.row.status == 'ready' ? 'info' : 'success'">
                                {{ scope.row.status }}
                            </el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template #default="scope">
                        <template v-if="scope.row.status == 'ready'">
                            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">移除</el-button>
                        </template>
                        <template v-else>
                            <el-button size="small" type="warning" @click="play(scope.row)" circle>
                                <el-icon>
                                    <CaretRight />
                                </el-icon>
                            </el-button>
                            <el-button size="small" @click="openInFolder(scope.row)" circle>
                                <el-icon>
                                    <FolderOpened />
                                </el-icon>
                            </el-button>
                        </template>
                    </template>
                </el-table-column>
            </el-table>
            <div class="table-tool">
                <el-upload ref="uploadRef" :auto-upload="false" :on-change="fileChange" :on-remove="fileRemove" show-file-list="false" accept=".txt" multiple>
                    <el-tooltip effect="light" content="文本格式为： *.txt">
                        <el-button type="primary">选择文件</el-button>
                    </el-tooltip>
                </el-upload>
                <el-button type="warning" @click="clearAll">
                    <el-icon>
                        <DeleteFilled />
                    </el-icon>清空
                </el-button>
            </div>
        </div>

        <!-- <MainOptions v-show="page.asideIndex != '3'"></MainOptions> -->
        <MainOptions v-show="['1', '2'].includes(page.asideIndex)"></MainOptions>
        
        <div class="main-config-page" v-if="page.asideIndex == '3'">
            <ConfigPage />
        </div>
        
        <div class="main-config-page" v-if="page.asideIndex == '4'">
            <iframe class="doc-frame" src="https://cn.vuejs.org/"> </iframe>
        </div>
    </div>
</template>
<script setup lang="ts">
import MainOptions from "./MainOptions.vue";
import ConfigPage from "../configpage/ConfigPage.vue";

import { ref, watch } from "vue";
import type { UploadInstance, UploadProps, UploadUserFile } from "element-plus";
import { useTtsStore } from "@/store/firstStore";
import { storeToRefs } from "pinia";
const { shell } = require("electron");
var path = require("path");
const store = useTtsStore();
const { inputs, page, tableData, currMp3Url, config, formConfig, audioPlayer } = storeToRefs(store);


// SSML内容和文本框内容同步
// https://cn.vuejs.org/api/reactivity-core.html#watch
watch(
    () => inputs.value.inputValue,
    (newValue) => {
        store.setSSMLValue(newValue);
    }
);

const tabChange = (index: number) => {
    console.log("点击的tab是", index)
    page.value.tabIndex = index.toString();
};

const uploadRef = ref<UploadInstance>();

const handleDelete = (index: any, row: any) => {
    uploadRef.value!.handleRemove(row.file);
};

const fileChange = (uploadFile: any, uploadFiles: any) => {
    tableData.value = uploadFiles.map((item: any) => {
        return {
            fileName: item.name,
            filePath: item.raw.path,
            fileSize: item.size,
            status: item.status,
            file: item,
        };
    });
};

const fileRemove = (uploadFile: any, uploadFiles: any) => {
    tableData.value = uploadFiles.map((item: any) => {
        return {
            fileName: item.name,
            filePath: item.raw.path,
            fileSize: item.size,
            status: item.status,
            file: item,
        };
    });
};

const clearAll = () => {
    tableData.value = [];
    uploadRef.value!.clearFiles();
};

const play = (val: any) => {
    if (audioPlayer.value) {
        (audioPlayer.value as any).src = path.join( 
            config.value.savePath, 
            val.fileName.split(path.extname(val.fileName))[0] + ".mp3" 
        );
        (audioPlayer.value as any).play();
    } else {
        currMp3Url.value = path.join( 
            config.value.savePath, 
            val.fileName.split(path.extname(val.fileName))[0] + ".mp3" 
        );
    }
};

const openInFolder = (val: any) => {
    shell.showItemInFolder(
        path.join(
            config.value.savePath,
            val.fileName.split(path.extname(val.fileName))[0] + ".mp3"
        )
    );
};
</script>

<style scoped>

.input-area{
    width: 100%;
}

.main {
    /* 里面的子元素弹性布局，水平排列 */
    display: flex;
    background-color: peachpuff;
    /* 启用平滑滚动行为。当滚动到该元素内部的内容时，滚动会平滑进行 */
    scroll-behavior: smooth;
    /* 控制当滚动到最顶部或最底部时的过度滚动行为，使其不超出元素的边界 */
    overscroll-behavior: contain;
    /* 在水平方向上，子元素在两端分散对齐，空白空间被均匀放置在子元素之间 */
    justify-content: space-between;
    width: 100%;
    height: 100%;
}
.menu{
    background-color: pink;
}

.menu .el-menu {
    height: 45px;
}

.main-config-page{
    width: 100%;
    overflow: hidden;
}

/* :deep是一个深度选择器，可以选择嵌套在其他组件中的元素。 */

:deep(.el-upload-list) {
    display: none;
}
:deep(.el-textarea__inner) {
    /* 将高度设置为视口高度减去120像素。calc()函数用于计算表达式的结果 */
    height: calc(100vh - 120px);
    /* 禁止调整大小 */
    /* resize: none; */
    border-radius: 5px;
    padding-top: 10px;
}

/* 选择所有textarea元素并设置滚动条样式 */
:deep(textarea::-webkit-scrollbar) {
    width: 5px;
}
/* 选择滚动条的滑块部分 */
:deep(textarea::-webkit-scrollbar-thumb) {
    width: 5px;
    /* 将滑块的定位方式设置为相对定位 */
    position: relative;
    /* 将滑块设置为块级元素 */
    display: block;
    /* 将鼠标样式设置为指针形状 */
    cursor: pointer;
    /* 继承父元素的边框半径样式 */
    border-radius: inherit;
    background-color: rgb(183, 192, 201);
    /* 设置背景颜色变化的过渡效果持续时间为0.3秒 */
    transition: 0.3 background-color;
    /* 将滑块的不透明度设置为0.3 */
    opacity: 0.3;
}



.table-tool {
    background-color: #ffc;
    height: 65px;
    /* 里面的子元素弹性布局，水平排列 */
    display: flex;
    /* 弹性项目之间的间距相等，并且弹性容器的两侧都留有相等的空白空间 */
    justify-content: space-around;
    /* 子元素在垂直方向上居中对齐 */
    align-items: center;
}



.doc-frame{
    width: 100%;
    height: 100%;
    /* medium 使用默认的中等边框宽度，通常与浏览器的默认样式相关 */
    /* none 表示没有边框样式，即不显示边框 */
    border: medium none;
    
}


</style>