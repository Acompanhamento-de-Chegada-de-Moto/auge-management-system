"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { type SignUpInputType, signUpSchema } from "@/@types/SingUpType";
import { supabase } from "@/lib/supabase/cliente";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";

interface SignInFormProps {
  title: "Logística" | "BDC";
}

const SignInForm = ({ title }: SignInFormProps) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<SignUpInputType>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpInputType) => {
    const {
      data: { user },
      error,
    } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      alert("Não foi possível fazer login");
      console.log(error);
      return;
    }

    return router.push("/logistics");
  };

  return (
    <div className="flex items-center justify-center py-20">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-primary/10">
            <Lock className="size-5 text-primary" />
          </div>
          <CardTitle>Acesso {title}</CardTitle>
          <CardDescription>
            Digite a senha para acessar o painel de {title.toLowerCase()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1">
              <Input {...register("email")} type="email" placeholder="Email" />
              {errors && (
                <p className="text-xs text-red-600">{errors.email?.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <Input
                {...register("password")}
                type="password"
                placeholder="Senha de acesso"
                autoComplete="current-password"
              />
              {errors && (
                <p className="text-xs text-red-600">
                  {errors.password?.message}
                </p>
              )}
            </div>
            <Button className="w-full">Entrar</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
export default SignInForm;
