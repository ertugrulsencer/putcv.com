import i18nValidation from "@/i18n/Validation.json";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";

export default (lang) =>
  zodResolver(
    z.object({
      title: z
        .string()
        .trim()
        .nonempty(i18nValidation.create_resume["title.nonempty"][lang]),
      objective: z.string().trim(),
      job_title: z.string().trim(),
      job_description: z.string().trim(),
    })
  );
