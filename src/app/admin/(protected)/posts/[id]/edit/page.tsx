import { notFound } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import PostEditorForm from "@/components/admin/PostEditorForm";
import { getPostByIdAdmin } from "@/lib/blog/queries";

type PageProps = { params: { id: string } };

export default async function EditPostPage({ params }: PageProps) {
  let post;
  try {
    post = await getPostByIdAdmin(params.id);
  } catch {
    notFound();
  }

  if (!post) notFound();

  return (
    <>
      <AdminHeader title="Edit post" />
      <PostEditorForm postId={post.id} initial={post} />
    </>
  );
}
