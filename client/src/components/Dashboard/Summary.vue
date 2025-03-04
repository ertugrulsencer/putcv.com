<script setup>
import { i18nDashboard } from "@/i18n/View";
import { useAccountStore } from "@/stores/account";
import { useLangStore } from "@/stores/i18n";

const accountStore = useAccountStore();
const langStore = useLangStore();
</script>

<template>
  <section class="summary">
    <h3>
      <span>👋</span> {{ i18nDashboard.summaryGreeting[langStore.lang] }}
      <skeleton
        width="200px"
        style="display: inline-block"
        v-if="!accountStore.account"
      ></skeleton>
      <template v-else>{{ accountStore.account?.first_name }}</template
      >.
    </h3>
    <Message
      icon="pi pi-info-circle"
      class="mt-5"
      v-if="accountStore?.account?.status === 'NEW'"
      closable
      severity="warn"
    >
      Lütfen e-postanıza gelen linki ile hesabınızı doğrulayınız.
    </Message>
  </section>
</template>

<style>
.summary {
  margin-bottom: 2.5rem;
  h3 {
    font-size: 2rem;
    span {
      margin-right: 1rem;
    }
  }
}
</style>
