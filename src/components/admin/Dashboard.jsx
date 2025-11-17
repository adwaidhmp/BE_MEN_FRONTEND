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
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminDashboard } from "../redux/slice/adminSlice";
import { 
  TrendingUp, 
  Users, 
  Package, 
  ShoppingBag, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  Crown,
  Truck,
  XCircle,
  BarChart3,
  Filter
} from "lucide-react";

const COLORS = ["#b45309", "#059669", "#dc2626", "#7c3aed", "#0ea5e9", "#f59e0b"];

export default function Dashboard() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.admin.dashboard);
  const [timeFilter, setTimeFilter] = useState("weekly");
  const [categoryFilter, setCategoryFilter] = useState("all");

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

  // Format currency values
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(parseFloat(value || 0));
  };

  // --- Chart Data from Backend ---
  const weeklyRevenueComparisonData = (data.weekly_revenue_chart || []).map(item => ({
    week: `Week ${item.week_number}`,
    revenue: parseFloat(item.revenue) || 0
  }));

  const monthlyRevenueComparisonData = (data.monthly_revenue_chart || []).map(item => ({
    month: item.month,
    revenue: parseFloat(item.revenue) || 0
  }));

  const yearlyRevenueComparisonData = (data.yearly_revenue_chart || []).map(item => ({
    year: item.year.toString(),
    revenue: parseFloat(item.revenue) || 0
  }));

  // Combined revenue data for the main chart
  const getRevenueData = () => {
    switch(timeFilter) {
      case "weekly":
        return weeklyRevenueComparisonData;
      case "monthly":
        return monthlyRevenueComparisonData;
      case "yearly":
        return yearlyRevenueComparisonData;
      default:
        return weeklyRevenueComparisonData;
    }
  };

  const revenueData = getRevenueData();

  // Weekly Performance Data - using actual weekly data from backend
  const weeklyPerformanceData = (data.weekly_revenue_chart || []).map((item, index) => ({
    day: `W${item.week_number}`,
    orders: Math.round((data.weekly_orders || 0) * (0.1 + (index * 0.05))), // Simulated distribution
    revenue: parseFloat(item.revenue) || 0
  }));

  // Sales by Category with filter and sorting
  const getFilteredCategoryData = () => {
    let filteredData = [...(data.category_sales || [])];
    
    // Apply filter
    if (categoryFilter === "top") {
      // Show only top 3 categories by value
      filteredData = filteredData
        .sort((a, b) => parseFloat(b.total) - parseFloat(a.total))
        .slice(0, 3);
    } else if (categoryFilter === "monthly") {
      // Sort by monthly sales (descending)
      filteredData = filteredData.sort((a, b) => parseFloat(b.total) - parseFloat(a.total));
    }
    // "all" shows all categories without sorting
    
    return filteredData.map((item, index) => ({
      name: item['product__category__category'] || 'Uncategorized',
      value: parseFloat(item.total) || 0,
      color: COLORS[index % COLORS.length]
    }));
  };

  const salesByCategoryData = getFilteredCategoryData();

  // Main Stat Cards
  const mainStatCards = [
    { 
      title: "Total Revenue", 
      value: formatCurrency(data.total_revenue), 
      icon: DollarSign, 
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      description: "All time revenue"
    },
    { 
      title: "Total Orders", 
      value: data.total_orders || 0, 
      icon: ShoppingBag, 
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      description: "Total orders placed"
    },
    { 
      title: "Total Users", 
      value: data.total_users || 0, 
      icon: Users, 
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      description: "Registered customers"
    },
    { 
      title: "Total Products", 
      value: data.total_products || 0, 
      icon: Package, 
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      description: "Active products"
    },
  ];

  // Today's Performance Cards
  const todayStatCards = [
    { 
      title: "Today's Revenue", 
      value: formatCurrency(data.revenue_today), 
      icon: TrendingUp, 
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    { 
      title: "Today's Orders", 
      value: data.orders_today || 0, 
      icon: ShoppingBag, 
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200"
    },
  ];

  // Order Status Cards
  const orderStatusCards = [
    { 
      title: "Orders Pending", 
      value: data.pending_orders || 0, 
      icon: Clock, 
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200"
    },
    { 
      title: "Orders Shipped", 
      value: data.shipped_orders || 0, 
      icon: Truck, 
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
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
      title: "Orders Cancelled", 
      value: data.cancelled_orders || 0, 
      icon: XCircle, 
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-amber-600 flex items-center justify-center">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-serif text-3xl text-stone-900">Admin Dashboard</h2>
            <p className="text-stone-600 font-light">Overview of your store performance</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-stone-600">Last Updated</p>
          <p className="text-stone-900 font-medium">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Main Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStatCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <StatCard 
              key={index}
              title={stat.title}
              value={stat.value}
              description={stat.description}
              icon={Icon}
              color={stat.color}
              bgColor={stat.bgColor}
              borderColor={stat.borderColor}
            />
          );
        })}
      </div>

      {/* Today's Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {todayStatCards.map((stat, index) => {
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
              compact
            />
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Combined Revenue Chart */}
        <ChartCard title="Revenue Analysis" className="lg:col-span-2">
          <div className="flex justify-end mb-4">
            <div className="flex gap-2">
              <button
                onClick={() => setTimeFilter("weekly")}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                  timeFilter === "weekly" 
                    ? "bg-amber-600 text-white" 
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setTimeFilter("monthly")}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                  timeFilter === "monthly" 
                    ? "bg-amber-600 text-white" 
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setTimeFilter("yearly")}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                  timeFilter === "yearly" 
                    ? "bg-amber-600 text-white" 
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                Yearly
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <XAxis 
                dataKey={timeFilter === "weekly" ? "week" : timeFilter === "monthly" ? "month" : "year"} 
                stroke="#57534e" 
              />
              <YAxis 
                stroke="#57534e" 
                tickFormatter={(value) => 
                  timeFilter === "yearly" 
                    ? `$${(value / 1000000).toFixed(1)}M`
                    : `$${(value / 1000).toFixed(0)}k`
                }
              />
              <Tooltip 
                formatter={(value) => [formatCurrency(value), 'Revenue']}
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '1px solid #d6d3d1',
                  borderRadius: '8px'
                }}
              />
              <Bar 
                dataKey="revenue" 
                fill="#b45309" 
                radius={[4, 4, 0, 0]}
                name="Revenue"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Sales by Category Pie Chart */}
        <ChartCard title="Sales by Category">
          <div className="flex justify-end mb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-stone-500" />
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-1 rounded-lg border border-stone-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">All Categories</option>
                <option value="monthly">Sort by Monthly</option>
                <option value="top">Top Categories</option>
              </select>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={salesByCategoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={60}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {salesByCategoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [formatCurrency(value), 'Sales']}
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '1px solid #d6d3d1',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Weekly Performance Trend */}
        <ChartCard title="Weekly Performance Trend">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={weeklyPerformanceData}>
              <XAxis dataKey="day" stroke="#57534e" />
              <YAxis 
                yAxisId="left"
                stroke="#57534e"
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right"
                stroke="#57534e"
              />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'revenue' ? formatCurrency(value) : value,
                  name === 'revenue' ? 'Revenue' : 'Orders'
                ]}
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '1px solid #d6d3d1',
                  borderRadius: '8px'
                }}
              />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="revenue" 
                stroke="#b45309" 
                fill="#b45309"
                fillOpacity={0.2}
                name="revenue"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="orders" 
                stroke="#059669" 
                strokeWidth={2}
                dot={{ fill: '#059669', strokeWidth: 2, r: 4 }}
                name="orders"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Order Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {orderStatusCards.map((stat, index) => {
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
              compact
            />
          );
        })}
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ChartCard title="Inventory Status">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-stone-600">Out of Stock Products</span>
              <span className="text-2xl font-bold text-red-600">
                {data.out_of_stock_products || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-600">Active Products</span>
              <span className="text-2xl font-bold text-green-600">
                {data.total_products || 0}
              </span>
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Quick Stats">
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-stone-100">
              <span className="text-stone-600">Weekly Orders</span>
              <span className="font-semibold">{data.weekly_orders || 0}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-stone-100">
              <span className="text-stone-600">Weekly Revenue</span>
              <span className="font-semibold">{formatCurrency(data.weekly_revenue)}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-stone-600">Monthly Orders</span>
              <span className="font-semibold">{data.monthly_orders || 0}</span>
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Top Categories">
          <div className="space-y-3">
            {salesByCategoryData.slice(0, 3).map((category, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-stone-100">
                <span className="text-stone-600">{category.name}</span>
                <span className="font-semibold">{formatCurrency(category.value)}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}

// --- Helper Components ---
const StatCard = ({ title, value, description, icon: Icon, color, bgColor, borderColor, compact = false }) => (
  <div className={`bg-white rounded-xl border ${borderColor} p-6 hover:shadow-lg transition-all ${compact ? 'text-center' : ''}`}>
    <div className={`flex items-center ${compact ? 'justify-center' : 'justify-between'} mb-4`}>
      <h3 className={`font-medium text-stone-700 ${compact ? 'text-lg' : ''}`}>{title}</h3>
      <div className={`p-2 rounded-lg ${bgColor}`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
    </div>
    <p className={`${compact ? 'text-2xl' : 'text-3xl'} font-serif font-normal ${color} mb-2`}>{value}</p>
    {description && <p className="text-sm text-stone-500">{description}</p>}
  </div>
);

const ChartCard = ({ title, children, className = "" }) => (
  <div className={`bg-white rounded-xl border border-stone-200 p-6 hover:shadow-lg transition-all ${className}`}>
    <h3 className="font-serif text-xl text-stone-900 mb-6 flex items-center gap-2">
      <BarChart3 className="w-5 h-5" />
      {title}
    </h3>
    {children}
  </div>
);