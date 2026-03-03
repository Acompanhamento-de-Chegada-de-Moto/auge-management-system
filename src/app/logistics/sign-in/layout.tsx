"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/cliente";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("user")
        .select("role")
        .eq("id", user.id)
        .single();

      if (error || !data) {
        setLoading(false);
        return;
      }

      if (data.role === "LOGISTICS") {
        router.replace("/logistics");
        return;
      }

      setLoading(false);
    };

    checkUser();
  }, [router]);

  if (loading) return null;

  return <>{children}</>;
};

export default Layout;
