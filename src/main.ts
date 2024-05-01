import { createApp } from "vue";
import "./style.css";
import { VueQueryPlugin } from "@tanstack/vue-query";
import MasteryList from "./components/mastery/MasteryList.vue";
import ky from "ky";

export const apiClient = ky.create({
  prefixUrl: import.meta.env.VITE_API_URL,
});

createApp(MasteryList).use(VueQueryPlugin).mount("#app");
