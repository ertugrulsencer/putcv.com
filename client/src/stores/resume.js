import { useLangStore } from "./i18n";
import { useAccountStore } from "./account";
import { defineStore } from "pinia";
import ResumeService from "@/services/Resume";

export const useResumeStore = defineStore("resume", {
  state: () => ({
    list: [],
    list_loading: false,
  }),
  actions: {
    async getList(data) {
      const langStore = useLangStore();
      const accountStore = useAccountStore();
      this.list_loading = true;
      try {
        const result = await ResumeService.list(data, {
          lang: langStore.lang,
          token: accountStore.token,
        });
        this.list = result.data.list;
        return result;
      } catch (error) {
        throw error;
      } finally {
        this.list_loading = false;
      }
    },
  },
});
