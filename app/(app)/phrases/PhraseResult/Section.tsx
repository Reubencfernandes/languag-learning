export function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-4 flex items-center gap-2.5 px-1">
        <span className="text-black font-black">{icon}</span>
        <h2 className="text-xl font-black text-black tracking-tight sm:text-2xl">{title}</h2>
      </div>
      {children}
    </section>
  );
}
