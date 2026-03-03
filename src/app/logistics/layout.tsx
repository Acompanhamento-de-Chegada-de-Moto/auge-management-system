"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase/cliente";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/logistics/sign-in");
        return;
      }

      // 2️⃣ Busca o usuário na sua tabela public.user
      const { data, error } = await supabase
        .from("user")
        .select("role")
        .eq("id", user.id)
        .single();

      if (error || !data) {
        router.push("/logistics/sign-in");
        return;
      }

      // 3️⃣ Verifica role
      if (data.role !== "LOGISTICS") {
        router.push("/");
        return;
      }
    };

    checkUser();
  }, [router]);

  return <div>{children}</div>;
};

export default Layout;
