
import { auth, signOut } from "@/auth";
import { database } from "@/lib/db";
import { redirect } from "next/navigation";
import { decideMembership } from "./actions";

export default async function AdminPage() {
  const session = await auth();
  const email = session?.user?.email?.trim().toLowerCase();
  const owner = process.env.OWNER_EMAIL?.trim().toLowerCase();

  if (!email) redirect("/");
  if (!owner || email !== owner) redirect("/dashboard");

  const sql = database();
  const requests = await sql`
    SELECT email, full_name, status, created_at, updated_at
    FROM membership_requests
    ORDER BY created_at DESC
  `;

  const labels = {
    PENDING: "قيد المراجعة",
    APPROVED: "مقبول",
    REJECTED: "مرفوض",
    EXCLUDED: "مستبعد",
  };

  return (
    <main className="container" style={{ paddingBlock: 40 }}>
      <section className="card">
        <h1>لوحة إدارة العضويات</h1>
        <p>أهلًا بمالك الموقع، هنا تراجع الطلبات وتتخذ القرار.</p>
        <p>عدد الطلبات: {requests.length}</p>

        {requests.length === 0 && <p>لا توجد طلبات حتى الآن.</p>}

        {requests.map((item) => (
          <div className="card" key={item.email} style={{ marginTop: 16 }}>
            <strong>{item.full_name}</strong>
            <p className="small">{item.email}</p>
            <p className="status">
              الحالة: {labels[item.status] || item.status}
            </p>

            <div className="actions">
              {[
                ["APPROVED", "قبول"],
                ["REJECTED", "رفض"],
                ["EXCLUDED", "استبعاد"],
              ].map(([value, title]) => (
                <form action={decideMembership} key={value}>
                  <input type="hidden" name="email" value={item.email} />
                  <input type="hidden" name="decision" value={value} />
                  <button type="submit" className="primary">
                    {title}
                  </button>
                </form>
              ))}
            </div>
          </div>
        ))}

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button className="primary" type="submit" style={{ marginTop: 20 }}>
            تسجيل الخروج
          </button>
        </form>
      </section>
    </main>
  );
}
