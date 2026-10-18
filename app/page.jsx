
import { auth, signIn } from "@/auth";

export default async function HomePage() {
  const session = await auth();

  return (
    <main
      className="container"
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        paddingBlock: 40,
      }}
    >
      <section
        className="card"
        style={{ width: "100%", maxWidth: 520, textAlign: "center" }}
      >
        <div style={{ fontSize: 42, marginBottom: 12 }}>🔐</div>

        <h1>بوابة عضوية المسار التقني</h1>

        <p style={{ color: "#64748b" }}>
          سجّل دخولك بحساب Google لإرسال طلب الانضمام إلى المسار.
        </p>

        {session?.user ? (
          <div>
            <p>أهلًا {session.user.name || session.user.email}</p>
            <p>تم تسجيل دخولك بنجاح.</p>
            <a href="/dashboard">الانتقال إلى لوحة العضوية</a>
          </div>
        ) : (
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/dashboard" });
            }}
          >
            <button className="primary" type="submit">
              تسجيل الدخول باستخدام Google
            </button>
          </form>
        )}

        <p style={{ fontSize: 13, color: "#64748b", marginTop: 24 }}>
          الوصول إلى العضوية يخضع لموافقة المسؤول.
        </p>
      </section>
    </main>
  );
}
