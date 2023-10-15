import { App } from "vue";
import registerElement from "./registerElement";
import initStore from "./initLocalStore";

export function globalRegister(app: App) {
    initStore();
    app.use(registerElement);
}
