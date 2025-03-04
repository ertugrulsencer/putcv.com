import i18nValidation from "@/i18n/Validation.json";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";

export default (lang) =>
  zodResolver(
    z.object({
      email: z
        .string()
        .trim()
        .nonempty(i18nValidation.login["email.nonempty"][lang])
        .email(i18nValidation.login["email.email"][lang]),
      password: z
        .string()
        .trim()
        .nonempty(i18nValidation.login["password.nonempty"][lang]),
    })
  );
