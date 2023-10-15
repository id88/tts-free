import { createApp } from 'vue'
// import "./style.css"
import App from './App.vue'
// import './samples/node-api'
import { globalRegister } from "./global";
import { createPinia } from "pinia";

const app = createApp(App) as any;
const pinia = createPinia();

app.use(pinia);
app.use(globalRegister);
app.mount("#app").$nextTick(() => {
    postMessage({ payload: "removeLoading" }, "*");
});
