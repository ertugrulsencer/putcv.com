import { ref, computed } from "vue";
import { useLangStore } from "./i18n";
import { defineStore } from "pinia";
import AccountService from "@/services/Account";

export const useAccountStore = defineStore("account", {
  state: () => ({
    token: null,
    account: null,
    // * Loading
    google_auth_loading: false,
    register_loading: false,
    login_loading: false,
    check_auth_loading: false,
  }),
  getters: {
    first_letter: (state) => state.account.first_name.slice(0, 1),
    full_name: (state) =>
      state.account
        ? `${state.account.first_name} ${state.account.last_name}`
        : null,
  },
  actions: {
    async googleAuth(data) {
      const langStore = useLangStore();
      this.google_auth_loading = true;
      try {
        const result = await AccountService.googleAuth(data, {
          lang: langStore.lang,
        });
        localStorage.setItem("TOKEN", result.data.access_token);
        this.token = result.data.access_token;
        this.account = result.data.account;
        return result;
      } catch (error) {
        throw error;
      } finally {
        this.google_auth_loading = false;
      }
    },
    async register(data) {
      const langStore = useLangStore();
      this.register_loading = true;
      try {
        const result = await AccountService.register(data, {
          lang: langStore.lang,
        });
        localStorage.setItem("TOKEN", result.data.access_token);
        this.token = result.data.access_token;
        this.account = result.data.new_account;
        return result;
      } catch (error) {
        throw error;
      } finally {
        this.register_loading = false;
      }
    },
    async login(data) {
      const langStore = useLangStore();
      this.login_loading = true;
      try {
        const result = await AccountService.login(data, {
          lang: langStore.lang,
        });
        localStorage.setItem("TOKEN", result.data.access_token);
        this.token = result.data.access_token;
        this.account = result.data.account;
        return result;
      } catch (error) {
        throw error;
      } finally {
        this.login_loading = false;
      }
    },
    async checkAuth() {
      const langStore = useLangStore();
      this.check_auth_loading = true;
      try {
        const result = await AccountService.checkAuth(
          { token: this.token },
          { lang: langStore.lang }
        );
        this.account = result.data.account;
        return result;
      } catch (error) {
        this.token = null;
        this.account = null;
        localStorage.removeItem("TOKEN");
        throw error;
      } finally {
        this.check_auth_loading = false;
      }
    },
    logout() {
      this.token = null;
      this.account = null;
      localStorage.removeItem("TOKEN");
    },
  },
});
