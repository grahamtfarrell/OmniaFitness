import { ImageResponse } from "next/og";
import { getOmniaOIconSrc } from "@/lib/app-icon-image";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
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
        <img src={iconSrc} alt="" width={24} height={24} />
      </div>
    ),
    { ...size }
  );
}
