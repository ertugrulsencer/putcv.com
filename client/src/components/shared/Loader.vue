<template>
  <div class="app-loader">
    <i class="pi pi-spin pi-spinner"></i>
  </div>
</template>

<style scoped>
.app-loader {
  display: grid;
  place-items: center;
  position: fixed;
  z-index: 9999;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  color: var(--color-primary);
  .pi {
    font-size: 3rem;
    filter: drop-shadow(0 0 6px var(--color-primary));
  }
}
</style>
