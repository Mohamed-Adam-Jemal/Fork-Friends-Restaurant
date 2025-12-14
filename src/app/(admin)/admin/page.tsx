export default async function AdminDashboardPage() {
 
  return (
    <div className="space-y-10 px-6 sm:px-8 lg:px-12 py-8 overflow-y-auto bg-gray-50 min-h-screen rounded-3xl mt-6">
      {/* Welcome Header */}
      <div className="bg-[#C8AD82] rounded-lg p-6">
        <h1 className="text-2xl md:text-3xl font-bold !text-white break-words">
          Welcome to Dashboard
        </h1>
        <p className="text-white text-lg mt-1">Here's the overview for today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard title="Today's Orders" value="32" bgColor="bg-white" />
        <DashboardCard title="New Reservations" value="14" bgColor="bg-white" />
        <DashboardCard title="Team Online" value="5" bgColor="bg-white" />
        <DashboardCard title="Pending Reviews" value="7" bgColor="bg-white" />
      </div>

      {/* Revenue Summary */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Revenue Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <RevenueCard label="Today" amount="$1,250" />
          <RevenueCard label="This Week" amount="$8,450" />
          <RevenueCard label="This Month" amount="$32,100" />
        </div>
      </div>

      {/* Upcoming Reservations */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Reservations</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border-separate border-spacing-y-2">
            <thead className="bg-gray-100 rounded-t-lg">
              <tr>
                <th className="px-4 py-2 font-medium text-gray-600">Customer</th>
                <th className="px-4 py-2 font-medium text-gray-600">Time</th>
                <th className="px-4 py-2 font-medium text-gray-600">Guests</th>
                <th className="px-4 py-2 font-medium text-gray-600">Table</th>
                <th className="px-4 py-2 font-medium text-gray-600">Type</th>
                <th className="px-4 py-2 font-medium text-gray-600">Contact</th>
              </tr>
            </thead>
            <tbody>
              <ReservationRow 
                name="John Doe" 
                time="6:30 PM" 
                guests={4} 
                table="5" 
                type="Indoor" 
                contact="john@example.com"
              />
              <ReservationRow 
                name="Alice Smith" 
                time="7:00 PM" 
                guests={2} 
                table="2" 
                type="Outdoor" 
                contact="alice@example.com"
              />
              <ReservationRow 
                name="Mark Lee" 
                time="7:30 PM" 
                guests={6} 
                table="7" 
                type="Indoor" 
                contact="mark@example.com"
              />
            </tbody>
          </table>
        </div>
      </div>

      {/* Orders in Progress */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Orders in Progress</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border-separate border-spacing-y-2">
            <thead className="bg-gray-100 rounded-t-lg">
              <tr>
                <th className="px-4 py-2 font-medium text-gray-600">Order ID</th>
                <th className="px-4 py-2 font-medium text-gray-600">Items</th>
                <th className="px-4 py-2 font-medium text-gray-600">Total</th>
                <th className="px-4 py-2 font-medium text-gray-600">Status</th>
                <th className="px-4 py-2 font-medium text-gray-600">Customer</th>
              </tr>
            </thead>
            <tbody>
              <OrderRow 
                id="#1023" 
                items="Pasta, Salad" 
                total="$25" 
                status="Preparing" 
                customer="John Doe" 
              />
              <OrderRow 
                id="#1024" 
                items="Pizza, Coke" 
                total="$18" 
                status="Cooking" 
                customer="Alice Smith" 
              />
              <OrderRow 
                id="#1025" 
                items="Burger, Fries" 
                total="$22" 
                status="Out for delivery" 
                customer="Mark Lee" 
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ title, value, bgColor }: { title: string; value: string; bgColor: string }) {
  return (
    <div className={`${bgColor} rounded-lg shadow-md border border-gray-200 p-6 flex flex-col items-start hover:shadow-xl transition`}>
      <h3 className="text-lg font-medium text-gray-700">{title}</h3>
      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function RevenueCard({ label, amount }: { label: string; amount: string }) {
  return (
    <div className="bg-gray-100 rounded-lg p-4 text-center shadow-sm hover:shadow-md transition">
      <p className="text-gray-600 font-medium">{label}</p>
      <p className="text-xl font-bold text-gray-900 mt-1">{amount}</p>
    </div>
  );
}

function ReservationRow({ name, time, guests, table, type, contact }: 
  { name: string; time: string; guests: number; table: string; type: string; contact: string }) {
  return (
    <tr className="bg-white shadow-sm rounded-lg border-t border-gray-100 hover:bg-gray-50 transition">
      <td className="px-4 py-2 font-medium text-gray-800">{name}</td>
      <td className="px-4 py-2 text-gray-700">{time}</td>
      <td className="px-4 py-2 text-gray-700">{guests}</td>
      <td className="px-4 py-2 text-gray-700">{table}</td>
      <td className="px-4 py-2 text-gray-700">{type}</td>
      <td className="px-4 py-2 text-gray-700">{contact}</td>
    </tr>
  );
}

function OrderRow({ id, items, total, status, customer }: 
  { id: string; items: string; total: string; status: string; customer: string }) {
  const statusColor = status === "Preparing" ? "text-yellow-600" :
                      status === "Cooking" ? "text-orange-600" :
                      status === "Out for delivery" ? "text-green-600" : "text-gray-600";

  return (
    <tr className="bg-white shadow-sm rounded-lg border-t border-gray-100 hover:bg-gray-50 transition">
      <td className="px-4 py-2 font-medium text-gray-800">{id}</td>
      <td className="px-4 py-2 text-gray-700">{items}</td>
      <td className="px-4 py-2 font-semibold text-gray-900">{total}</td>
      <td className={`px-4 py-2 font-semibold ${statusColor}`}>{status}</td>
      <td className="px-4 py-2 text-gray-700">{customer}</td>
    </tr>
  );
}