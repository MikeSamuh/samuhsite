import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#0B0A0A",
        color: "#F2EDE7",
        fontFamily: "var(--font-inter), system-ui, sans-serif",
        padding: 24,
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 460 }}>
        <p
          style={{
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#9A918A",
            margin: "0 0 18px",
          }}
        >
          Samuh &middot; website
        </p>
        <h1 style={{ fontSize: 30, fontWeight: 500, margin: "0 0 14px", lineHeight: 1.2 }}>
          Nothing here yet.
        </h1>
        <p style={{ color: "#9A918A", lineHeight: 1.6, margin: "0 0 30px", fontSize: 15 }}>
          The site gets built on top of whichever direction you pick.
        </p>
        <Link
          href="/design"
          style={{
            display: "inline-block",
            padding: "13px 26px",
            background: "#D98BA8",
            color: "#0B0A0A",
            textDecoration: "none",
            fontSize: 15,
            fontWeight: 500,
          }}
        >
          Open the direction configurator &rarr;
        </Link>
      </div>
    </main>
  );
}
