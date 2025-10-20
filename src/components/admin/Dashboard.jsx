import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminDashboard } from "../redux/slice/adminSlice";
import { TrendingUp, Users, Package, ShoppingBag, DollarSign, Clock, CheckCircle, AlertCircle, Crown } from "lucide-react";

const COLORS = ["#b45309", "#059669", "#dc2626", "#7c3aed", "#0ea5e9", "#f59e0b"];

export default function Dashboard() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.admin.dashboard);

  useEffect(() => {
    dispatch(fetchAdminDashboard());
  }, [dispatch]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
        <p className="text-stone-600 font-serif">Loading dashboard...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-red-600 font-serif">Error: {error}</p>
    </div>
  );

  // --- Chart Data ---
  const incomeChartData = [
    { period: "Weekly", income: data.weekly_revenue || 0 },
    { period: "Monthly", income: data.monthly_revenue || 0 },
    { period: "Yearly", income: data.yearly_revenue || 0 },
  ];

  const dailyChartData = [
    { day: new Date().toLocaleDateString(), income: data.revenue_today || 0 },
  ];

  const donutData = (data.category_sales || []).map((item) => ({
    name: item.category,
    value: item.total,
  }));

  const statCards = [
    { 
      title: "Revenue Today", 
      value: `$${data.revenue_today?.toFixed(2) || 0}`, 
      icon: DollarSign, 
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    { 
      title: "Orders Today", 
      value: data.orders_today || 0, 
      icon: ShoppingBag, 
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200"
    },
    { 
      title: "Orders Pending", 
      value: data.pending_orders || 0, 
      icon: Clock, 
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    },
    { 
      title: "Orders Delivered", 
      value: data.delivered_orders || 0, 
      icon: CheckCircle, 
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    { 
      title: "Total Revenue", 
      value: `$${data.total_revenue?.toFixed(2) || 0}`, 
      icon: TrendingUp, 
      color: "text-stone-900",
      bgColor: "bg-stone-50",
      borderColor: "border-stone-200"
    },
    { 
      title: "Total Users", 
      value: data.total_users || 0, 
      icon: Users, 
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    { 
      title: "Total Orders", 
      value: data.total_orders || 0, 
      icon: ShoppingBag, 
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    { 
      title: "Total Products", 
      value: data.total_products || 0, 
      icon: Package, 
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200"
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-full bg-amber-600 flex items-center justify-center">
          <Crown className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="font-serif text-3xl text-stone-900">Admin Dashboard</h2>
          <p className="text-stone-600 font-light">Overview of your store performance</p>
        </div>
      </div>

      {/* --- Top Stats --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <StatCard 
              key={index}
              title={stat.title}
              value={stat.value}
              icon={Icon}
              color={stat.color}
              bgColor={stat.bgColor}
              borderColor={stat.borderColor}
            />
          );
        })}
      </div>

      {/* --- Charts --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Growth Line Chart */}
        <ChartCard title="Revenue Overview">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={incomeChartData}>
              <XAxis dataKey="period" stroke="#57534e" />
              <YAxis stroke="#57534e" />
              <Tooltip 
                formatter={(value) => [`$${value.toFixed(2)}`, 'Revenue']}
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '1px solid #d6d3d1',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="#b45309" 
                strokeWidth={3}
                dot={{ fill: '#b45309', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Product Sales Donut Chart */}
        <ChartCard title="Sales by Category">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={donutData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={50}
                label
              >
                {donutData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`$${value.toFixed(2)}`, 'Sales']}
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '1px solid #d6d3d1',
                  borderRadius: '8px'
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Daily Revenue Bar Chart */}
        <ChartCard title="Today's Revenue" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dailyChartData}>
              <XAxis dataKey="day" stroke="#57534e" />
              <YAxis stroke="#57534e" />
              <Tooltip 
                formatter={(value) => [`$${value.toFixed(2)}`, 'Revenue']}
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '1px solid #d6d3d1',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="income" fill="#059669" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

// --- Helper Components ---
// eslint-disable-next-line no-unused-vars
const StatCard = ({ title, value, icon: Icon, color, bgColor, borderColor }) => (
  <div className={`bg-white rounded-xl border ${borderColor} p-6 hover:shadow-lg transition-all`}>
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-medium text-stone-700">{title}</h3>
      <div className={`p-2 rounded-lg ${bgColor}`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
    </div>
    <p className={`text-3xl font-serif font-normal ${color}`}>{value}</p>
  </div>
);

const ChartCard = ({ title, children, className = "" }) => (
  <div className={`bg-white rounded-xl border border-stone-200 p-6 ${className}`}>
    <h3 className="font-serif text-xl text-stone-900 mb-6">{title}</h3>
    {children}
  </div>
);