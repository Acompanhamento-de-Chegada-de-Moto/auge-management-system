"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase/cliente";

const BdcPage = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await supabase.from("motorcycle_arrival").select("*");

        console.log(res.error);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };
    fetchData();
  }, []);
  return <div>BdcPage</div>;
};
export default BdcPage;
