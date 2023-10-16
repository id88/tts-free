<script setup lang="ts">
import MainOptions from "./MainOptions.vue";
import ConfigPage from "../configpage/ConfigPage.vue";

import { ref, watch } from "vue";
import type { UploadInstance, UploadProps, UploadUserFile } from "element-plus";
import { useTtsStore } from "@/store/firstStore";
import { storeToRefs } from "pinia";
import FooterView from "../footer/FooterView.vue";
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
                <el-input v-model="inputs.inputValue" type="textarea" placeholder="在这里输入内容" :rows="24"/>
            </div>
            <div class="text-area2" v-show="page.tabIndex == '2'">
                <el-input v-model="inputs.ssmlValue" type="textarea" :rows="24" />
            </div>
        </div>

        <div class="input-area" v-show="page.asideIndex == '2'">
            <el-table :data="tableData">
                <el-table-column prop="fileName" label="文件名" :show-overflow-tooltip="true" />
                <el-table-column prop="filePath" label="文件路径" :show-overflow-tooltip="true" />
                <el-table-column prop="fileSize" label="字数" width="60" :show-overflow-tooltip="true" />
                <el-table-column prop="status" label="状态">
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
                <el-upload ref="uploadRef" :auto-upload="false" :on-change="fileChange" :on-remove="fileRemove" :show-file-list="false" accept=".txt" multiple>
                    <el-tooltip effect="light" content="文本格式为： *.txt">
                        <el-button type="primary"><el-icon><Upload /></el-icon>导入文件</el-button>
                    </el-tooltip>
                </el-upload>
                <el-button type="warning" @click="clearAll">
                    <el-icon>
                        <DeleteFilled />
                    </el-icon>全部清空
                </el-button>
            </div>
        </div>

        <MainOptions v-show="['1', '2'].includes(page.asideIndex)"></MainOptions>
        
        <div class="main-config-page" v-if="page.asideIndex == '3'">
            <ConfigPage />
        </div>
        
        <div class="main-doc-page" v-if="page.asideIndex == '4'">
            <!-- <iframe class="doc-frame" src="https://cn.vuejs.org/"> </iframe> -->
            test
        </div>
    </div>
    <FooterView v-show="['1', '2'].includes(page.asideIndex)"></FooterView>
</template>

<style scoped>
.main {
    /* 里面的子元素弹性布局，水平排列 */
    display: flex;
    /* background-color: peachpuff; */
    /* 启用平滑滚动行为。当滚动到该元素内部的内容时，滚动会平滑进行 */
    scroll-behavior: smooth;
    /* 控制当滚动到最顶部或最底部时的过度滚动行为，使其不超出元素的边界 */
    overscroll-behavior: contain;
    /* 在水平方向上，子元素在两端分散对齐，空白空间被均匀放置在子元素之间 */
    justify-content: space-between;
    /* width: 100%; */

    /* 隐藏滚动条，为了配合【bug1】 */
    overflow: hidden;
}

.input-area{
    width: 100%;
    height: 90%;
    /* background-color: goldenrod; */
}

.el-input{
    height: 100%;
    background-color: red;
}

.menu{
    background-color: pink;
    border-radius: 3px;
    border: 1px solid #dcdfe6;
}

.menu .el-menu {
    height: 45px;
}

.main-config-page{
    width: 100%;
    overflow: hidden;
}

/* :deep是一个深度选择器，可以选择嵌套在其他组件中的元素。 */

/* :deep(.el-upload-list) {
    display: none;
} */

:deep(.el-textarea__inner) {
    /* 将高度设置为视口高度减去120像素。calc()函数用于计算表达式的结果 */
    height: calc(100vh - 87px);
    /* 禁止调整大小 */
    /* resize: none; */
    /* border-radius: 15px; */
    /* background-color: #ffc; */
    /* height: 90%; */
    /* padding-top: 10px; */
}


.el-input{
    background-color: red;
}

.el-table{
    height: calc(100vh - 90px);
    /* 【bug1】神奇，设置为100% 窗口变化时会出现滚动条，并且会把边上的元素顶开 */
    width: 99%;
    /* background-color: #ffc; */
}

/* 选择所有textarea元素并设置滚动条样式 */
:deep(textarea::-webkit-scrollbar) {
    width: 9px;
    background-color: #ffc;
}
/* 选择滚动条的滑块部分 */
:deep(textarea::-webkit-scrollbar-thumb) {
    background-color: rgb(183, 192, 201);
}

.table-tool {
    /* background-color: #ffc; */
    height: 50px;
    /* 里面的子元素弹性布局，水平排列 */
    display: flex;
    /* 弹性项目之间的间距相等，并且弹性容器的两侧都留有相等的空白空间 */
    justify-content: space-around;
    /* 子元素在垂直方向上居中对齐 */
    align-items: center;
    border-bottom: 1px solid #dcdfe6;

}

.main-doc-page{
    width: 100%;
    height: 300px;
    background-color: #ffc;
    /* medium 使用默认的中等边框宽度，通常与浏览器的默认样式相关 */
    /* none 表示没有边框样式，即不显示边框 */
    border: medium none;
    
}
</style>