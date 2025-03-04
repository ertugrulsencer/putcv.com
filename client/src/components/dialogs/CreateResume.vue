<script setup>
import { i18nDashboard } from "@/i18n/View";
import { useAccountStore } from "@/stores/account";
import { useDialogStore } from "@/stores/dialog";
import { useLangStore } from "@/stores/i18n";
import validation from "@/validations/create_resume";
import { reactive, watch } from "vue";

const accountStore = useAccountStore();
const dialogStore = useDialogStore();
const langStore = useLangStore();

const form_data = reactive({
  title: "",
  objective: "",
});

watch(
  () => dialogStore.create_resume,
  () => {
    form_data.title = accountStore.full_name + " CV";
  }
);
</script>

<template>
  <Dialog
    v-model:visible="dialogStore.create_resume"
    modal
    dismissable-mask
    position="center"
    :draggable="false"
  >
    <template #header>
      <h3>{{ i18nDashboard.createResumeDialogTitle[langStore.lang] }}</h3>
    </template>
    <template #default>
      <Form
        :resolver="validation(langStore.lang)"
        :initial-values="form_data"
        :validate-on-blur="true"
      >
        <FormField v-slot="$field" name="title">
          <FloatLabel variant="on">
            <InputText v-model="form_data.title" fluid />
            <label>{{
              i18nDashboard.createResumeFormTitle[langStore.lang]
            }}</label>
          </FloatLabel>
          <Message
            v-if="$field.invalid"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $field.error?.message }}
          </Message>
        </FormField>
        <FormField v-slot="$field" name="objective">
          <FloatLabel variant="on">
            <InputText v-model="form_data.objective" fluid />
            <label>{{
              i18nDashboard.createResumeFormObjective[langStore.lang]
            }}</label>
          </FloatLabel>
          <Message
            v-if="$field.invalid"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $field.error?.message }}
          </Message>
        </FormField>
      </Form>
    </template>
    <template #footer>
      <Button label="Oluştur" />
    </template>
  </Dialog>
</template>

<style scoped></style>

<style>
.p-dialog {
  width: 300px;
}
.p-dialog-content {
  overflow: visible !important;
}
</style>
