// app/admin/layout.tsx
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <aside className="w-64 p-4 bg-gray-100 h-screen">
        <p className="font-bold">Admin Sidebar</p>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
