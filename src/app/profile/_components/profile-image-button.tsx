import Link from "next/link";

export default function ProfileImageButton({
  children,
  photoURL,
}: {
  children: React.ReactNode;
  photoURL?: string | null;
}) {
  return (
    <Link
      title="View Profile Picture"
      className="w-full h-full relative before:content-[''] before:w-full before:h-full before:absolute hover:before:bg-monochrome-low-opacity before:inset-0"
      href={`/profile/view-photo?photoURL=${photoURL ?? "/placeholder.png"}`}
      prefetch
    >
      {children}
    </Link>
  );
}
