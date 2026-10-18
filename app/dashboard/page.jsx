
import { auth, signOut } from "@/auth";
import { database } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/");
  }

  const email = session.user.email.trim().toLowerCase();
  const owner = (process.env.OWNER_EMAIL || "").trim().toLowerCase();

  if (owner && email === owner) {
    redirect("/admin");
  }

  const sql = database();

  await sql`
    INSERT INTO membership_requests (email, full_name, status)
    VALUES (${email}, ${session.user.name || "عضو"}, 'PENDING')
    ON CONFLICT (email) DO UPDATE
    SET full_name = EXCLUDED.full_name
  `;

  const rows = await sql`
    SELECT status
    FROM membership_requests
    WHERE email = ${email}
    LIMIT 1
  `;

  const status = rows[0]?.status || "PENDING";

  const messages = {
    PENDING: "تم استلام طلب عضويتك، وهو الآن قيد مراجعة المسؤول.",
    APPROVED: "مبروك! تمت الموافقة على عضويتك.",
    REJECTED: "نعتذر، لم تتم الموافقة على طلب عضويتك.",
    EXCLUDED: "تم استبعاد طلب عضويتك.",
  };

  return (
    <main className="container" style={{ paddingBlock: 40 }}>
      <section className="card">
        <h1>لوحة العضوية</h1>
        <p>أهلًا {session.user.name || "عضو"}</p>
        <p className="status">{messages[status] || "تعذر قراءة الحالة."}</p>
        <p className="small">{email}</p>
        <p className="small">
          إذا اتخذ المسؤول قرارًا جديدًا، حدّث الصفحة لرؤية النتيجة.
        </p>

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button className="primary" type="submit">
            تسجيل الخروج
          </button>
        </form>
      </section>
    </main>
  );
}
