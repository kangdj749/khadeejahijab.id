export function cloudinaryImage(url?: string, width = 800): string {
  if (!url) return "/placeholder.png";
  if (!url.includes("cloudinary.com")) return url;

  return url.replace(
    "/upload/",
    `/upload/f_auto,q_auto,w_${width},c_limit/`
  );
}

type UploadResult = {
  secure_url: string;
  public_id: string;
};

export async function uploadToCloudinary(
  file: File,
  folder = "products/gallery"
): Promise<UploadResult> {
  const sigRes = await fetch("/api/cloudinary/signature", { method: "POST" });
  const sig = await sigRes.json();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", sig.apiKey);
  formData.append("timestamp", sig.timestamp);
  formData.append("signature", sig.signature);
  formData.append("folder", folder);

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!uploadRes.ok) throw new Error("Upload Cloudinary gagal");

  return uploadRes.json();
}
