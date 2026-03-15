import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
  const { data, error } = await supabase
    .from("motorcycles")
    .select("*")
    .limit(1);
  if (error) {
    console.error("Error:", error.message);
    return;
  }
  if (data && data.length > 0) {
    console.log("Columns:", Object.keys(data[0]));
    console.log("Sample item:", JSON.stringify(data[0], null, 2));
  } else {
    console.log("No data found in motorcycles");
  }
}

inspect();
