import { useState, useEffect } from 'react';
import { ShoppingBag, Truck, Package, Activity, RefreshCw } from 'lucide-react';

// ⚠️ CHECK THIS PORT: Use 3000 or 8001 depending on your docker-compose
const API_BASE = 'http://localhost:3000';

interface Product {
  id: number;
  name: string;
  price: number;
  stock_quantity: number;
}

interface Order {
  id: number;
  status: string;
  items: any[];
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Products
      const prodRes = await fetch(`${API_BASE}/products/`);
      const prodData = await prodRes.json();
      setProducts(Array.isArray(prodData) ? prodData : []);

      // 2. Fetch Orders
      const ordRes = await fetch(`${API_BASE}/orders/`);
      if (ordRes.ok) {
        const ordData = await ordRes.json();
        setOrders(Array.isArray(ordData) ? ordData : []);
      }
    } catch (error) {
      console.error("Connection Failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleShip = async (orderId: number) => {
    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Shipped' }),
      });
      if (res.ok) fetchData();
    } catch (error) {
      alert("Failed to update order");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* --- Navbar --- */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Truck className="w-8 h-8" />
            <h1 className="text-2xl font-bold tracking-tight">LogisticsHub</h1>
          </div>
          <button 
            onClick={fetchData} 
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition text-sm font-medium backdrop-blur-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        {/* --- Stats Row --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><Package /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Products</p>
              <p className="text-2xl font-bold">{products.length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-full"><ShoppingBag /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Orders</p>
              <p className="text-2xl font-bold">{orders.length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-full"><Activity /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">System Status</p>
              <p className="text-2xl font-bold text-green-600">Online</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* --- Inventory Table --- */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-lg font-bold flex items-center gap-2 text-gray-700">
                <Package className="w-5 h-5 text-blue-600" />
                Current Inventory
              </h2>
            </div>
            <div className="overflow-auto flex-grow">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                  <tr>
                    <th className="px-6 py-3">Product Name</th>
                    <th className="px-6 py-3">Price</th>
                    <th className="px-6 py-3">Stock Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.length === 0 ? (
                     <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-400 italic">No products found</td></tr>
                  ) : products.map((p) => (
                    <tr key={p.id} className="hover:bg-blue-50/50 transition duration-150">
                      <td className="px-6 py-4 font-medium text-gray-900">{p.name}</td>
                      <td className="px-6 py-4 text-gray-600">${p.price.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${p.stock_quantity < 5 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                          {p.stock_quantity} units
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* --- Orders Table --- */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-lg font-bold flex items-center gap-2 text-gray-700">
                <ShoppingBag className="w-5 h-5 text-purple-600" />
                Recent Orders
              </h2>
            </div>
            <div className="overflow-auto flex-grow">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                  <tr>
                    <th className="px-6 py-3">Order ID</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.length === 0 ? (
                    <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-400 italic">No orders placed yet</td></tr>
                  ) : orders.map((o) => (
                    <tr key={o.id} className="hover:bg-purple-50/50 transition duration-150">
                      <td className="px-6 py-4 font-bold text-gray-700">#{o.id}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm
                          ${o.status === 'Pending' ? 'bg-amber-100 text-amber-700 border border-amber-200' : ''}
                          ${o.status === 'Shipped' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : ''}
                          ${o.status === 'Cancelled' ? 'bg-rose-100 text-rose-700 border border-rose-200' : ''}
                        `}>
                          <span className={`w-2 h-2 rounded-full ${o.status === 'Pending' ? 'bg-amber-500 animate-pulse' : o.status === 'Shipped' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                          {o.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {o.status === 'Pending' && (
                          <button
                            onClick={() => handleShip(o.id)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-md shadow hover:shadow-md transition active:scale-95 flex items-center gap-1 ml-auto"
                          >
                            Ship It <Truck className="w-3 h-3" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;