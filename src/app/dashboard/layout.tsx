export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <div className="overflow-x-hidden overflow-y-clip md:pb-28">{children}</div>;
}
