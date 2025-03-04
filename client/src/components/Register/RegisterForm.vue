<script setup>
import { reactive } from "vue";
import { FloatLabel, useToast } from "primevue";
import { useLangStore } from "@/stores/i18n";
import { useAccountStore } from "@/stores/account";
import { i18nRegister } from "@/i18n/View.js";
import validation from "@/validations/register";
import { useRouter } from "vue-router";
import { googleTokenLogin } from "vue3-google-login";

const router = useRouter();

const langStore = useLangStore();
const accountStore = useAccountStore();

const toast = useToast();

const form_data = reactive({
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  password_re: "",
});

const googleSignIn = async () => {
  let access_token;
  try {
    const response = await googleTokenLogin();
    access_token = response.access_token;
  } catch (error) {}
  if (!access_token) return;
  try {
    const google_auth = await accountStore.googleAuth({ access_token });
    toast.add({
      detail: google_auth.message,
      severity: google_auth.severity,
      closable: true,
      life: 5000,
    });
    return router.push({ name: "dashboard" });
  } catch (error) {
    return toast.add({
      detail: error.validation_errors
        ? error.validation_errors.map((e) => e.message).join("\n")
        : error.message,
      severity: error.severity.replace(/warning/g, "warn"),
      closable: true,
      life: 5000,
    });
  }
};

const register = async ({ valid }) => {
  if (!valid) return;
  try {
    const register = await accountStore.register(form_data);
    toast.add({
      detail: register.message,
      severity: register.severity,
      closable: true,
      life: 5000,
    });
    return router.push({ name: "dashboard" });
  } catch (error) {
    return toast.add({
      detail: error.validation_errors
        ? error.validation_errors.map((e) => e.message).join("\n")
        : error.message,
      severity: error.severity.replace(/warning/g, "warn"),
      closable: true,
      life: 5000,
    });
  }
};
</script>

<template>
  <Form
    :resolver="validation(langStore.lang)"
    :initial-values="form_data"
    :validate-on-blur="true"
    class="register-form"
    @submit="register"
  >
    <header class="form-header">
      <img src="@/assets/images/logo.svg" alt="logo" height="75" />
      <div class="content">
        <h1>{{ i18nRegister.formHeaderTitle[langStore.lang] }}</h1>
        <p>{{ i18nRegister.formHeaderDescription[langStore.lang] }}</p>
      </div>
    </header>
    <div class="form-flex">
      <FormField v-slot="$field" name="first_name">
        <InputGroup>
          <InputGroupAddon>
            <i class="pi pi-user"></i>
          </InputGroupAddon>
          <FloatLabel variant="on">
            <InputText
              v-model="form_data.first_name"
              :disabled="accountStore.google_auth_loading"
            />
            <label>{{ i18nRegister.formFieldFirstName[langStore.lang] }}</label>
          </FloatLabel>
        </InputGroup>
        <Message
          v-if="$field.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $field.error.message }}
        </Message>
      </FormField>
      <FormField v-slot="$field" name="last_name">
        <InputGroup>
          <InputGroupAddon>
            <i class="pi pi-user"></i>
          </InputGroupAddon>
          <FloatLabel variant="on">
            <InputText
              v-model="form_data.last_name"
              :disabled="accountStore.google_auth_loading"
            />
            <label>{{ i18nRegister.formFieldLastName[langStore.lang] }}</label>
          </FloatLabel>
        </InputGroup>
        <Message
          v-if="$field.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $field.error?.message }}
        </Message>
      </FormField>
    </div>
    <FormField v-slot="$field" name="email">
      <InputGroup>
        <InputGroupAddon>
          <i class="pi pi-at"></i>
        </InputGroupAddon>
        <FloatLabel variant="on">
          <InputText
            v-model="form_data.email"
            :disabled="accountStore.google_auth_loading"
          />
          <label>{{ i18nRegister.formFieldEmail[langStore.lang] }}</label>
        </FloatLabel>
      </InputGroup>
      <Message
        v-if="$field.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $field.error?.message }}
      </Message>
    </FormField>
    <FormField v-slot="$field" name="password">
      <InputGroup>
        <InputGroupAddon>
          <i class="pi pi-key"></i>
        </InputGroupAddon>
        <FloatLabel variant="on">
          <Password
            v-model="form_data.password"
            :feedback="false"
            :toggle-mask="true"
            :disabled="accountStore.google_auth_loading"
          />
          <label>{{ i18nRegister.formFieldPassword[langStore.lang] }}</label>
        </FloatLabel>
      </InputGroup>
      <Message
        v-if="$field.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $field.error?.message }}
      </Message>
    </FormField>
    <FormField v-slot="$field" name="password_re">
      <InputGroup>
        <InputGroupAddon>
          <i class="pi pi-key"></i>
        </InputGroupAddon>
        <FloatLabel variant="on">
          <Password
            v-model="form_data.password_re"
            :feedback="false"
            :toggle-mask="true"
            :disabled="accountStore.google_auth_loading"
          />
          <label>{{ i18nRegister.formFieldPasswordRe[langStore.lang] }}</label>
        </FloatLabel>
      </InputGroup>
      <Message
        v-if="$field.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $field.error?.message }}
      </Message>
    </FormField>
    <Button
      type="submit"
      :label="i18nRegister.formButtonSubmit[langStore.lang]"
      :loading="accountStore.register_loading"
      fluid
    />
    <div class="form-flex center">
      <hr class="flex-fill" />
      <strong class="my-4 small muted">
        {{ i18nRegister.formButtonsSplit[langStore.lang] }}
      </strong>
      <hr class="flex-fill" />
    </div>
    <Button
      type="button"
      severity="contrast"
      icon="pi pi-google"
      icon-class="me-3"
      :label="i18nRegister.formButtonGoogle[langStore.lang]"
      :loading="accountStore.google_auth_loading"
      class="mb-5"
      fluid
      @click="googleSignIn"
    />
    <Button
      type="button"
      severity="contrast"
      variant="text"
      :label="i18nRegister.formButtonLogin[langStore.lang]"
      fluid
      @click="$router.push({ name: 'login' })"
    />
  </Form>
</template>

<style scoped>
.register-form {
  width: 95%;
  max-width: 450px;
  padding: 2rem 1.5rem;
  border-radius: 1rem;
  background: white;
  color: var(--color-dark);
  box-shadow: var(--form-shadow);
  .form-header {
    display: flex;
    align-items: center;
    margin-bottom: 2rem;
    img {
      margin-right: 1rem;
    }
    h1 {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }
    p {
      font-size: 0.9rem;
      line-height: 135%;
      color: var(--color-muted);
    }
  }
}
</style>
