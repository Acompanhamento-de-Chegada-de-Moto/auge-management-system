import { z } from "zod";

export const signUpSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(6, "Senha precisa ter no mínimo 6 caracteres"),
});

export type SignUpInputType = z.infer<typeof signUpSchema>;
