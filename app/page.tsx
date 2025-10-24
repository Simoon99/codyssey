import { redirect } from "next/navigation";

export default async function Home() {
  // Always go straight to dashboard (auth removed)
  redirect("/dashboard");
}
