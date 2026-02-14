export function Sidebar() {
  return (
    <aside className="w-64 border-r border-zinc-800 bg-zinc-950 p-6">
      <h1 className="text-lg font-semibold mb-8">Finance Tracker</h1>

      <nav className="space-y-2 text-zinc-400">
        <div className="hover:text-white cursor-pointer">Dashboard</div>
        <div className="hover:text-white cursor-pointer">Transactions</div>
        <div className="hover:text-white cursor-pointer">Profile</div>
        <div className="hover:text-white cursor-pointer">Settings</div>
      </nav>
    </aside>
  );
}
