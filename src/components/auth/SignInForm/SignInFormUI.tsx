import { Lock } from "lucide-react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { SignUpInputType } from "@/@types/SingUpType";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface SignInFormUIProps {
  title: "Logística" | "BDC";
  register: UseFormRegister<SignUpInputType>;
  errors: FieldErrors<SignUpInputType>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

const SignInFormUI = ({
  title,
  register,
  errors,
  onSubmit,
}: SignInFormUIProps) => {
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
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
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

export default SignInFormUI;
