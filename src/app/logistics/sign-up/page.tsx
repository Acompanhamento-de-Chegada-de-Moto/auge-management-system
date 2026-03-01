"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SignInForm from "@/components/SignInForm";
import { createComponentClient } from "@/lib/supabase/cliente";

const SignInLogistics = () => {
  const supabase = createComponentClient();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        router.replace("/logistics");
      } else {
        setChecking(false);
      }
    }

    checkUser();
  }, [router, supabase]);

  if (checking) {
    return <div className="p-6">Carregando...</div>;
  }

  return (
    <div>
      <SignInForm />
    </div>
  );
};

export default SignInLogistics;
