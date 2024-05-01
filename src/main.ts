import { createApp } from "vue";
import "./style.css";
import { VueQueryPlugin } from "@tanstack/vue-query";
// @ts-expect-error
import App from "./App.vue";

createApp(App).use(VueQueryPlugin).mount("#app");
