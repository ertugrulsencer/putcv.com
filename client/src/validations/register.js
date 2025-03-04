import i18nValidation from "@/i18n/Validation.json";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";

export default (lang) =>
  zodResolver(
    z
      .object({
        first_name: z
          .string()
          .trim()
          .nonempty(i18nValidation.register["first_name.nonempty"][lang]),
        last_name: z
          .string()
          .trim()
          .nonempty(i18nValidation.register["last_name.nonempty"][lang]),
        email: z
          .string()
          .trim()
          .nonempty(i18nValidation.register["email.nonempty"][lang])
          .email(i18nValidation.register["email.email"][lang]),
        password: z
          .string()
          .trim()
          .nonempty(i18nValidation.register["password.nonempty"][lang])
          .min(8, {
            message: i18nValidation.register["password.min"][lang],
          }),
        password_re: z
          .string()
          .trim()
          .nonempty(i18nValidation.register["password_re.nonempty"][lang])
          .min(8, {
            message: i18nValidation.register["password_re.min"][lang],
          }),
      })
      .refine((data) => data.password === data.password_re, {
        message: i18nValidation.register["password_re.refine"][lang],
        path: ["password_re"],
      })
  );
