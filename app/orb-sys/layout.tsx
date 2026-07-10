import AdminLayoutWrapper from "@/components/admin/AdminLayoutWrapper";

export const metadata = {
  title: "Orbit Admin | Yönetim Paneli",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>;
}
