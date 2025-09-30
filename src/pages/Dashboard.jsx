import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import {
  Wallet,
  DollarSign,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"; 
import { summaryAPI, categoriesAPI } from "../services";
// Page du tableau de bord
const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [budgetAlert, setBudgetAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    start: "",
    end: "",
    categoryId: "",
    type: "",
  });
  const [categories, setCategories] = useState([]);

  const COLORS = [
    "var(--primary-color)",
    "#FFB5E8",
    "#FFD8A8",
    "#A7F3D0",
    "#C7D2FE",
    "#F3C6FF",
  ];

  useEffect(() => {
    fetchCategories();
    fetchDashboardData();
  }, []);
// Récupérer les catégories pour les filtres
  const fetchCategories = async () => {
    try {
      const res = await categoriesAPI.getAll();
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };
// Appliquer les filtres et récupérer les données
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // API avec filtres appliqués
      const [summaryRes, alertRes, trendRes] = await Promise.all([
        summaryAPI.getMonthly(filters),       // Pie chart & summary
        summaryAPI.getAlerts(filters),        // Budget alert
        summaryAPI.getMonthlyTrend(filters),  // Bar chart
      ]);

      setSummary(summaryRes.data);
      setBudgetAlert(alertRes.data);
      setMonthlyData(trendRes.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("fr-MG", {
      style: "currency",
      currency: "MGA",
      maximumFractionDigits: 2,
    }).format(Number(amount) || 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[var(--primary-color)] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 m-6">
        {error}
      </div>
    );
  }

  if (!summary)
    return <div className="text-center py-12 text-gray-500">No data available</div>;

  const {
    totalIncome = 0,
    totalExpenses = 0,
    balance = 0,
    expensesByCategory = {},
  } = summary;

  const cards = [
    {
      title: "Total Balance",
      value: formatCurrency(balance),
      change: totalIncome !== 0 ? `${((balance / totalIncome) * 100).toFixed(1)}% of income` : "0%",
      trend: balance >= 0 ? "up" : "down",
      color: "from-teal-400 to-cyan-500",
      icon: <Wallet className="w-6 h-6 text-white animate-svg" />,
    },
    {
      title: "Total Income",
      value: formatCurrency(totalIncome),
      change: totalIncome !== 0 ? "100%" : "0%",
      trend: "up",
      color: "from-blue-400 to-indigo-500",
      icon: <DollarSign className="w-6 h-6 text-white animate-svg" />,
    },
    {
      title: "Total Expenses",
      value: formatCurrency(totalExpenses),
      change: totalIncome !== 0 ? `${((totalExpenses / totalIncome) * 100).toFixed(1)}% of income` : "0%",
      trend: totalExpenses <= totalIncome ? "down" : "up",
      color: "from-pink-400 to-rose-500",
      icon: <CreditCard className="w-6 h-6 text-white animate-svg" />,
    }
  ];

  const categoryData = Object.entries(expensesByCategory || {}).map(
    ([name, value], index) => ({
      name,
      value: Number(value) || 0,
      color: COLORS[index % COLORS.length],
    })
  );

  const totalCategoryValue = categoryData.reduce((acc, cur) => acc + cur.value, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Financial Dashboard</h1>
            <p className="text-gray-600 mt-1">Overview of your financial health</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/incomes/new" className="bg-[var(--primary-color)] text-white px-4 py-2 rounded-md shadow hover:bg-[var(--secondary-color)] transition">
              + Add Income
            </Link>
            <Link to="/expenses/new" className="bg-gray-500 text-white px-4 py-2 rounded-md shadow hover:bg-gray-700 transition">
              + Add Expense
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row gap-4 items-end">
         
        </div>

        {/* Budget Alert */}
        {budgetAlert && budgetAlert.alert && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center gap-3 shadow-md">
            <svg className="h-6 w-6 text-orange-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-sm font-semibold text-orange-800">Budget Alert</h3>
              <p className="text-sm text-orange-700">{budgetAlert.message}</p>
            </div>
          </div>
        )}

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <div key={i} className={`bg-gradient-to-r ${card.color} rounded-2xl shadow-lg p-6 text-white flex flex-col justify-between transition hover:scale-105`}>
              <div className="flex justify-between items-center">
                <div className="bg-white/20 p-3 rounded-xl">{card.icon}</div>
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${card.trend === "up" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                  {card.trend === "up" ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {card.change}
                </div>
              </div>
              <div className="mt-6">
                <p className="text-lg font-medium opacity-90">{card.title}</p>
                <h3 className="text-3xl font-bold mt-1">{card.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Expenses by Category */}
          <div className="bg-white rounded-xl shadow p-6 flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Expenses by Category</h3>
            {categoryData.length > 0 ? (
              <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-stretch">
                <div className="flex-1 relative min-w-[260px]">
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={110}
                        paddingAngle={6}
                        startAngle={90}
                        endAngle={-270}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <div className="text-xl font-bold text-gray-800">{formatCurrency(Number(totalExpenses) || totalCategoryValue)}</div>
                    <div className="text-sm text-gray-500">Spent</div>
                  </div>
                </div>
                <div className="w-56">
                  {categoryData.map((cat, idx) => {
                    const percent = totalCategoryValue > 0 ? ((cat.value / totalCategoryValue) * 100).toFixed(0) : 0;
                    return (
                      <div key={cat.name + idx} className="flex items-center justify-between py-2">
                        <div className="flex items-center">
                          <span className="inline-block w-3 h-3 rounded-full mr-3" style={{ background: cat.color }} />
                          <span className="text-sm text-gray-700">{cat.name}</span>
                        </div>
                        <div className="text-sm text-gray-500">{percent}%</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-12">No category data</p>
            )}
            <div className="mt-auto py-4 text-center text-gray-400 text-sm">Summary updated monthly</div>
          </div>

          {/* Monthly Income vs Expenses */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Income vs Expenses</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <XAxis dataKey="month" tick={{ fill: "#4B5563", fontSize: 14 }} tickLine={false} />
                <YAxis tickFormatter={(value) => formatCurrency(value)} tick={{ fill: "#4B5563", fontSize: 14 }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: 14 }} />
                <Bar dataKey="income" name="Income" fill="url(#incomeGradient)" radius={[8, 8, 0, 0]} animationDuration={1500} />
                <Bar dataKey="expenses" name="Expenses" fill="url(#expenseGradient)" radius={[8, 8, 0, 0]} animationDuration={1500} />
                <defs>
                  <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2C98A0" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#2C98A0" stopOpacity={0.3} />
                  </linearGradient>
                  <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF8042" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#FF8042" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;
