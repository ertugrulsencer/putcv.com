import { defineStore } from "pinia";

export const useLangStore = defineStore("lang", {
  state: () => ({
    lang: "en",
  }),
});
