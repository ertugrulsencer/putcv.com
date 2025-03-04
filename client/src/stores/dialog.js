import { defineStore } from "pinia";

export const useDialogStore = defineStore("dialog", {
  state: () => ({
    create_resume: false,
  }),
  actions: {
    show(name) {
      this[name] = true;
    },
    hide(name) {
      this[name] = false;
    },
    toggle(name) {
      this[name] = !this[name];
    },
  },
});
