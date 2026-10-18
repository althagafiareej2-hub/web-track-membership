
export default function DeniedPage() {
  return (
    <main className="container" style={{ paddingBlock: 40 }}>
      <section className="card">
        <h1>لا يمكن الدخول</h1>
        <p>
          عذرًا، لا تملكين صلاحية الوصول إلى هذه الصفحة.
        </p>
        <a href="/" className="primary">
          العودة للصفحة الرئيسية
        </a>
      </section>
    </main>
  );
}
