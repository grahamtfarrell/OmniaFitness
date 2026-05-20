import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import PostList from "@/components/admin/PostList";
import { adminBtnPrimary } from "@/components/admin/AdminShell";

export default function AdminDashboardPage() {
  return (
    <>
      <AdminHeader title="Posts" />
      <div className="mb-6">
        <Link href="/admin/posts/new" className={adminBtnPrimary}>
          New post
        </Link>
      </div>
      <PostList />
    </>
  );
}
