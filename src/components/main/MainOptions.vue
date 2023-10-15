<template>
    <div class="options">
        <el-form label-width="120px" label-position="top">
            <el-form-item label="语言">
                <el-select-v2
                    class="languageSelect"
                    v-model="formConfig.languageSelect"
                    placeholder="选择语言"
                    filterable
                    :options="oc.languageSelect"
                    @change="languageSelectChange"
                >
                </el-select-v2>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { optionsConfig as oc } from "./options-config";
import { getStyleDes, getRoleDes } from "./emoji-config";
import Loading from "./Loading.vue";
import { ElMessage, ElMessageBox, arrowMiddleware } from "element-plus";
import { useTtsStore } from "@/store/firstStore";
import { storeToRefs } from "pinia";

const ttsStore = useTtsStore();
const {
  inputs,
  formConfig,
  page,
  tableData,
  currConfigName,
  config,
  isLoading,
} = storeToRefs(ttsStore);
const Store = require("electron-store");
const store = new Store();


const voiceSelectList = ref(
  oc.findVoicesByLocaleName(formConfig.value.languageSelect)
);

const languageSelectChange = (value: string) => {
    formConfig.value.voiceSelect = "";
    formConfig.value.voiceStyleSelect = "";
    formConfig.value.role = "";
    voiceSelectList.value = oc.findVoicesByLocaleName(value);
};

</script>

<style scoped>
.options {
    background-color: plum;
}
</style>