import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center text-6xl">🎓</div>
          <h1 className="mb-2 text-3xl font-bold text-zinc-800">
            Welcome to Codyssey
          </h1>
          <p className="text-zinc-600">
            Your gamified journey to building amazing projects
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}

