export default function BlendLogo() {
  return (
    <div
      style={{
        position: "fixed",
        top: "56px",
        left: 0,
        right: 0,
        zIndex: 9999,
        pointerEvents: "none",
        display: "flex",
        justifyContent: "center",
        mixBlendMode: "difference",
      }}
    >
      <img
        src="/omnia-logo.png"
        alt="Omnia"
        style={{
          height: "72px",
          width: "auto",
        }}
      />
    </div>
  );
}
