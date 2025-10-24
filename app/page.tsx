import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  // In development mode, bypass auth and go straight to dashboard
  if (process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_DEV_MODE === "true") {
    redirect("/dashboard");
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }
}
