import App from "./App.vue";
import router from "./router";
import { pinia } from "@/stores";
import VWave from "v-wave";
import { isDarkKey } from "./symbols";
import "./main.css";
import "@purge-icons/generated";
import { EventBusEvents } from "@vueuse/core";


const app = createApp(App);

app.use

const isDark = useDark();
app.provide(isDarkKey, isDark);

app.use(router).use(pinia);
app.mount("#app");
