<script setup>
import { useResumeStore } from "@/stores/resume";
import { useDialogStore } from "@/stores/dialog";
const resumeStore = useResumeStore();
const dislogStore = useDialogStore();

const showCreateResumeDialog = () => {
  dislogStore.create_resume = true;
};
</script>

<template>
  <section class="resume-list" v-if="resumeStore.list_loading">
    <Skeleton v-for="i in 3" :key="i" width="240px" height="350px"></Skeleton>
  </section>
  <section class="resume-list" v-else>
    <button class="create-resume" @click="showCreateResumeDialog" v-ripple>
      <i class="pi pi-plus"></i>
      <strong>Yeni Özgeçmiş Oluştur</strong>
    </button>
    <div
      class="resume"
      v-for="resume_item in resumeStore.list"
      :key="resume_item.id"
    >
      <strong class="resume-title">{{ resume_item.title }}</strong>
      <div class="form-flex">
        <Button
          severity="contrast"
          size="small"
          label="Düzenle"
          icon="pi pi-pencil"
          fluid
        ></Button>
        <Button
          severity="secondary"
          size="small"
          icon="pi pi-ellipsis-h"
        ></Button>
      </div>
    </div>
  </section>
</template>

<style scoped>
section.resume-list {
  display: flex;
  justify-content: flex-start;
  gap: 2rem;
  flex-wrap: wrap;
  .create-resume {
    outline: none;
    background-color: white;
    cursor: pointer;
    width: 240px;
    height: 350px;
    color: var(--color-muted);
    border: 2px dashed var(--color-muted);
    border-radius: 1rem;
    display: grid;
    place-items: center;
    padding: 1.5rem;
    text-align: center;
    transition: all 200ms ease-in-out;
    .pi {
      font-size: 2.5rem;
    }
    strong {
      font-size: 1.25rem;
      line-height: 150%;
    }
    &:hover {
      border-color: var(--color-dark);
      color: var(--color-dark);
      .pi {
        transition: all 200ms ease-in-out;
        transform: rotate(90deg);
      }
    }
  }
  .resume {
    padding: 1rem;
    width: 240px;
    height: 350px;
    border: 2px solid var(--color-gray);
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    .resume-title {
      margin: auto 0 0.75rem;
      font-size: 0.9rem;
    }
  }
}
</style>
