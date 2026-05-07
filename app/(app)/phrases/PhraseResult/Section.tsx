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
      <div className="mb-3 flex items-center gap-2 px-1">
        <span className="text-[#7C3AED]">{icon}</span>
        <h2 className="text-xl font-black text-[#3C3C3C] sm:text-2xl">{title}</h2>
      </div>
      {children}
    </section>
  );
}
