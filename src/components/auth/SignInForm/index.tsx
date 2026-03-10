"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { type SignUpInputType, signUpSchema } from "@/@types/SingUpType";
import { supabase } from "@/lib/supabase/cliente";
import SignInFormUI from "./SignInFormUI";

interface SignInFormProps {
  title: "Logística" | "BDC";
}

const SignInForm = ({ title }: SignInFormProps) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
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
    <SignInFormUI
      title={title}
      register={register}
      errors={errors}
      onSubmit={handleSubmit(onSubmit)}
    />
  );
};

export default SignInForm;
