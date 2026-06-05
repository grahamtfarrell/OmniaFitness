import { ImageResponse } from "next/og";
import { getOmniaOIconSrc } from "@/lib/app-icon-image";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const iconSrc = await getOmniaOIconSrc();

  return new ImageResponse(
    (
      <div
        style={{
          background: "#000000",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img src={iconSrc} alt="" width={140} height={140} />
      </div>
    ),
    { ...size }
  );
}
