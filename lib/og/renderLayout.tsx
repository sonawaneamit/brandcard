/* @jsxImportSource react */
import { ImageResponse } from "next/og";

type LayoutProps = {
  width: number;
  height: number;
  values: Record<string, string>;
  brand: { 
    primary: string; 
    secondary: string; 
    logoUrl?: string; 
    fontPrimary?: ArrayBuffer 
  };
};

export async function renderOG(props: LayoutProps) {
  const { width, height, values, brand } = props;
  const fontData = brand.fontPrimary;

  return new ImageResponse(
    (
      <div
        style={{
          width,
          height,
          display: "flex",
          background: brand.secondary || "#ffffff",
          color: brand.primary || "#111111",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          fontFamily: "Inter",
        }}
      >
        {values.photo ? (
          <img
            src={values.photo}
            alt="Background"
            style={{ 
              position: "absolute", 
              inset: 0, 
              objectFit: "cover", 
              width: "100%", 
              height: "100%" 
            }}
          />
        ) : null}

        <div
          style={{
            position: "absolute",
            inset: "auto 40px 40px 40px",
            background: "rgba(0,0,0,0.35)",
            padding: "24px",
            borderRadius: 12,
          }}
        >
          <div style={{ 
            fontSize: 64, 
            fontWeight: 800, 
            lineHeight: 1.05, 
            textAlign: "center" 
          }}>
            {values.headline || "Your Headline"}
          </div>
          <div style={{ 
            marginTop: 12, 
            fontSize: 32, 
            textAlign: "center" 
          }}>
            {values.subhead || "Short supporting line goes here"}
          </div>
          <div
            style={{
              marginTop: 18,
              fontSize: 28,
              textAlign: "center",
              background: "#ffffff",
              color: "#111111",
              padding: "10px 18px",
              borderRadius: 8,
              display: "inline-block",
            }}
          >
            {values.cta || "Shop now"}
          </div>
        </div>

        {brand.logoUrl ? (
          <img 
            src={brand.logoUrl} 
            alt="Logo"
            style={{ 
              position: "absolute", 
              top: 28, 
              left: 28, 
              width: 140, 
              height: 40 
            }} 
          />
        ) : null}
      </div>
    ),
    {
      width,
      height,
      fonts: fontData
        ? [{ name: "Inter", data: fontData, weight: 400, style: "normal" }]
        : [],
    }
  );
}
