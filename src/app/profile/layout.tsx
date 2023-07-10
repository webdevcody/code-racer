import { ProfileNavigation } from "./_components";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={
        "container bg-background py-8 h-[clamp(50rem,90dvh,70rem)] flex flex-col justify-center items-center gap-8 md:flex-row"
      }
    >
      <aside className="mx-auto md:h-full md:w-24 xl:w-[21%] w-full shadow-md shadow-monochrome rounded-lg p-2 md:p-6 xl:p-8">
        <nav className="w-full">
          <ProfileNavigation />
        </nav>
      </aside>
      <div className="h-full md:w-[88%] xl:w-[79%] w-full shadow-md shadow-monochrome rounded-lg p-8 md:p-6 lg:p-8">
        {children}
      </div>
    </div>
  );
}
