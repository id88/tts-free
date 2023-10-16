<template>
    <div class="options">
        <el-form :model="formConfig" size="default" label-width="120px" label-position="top" >
            <el-form-item label="接口">
                <el-select v-model="formConfig.api" placeholder="选择接口" @change="apiChange">
                    <el-option v-for="item in oc.apiSelect" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="语言">
                <el-select-v2 v-model="formConfig.languageSelect" placeholder="选择语言" filterable
                    :options="oc.languageSelect" @change="languageSelectChange">
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
import { ElMessage, ElMessageBox } from "element-plus";
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


const apiEdge = ref(false);

const apiChange = (res: number) => {
    if (res === 2) {
        apiEdge.value = true;
        ElMessage({
            message: `edge接口不支持自动切片，最长支持文本长度未知。请根据自身需求手动预处理文本。`,
            type: "warning",
            duration: 4000,
        });
    } else {
        if (res === 3 && (config.value.speechKey === "" || config.value.serviceRegion === "")) {
            ElMessage({
                message: `请先配置Azure的Speech服务密钥和区域。`,
                type: "warning",
                duration: 4000,
            });
        }
    }
}



const voiceSelectList = ref(
    oc.findVoicesByLocaleName(formConfig.value.languageSelect)
);
const languageSelectChange = (value: string) => {
    formConfig.value.voiceSelect = "";
    formConfig.value.voiceStyleSelect = "";
    formConfig.value.role = "";
    voiceSelectList.value = oc.findVoicesByLocaleName(value);
};



const defaultVoice = voiceSelectList.value.find(
    (item: any) => item.ShortName == formConfig.value.voiceSelect
)






const audition = (value: string) => {
    ttsStore.audition(value);
};

watch(formConfig.value, (newValue) => {
    inputs.value.ssmlValue = `<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="en-US">
          <voice name="${newValue.voiceSelect}">
              <mstts:express-as  ${newValue.voiceStyleSelect != ""
            ? 'style="' + newValue.voiceStyleSelect + '"'
            : ""
        } ${newValue.role != "" ? 'role="' + newValue.role + '"' : ""
        }>
                  <prosody rate="${(
            (newValue.speed - 1) *
            100
        ).toFixed()}%" pitch="${(
            (newValue.pitch - 1) *
            50
        ).toFixed()}%">
                  ${inputs.value.inputValue}
                  </prosody>
              </mstts:express-as>
          </voice>
      </speak>
      `;
});

const saveConfig = () => {
    ElMessageBox.prompt(
        `<p>给此配置起一个简单的名字吧:)</p><br>默认显示的配置名：<strong>默认</strong>`,
        "保存配置",
        {
            dangerouslyUseHTMLString: true,
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            inputValidator: (value: any) => {
                if (value == null || value == "" || value == undefined) {
                    return false;
                } else {
                    return true;
                }
            },
            inputErrorMessage: "错误的输入",
        }
    )
        .then(({ value }) => {
            currConfigName.value = value;
            config.value.formConfigJson[value] = formConfig.value;
            store.set("FormConfig." + value, formConfig.value);
            ttsStore.genFormConfig();
            ElMessage({
                message: "保存成功。",
                type: "success",
                duration: 2000,
            });
        })
        .catch(() => {
            ElMessage({
                message: "取消保存",
                type: "info",
                duration: 2000,
            });
        });
};

// 如果SSML标签页的话锁定
let apiDisable = ref(false);
watch(page.value, (newValue) => {
    if (newValue.tabIndex === '2') {
        apiDisable.value = true;
        formConfig.value.api = true;
    } else {
        apiDisable.value = false;
    }
});

const strToArr = (str: string) => {
    if (str) {
        const obj = JSON.parse(str);
        return Object.keys(obj).sort((a, b) => obj[a] - obj[b]);
    }
    return []
}



// const voiceStyleSelectListInit = strToArr(defaultVoice?.VoiceStyleNameDefinitions);
const voiceStyleSelectListInit = defaultVoice?.VoiceStyleNames.split(",");
const voiceStyleSelectList: any = ref(voiceStyleSelectListInit);

// const rolePlayListInit = strToArr(defaultVoice?.VoiceRoleNameDefinitions);
const rolePlayListInit = defaultVoice?.VoiceRoleNames.split(",");
const rolePlayList: any = ref(rolePlayListInit);

const voiceSelectChange = (value: string) => {

    const voice = voiceSelectList.value.find(
        (item: any) => item.ShortName == formConfig.value.voiceSelect
    );
    // voiceStyleSelectList.value = strToArr(voice?.VoiceStyleNameDefinitions);
    voiceStyleSelectList.value = voice?.VoiceStyleNames.split(",");
    // rolePlayList.value = strToArr(voice?.VoiceRoleNameDefinitions);
    rolePlayList.value = voice?.VoiceRoleNames.split(",");
    formConfig.value.voiceStyleSelect = voiceStyleSelectList.value.length > 0 ? voiceStyleSelectList.value[0] : "";
    formConfig.value.role = rolePlayList.value.length > 0 ? rolePlayList.value[0] : "";
};
const configChange = (val: string) => {
    formConfig.value = config.value.formConfigJson[val];
};

const startBtn = () => {
    if (page.value.asideIndex == "1" && inputs.value.inputValue == "") {
        ElMessage({
            message: "请输入文字内容。",
            type: "warning",
            duration: 2000,
        });
        return;
    }
    if (page.value.asideIndex == "2" && tableData.value.length == 0) {
        ElMessage({
            message: "列表内容为空。",
            type: "warning",
            duration: 2000,
        });
        return;
    }
    if (isLoading.value) {
        ElMessage({
            message: "请稍候。。。",
            type: "warning",
            duration: 2000,
        });
        return;
    }
    isLoading.value = true;

    ttsStore.start();
};

</script>
  
<style scoped>
.options {
    /* background-color: bisque; */
    padding: 15px 15px;
    border: 1px solid #dcdfe6;
    /* border-radius: 5px; */
}

.el-form {
    /* height: 90%; */
    /* display: flex; */
    /* background-color: gray; */
    /* flex-direction: column; */
}

.el-form-item {
    width: 270px;
    margin-bottom: 10px
}

.el-select {
    width: 100%;
}
.el-select-v2{
    width: 100%;
}
</style>