
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/");
  }

  return (
    <main className="container" style={{ paddingBlock: 40 }}>
      <section className="card">
        <h1>لوحة العضوية</h1>

        <p>أهلًا {session.user.name || session.user.email}</p>

        <p>
          تم تسجيل دخولك بنجاح. ستظهر حالة طلب العضوية هنا بعد ربط قاعدة
          البيانات.
        </p>

        <p style={{ color: "#64748b" }}>
          حالة الطلب: بانتظار تجهيز نظام العضويات.
        </p>

        <a href="/">العودة إلى الصفحة الرئيسية</a>
      </section>
    </main>
  );
}
