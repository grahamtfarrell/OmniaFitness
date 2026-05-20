import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin/session";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ok = await isAdminAuthenticated();
  if (!ok) {
    redirect("/admin/login?from=/admin");
  }
  return <>{children}</>;
}
