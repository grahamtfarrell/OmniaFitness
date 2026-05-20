const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/pjpeg",
]);

const HEIC_TYPES = new Set(["image/heic", "image/heif"]);

export function validateCoverFile(file: File): { ok: true; contentType: string } | { ok: false; error: string } {
  if (HEIC_TYPES.has(file.type) || /\.heic$/i.test(file.name) || /\.heif$/i.test(file.name)) {
    return {
      ok: false,
      error:
        "iPhone HEIC photos are not supported. On your phone: Photos → Share → Save as JPEG, or email the image to yourself and download the JPG.",
    };
  }

  let contentType = file.type;
  if (!ALLOWED_TYPES.has(contentType)) {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext === "jpg" || ext === "jpeg") contentType = "image/jpeg";
    else if (ext === "png") contentType = "image/png";
    else if (ext === "webp") contentType = "image/webp";
  }

  if (!ALLOWED_TYPES.has(contentType) && !["image/jpeg", "image/png", "image/webp"].includes(contentType)) {
    return {
      ok: false,
      error: "Use a JPEG, PNG, or WebP image (max 5MB).",
    };
  }

  return { ok: true, contentType };
}

export function extensionForContentType(contentType: string): string {
  if (contentType === "image/png") return "png";
  if (contentType === "image/webp") return "webp";
  return "jpg";
}
