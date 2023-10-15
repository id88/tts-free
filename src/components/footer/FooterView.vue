<template>
    <div class="footer">
        <div class="play-bar">
            <div class="paly-bar-options">
                <el-button type="success" circle :icon="Download" title="下载音频" />
            </div>
            <div class="paly-bar-process">
                <audio ref="audioPlayer" controls controlslist="nodownload"></audio>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Download } from "@element-plus/icons-vue";
</script>

<style scoped>
.footer {
    background-color: yellow;
    /* 自动调整高度，和子元素高度保持一致 */
    height: auto !important;
}
.play-bar {
    width: 100%;
    /* 里面的子元素弹性布局，水平排列 */
    display: flex;
    /* 子元素在水平方向上自动调整对齐方式 */
    justify-content: center;
    /* 子元素在垂直方向上居中对齐 */
    align-items: center;
    margin-top: 5px;
}
.paly-bar-options {
    width: 70px;
}
.paly-bar-process {
    width: 70%;
    background-color: blue;
}
audio{
    /* 宽度是父容器的100% */
    width: 100%;
    /* display: block; */
    background-color: red;
    height: 35px;
}

/* 
display: block;：将元素显示为块级元素。
    块级元素会独占一行，其宽度默认是父元素的100%。
    常见的块级元素包括 <div>、<p>、<h1> 等。
    块级元素可以设置宽度、高度、边距、内边距等属性，并且会自动换行。
    
display: inline;：将元素显示为内联元素。
    内联元素不会独占一行，它们会在同一行上按照从左到右的顺序排列。
    常见的内联元素包括 <span>、<a>、<strong> 等。
    内联元素的宽度、高度、边距、内边距设置会被忽略，但可以设置水平方向上的边距和内边距。
    内联元素不会自动换行，而会随着父元素宽度的变化自动调整。 

display: flex; 将元素标记为弹性容器，它的直接子元素成为弹性项目。
    允许通过指定 flex-direction、justify-content、align-items 等属性来定义弹性项目在主轴和交叉轴上的布局方式。

display: block; 和 display: inline; 定义了元素在文档流中的显示方式，
而 display: flex; 定义了一种弹性盒子布局。


display: inline-block;：该值将元素显示为内联块级元素。它与 display: inline; 类似，可以在同一行显示多个元素，并且可以设置宽度、高度、边距等属性。

display: table;：该值将元素显示为表格元素。它会创建一个匿名的表格容器，并根据表格布局模型来渲染内容。

display: grid;：该值将元素显示为网格容器，使用网格布局进行排列。通过定义网格行和列，可以灵活地控制元素在网格中的位置和大小。

display: inline-flex;：该值将元素显示为内联弹性盒子。类似于 display: flex;，但元素仍保持在一行内。

display: none;：该值将元素隐藏，不会在页面中显示，并且不占据空间。相当于元素不存在于文档中。


*/

</style>
