import AdminHeader from "@/components/admin/AdminHeader";
import PostEditorForm from "@/components/admin/PostEditorForm";

export default function NewPostPage() {
  return (
    <>
      <AdminHeader title="New post" />
      <PostEditorForm />
    </>
  );
}
