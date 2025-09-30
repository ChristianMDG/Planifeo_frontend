import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { expensesAPI, categoriesAPI } from "../services";
import { Plus, Edit2, Trash2, FileText, DollarSign, BarChart3, Tag, Repeat } from "lucide-react";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    start: "",
    end: "",
    category: "",
    type: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  
  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    expense: null,
  });

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [expensesRes, categoriesRes] = await Promise.all([
        expensesAPI.getAll(filters),
        categoriesAPI.getAll(),
      ]);
      setExpenses(expensesRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };


  const openDeleteConfirm = (expense) => {
    setDeleteConfirm({ show: true, expense });
  };


  const closeDeleteConfirm = () => {
    setDeleteConfirm({ show: false, expense: null });
  };

  const handleDelete = async () => {
    if (!deleteConfirm.expense) return;

    try {
      await expensesAPI.delete(deleteConfirm.expense.id);
      setExpenses(
        expenses.filter((exp) => exp.id !== deleteConfirm.expense.id)
      );
      setSuccess("Expense deleted successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError("Failed to delete expense");
    } finally {
      closeDeleteConfirm();
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const calculateTotal = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("fr-MG", {
      style: "currency",
      currency: "MGA",
    }).format(amount);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-color)]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="animate-fadeIn flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Expense Management
            </h1>
            <p className="text-gray-600 mt-2">Track and manage your expenses</p>
          </div>
          <Link
            to="/expenses/new"
            className="transition-all duration-300 gap-3 mt-4 sm:mt-0 inline-flex items-center px-6 py-3 text-white rounded-md bg-[var(--primary-color)] hover:bg-[var(--secondary-color)]"
          >
            <Plus className="w-4 h-4" />
            Add New Expense
          </Link>
        </div>

        {/* Alerts */}
        {error && (
          <div className="animate-shake bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-800">
            {error}
          </div>
        )}
        {success && (
          <div className="animate-fadeIn bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-green-800">
            {success}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 animate-fadeIn">
          <div 
            className=" bg-white shadow-sm border-l-3 border-red-500 
                rounded-2xl p-6 w-65 
                transform transition-all duration-300 ease-in-out
                hover:scale-105 hover:shadow-xl 
                active:scale-100 cursor-pointer"
            style={{ animationDelay: "0s" }}
          >
            <div className="flex items-center gap-4">
              <div className="transition-all duration-300 flex items-center justify-center w-10 h-10
                    bg-gradient-to-tr from-p-3 bg-red-300 to-red-500
                  rounded-lg  text-white text-3xl shadow-md hover:scale-110">
                <DollarSign className="w-6 h-6" />
              </div>

              <div>

                 <p className="text-sm text-gray-500">Total Expenses</p>
                <p className="text-xl text-red-500 font-bold">
                  {formatCurrency(calculateTotal())}
                </p>
 +
              </div>
            </div>
          </div>

          <div 
            className=" bg-white shadow-sm border-l-3 border-blue-400 
                rounded-2xl p-6 w-65 
                transform transition-all duration-300 ease-in-out
                hover:scale-105 hover:shadow-xl 
                active:scale-100 cursor-pointer"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="flex items-center gap-2">
              <div className="transition-all duration-300 flex items-center justify-center w-10 h-10
                    bg-gradient-to-tr from-p-3 bg-blue-200 to-blue-400
                  rounded-lg  text-white text-3xl shadow-md hover:scale-110">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div className="ml-3">

                 <p className="text-sm text-gray-600">Total Records</p>
                <p className="text-xl text-blue-400 font-bold">{expenses.length}</p>
               

              </div>
            </div>
          </div>

          <div 
            className=" bg-white shadow-sm border-l-3 border-purple-400 
                rounded-2xl p-6 w-65 
                transform transition-all duration-300 ease-in-out
                hover:scale-105 hover:shadow-xl 
                active:scale-100 cursor-pointer"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="flex items-center gap-2">
              <div className="transition-all duration-300 flex items-center justify-center w-10 h-10
                    bg-gradient-to-tr from-p-3 bg-purple-200 to-purple-400
                  rounded-lg  text-white text-3xl shadow-md hover:scale-110">
                <Tag className="w-6 h-6" />
              </div>
              <div className="ml-3">

                 <p className="text-sm text-gray-600">Categories</p>
                <p className="text-xl text-purple-400font-bold">{categories.length}</p>
               

              </div>
            </div>
          </div>

          <div 
            className=" bg-white shadow-sm border-l-3 border-[var(--secondary-color)] 
                rounded-2xl p-6 w-65 
                transform transition-all duration-300 ease-in-out
                hover:scale-105 hover:shadow-xl 
                active:scale-100 cursor-pointer"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="flex items-center gap-2">
              <div className="transition-all duration-300 flex items-center justify-center w-10 h-10
                    bg-gradient-to-tr from-[var(--secondary-color)] to-[var(--accent-color)] 
                    rounded-lg text-white text-3xl shadow-md hover:scale-110">
                <Repeat className="w-6 h-6" />
              </div>
              <div className="ml-3">

                 <p className="text-sm text-gray-600">Recurring</p>
                <p className="text-xl text-[var(--secondary-color)] font-bold">
                  {expenses.filter((e) => e.type === "recurring").length}
                </p>

              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="animate-fadeIn bg-white rounded-lg shadow p-4 mb-6">
          <h3 className="text-lg font-medium mb-3">Filters</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={filters.start}
                onChange={(e) => handleFilterChange("start", e.target.value)}
                className="transition-all duration-200 w-full h-12 px-3 border border-gray-300 rounded bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="date"
                value={filters.end}
                onChange={(e) => handleFilterChange("end", e.target.value)}
                className="transition-all duration-200 w-full h-12 px-3 border border-gray-300 rounded bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="transition-all duration-200 w-full h-12 px-3 border border-gray-300 rounded bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange("type", e.target.value)}
                className="transition-all duration-200 w-full h-12 px-3 border border-gray-300 rounded bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="one-time">One-time</option>
                <option value="recurring">Recurring</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() =>
                setFilters({ start: "", end: "", category: "", type: "" })
              }
              className="transition-all duration-200 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Expenses Table */}
        <div className="animate-fadeIn bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left text-sm font-medium text-gray-500">
                    Date
                  </th>
                  <th className="p-3 text-left text-sm font-medium text-gray-500">
                    Amount
                  </th>
                  <th className="p-3 text-left text-sm font-medium text-gray-500">
                    Category
                  </th>
                  <th className="p-3 text-left text-sm font-medium text-gray-500">
                    Description
                  </th>
                  <th className="p-3 text-left text-sm font-medium text-gray-500">
                    Type
                  </th>
                  <th className="p-3 text-left text-sm font-medium text-gray-500">
                    Created At
                  </th>
                  <th className="p-3 text-left text-sm font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense, index) => (
                  <tr 
                    key={expense.id} 
                    className="transition-all duration-200 hover:bg-gray-50"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <td className="p-3">
                      {expense.type === "one-time"
                        ? new Date(expense.date).toLocaleDateString()
                        : "Recurring"}
                    </td>
                    <td className="p-3 font-semibold text-[var(--secondary-color)]">
                      {formatCurrency(expense.amount)}
                    </td>
                    <td className="p-3">
                      <span className="transition-all duration-200 bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm hover:bg-gray-200">
                        {expense.category.name}
                      </span>
                    </td>
                    <td className="p-3 text-gray-500 max-w-xs truncate">
                      {expense.description || "No description"}
                    </td>
                    <td className="p-3">
                      <span
                        className={`transition-all duration-200 px-2 py-1 rounded text-sm ${expense.type === "recurring"
                          ? "bg-purple-100 text-purple-800 hover:bg-purple-200"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }`}
                      >
                        {expense.type}
                      </span>
                    </td>
                    <td className="p-3 text-gray-500">
                      {new Date(expense.createdAt).toLocaleString()}{" "}
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-3">
                        <Link
                          to={`/expenses/${expense.id}/edit`}
                          className="transition-all duration-200 text-[var(--primary-color)] hover:text-blue-400 hover:scale-110"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => openDeleteConfirm(expense)}
                          className="transition-all duration-200 text-[var(--secondary-color)] hover:text-blue-400 hover:scale-110"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {expenses.length === 0 && (
            <div className="animate-fadeIn text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900">
                No expenses found
              </h3>
              <p className="text-gray-500 mb-4">
                Get started by creating your first expense
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {expenses.length > 0 && (
          <div className="animate-fadeIn mt-4 flex justify-between items-center">
            <p className="text-sm text-gray-700">
              Showing {expenses.length} results
            </p>
          </div>
        )}
      </div>

      {/* 🔹 Modale de confirmation suppression */}
      {deleteConfirm.show && (
        <div
          className="animate-fadeIn fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center p-4 z-50"
          onClick={closeDeleteConfirm}
        >
          <div
            className="animate-scaleIn bg-white rounded-lg max-w-md w-full p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-medium text-gray-90 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the expense "
              {deleteConfirm.expense?.description || "Unnamed"}"? This action
              cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeDeleteConfirm}
                className="transition-all duration-200 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--secondary-color)]"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="transition-all duration-200 px-4 py-2 bg-[var(--secondary-color)] text-white rounded-md hover:bg-[var(--primary-color)] focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;