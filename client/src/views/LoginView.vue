<script setup>
import LoginForm from "@/components/Login/LoginForm.vue";
</script>

<template>
  <main class="login-view">
    <login-form></login-form>
  </main>
</template>

<style scoped>
main.login-view {
  height: 100vh;
  display: grid;
  place-items: center;
  background: var(--color-light);
}
</style>
