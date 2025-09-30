import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { incomesAPI } from "../services";
import {
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  FileText,
  DollarSign,
} from "lucide-react";

const Incomes = () => {
  const [incomes, setIncomes] = useState([]);
  const [filters, setFilters] = useState({ start: "", end: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    incomeId: null,
    incomeSource: "",
  });

  useEffect(() => {
    fetchIncomes();
  }, [filters]);

  const fetchIncomes = async () => {
    try {
      setLoading(true);
      const response = await incomesAPI.getAll(filters);
      setIncomes(response.data);
    } catch (err) {
      setError("Failed to fetch incomes");
      console.error("Incomes error:", err);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id, source) => {
    setDeleteConfirm({ show: true, incomeId: id, incomeSource: source });
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirm({ show: false, incomeId: null, incomeSource: "" });
  };

  const handleDelete = async () => {
    try {
      await incomesAPI.delete(deleteConfirm.incomeId);
      setIncomes(
        incomes.filter((income) => income.id !== deleteConfirm.incomeId)
      );
      setSuccess("Income deleted successfully");
      setTimeout(() => setSuccess(""), 3000);
      closeDeleteConfirm();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete income");
      closeDeleteConfirm();
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const calculateTotal = () =>
    incomes.reduce((total, income) => total + income.amount, 0);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("fr-MG", {
      style: "currency",
      currency: "MGA",
    }).format(amount);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-color)]" />
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[var(--bg-color)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto ">
        {/* Header */}
        <div className="animate-fadeIn flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-color)]">
              Income Management
            </h1>
            <p className="text-[var(--text-color)] mt-2">
              Track and manage your income sources
            </p>
          </div>
          <div>
            <Link
              to="/incomes/new"
              className="transition-all duration-300 mt-4 sm:mt-0 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[var(--primary-color)] hover:bg-[var(--secondary-color)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-color)]"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Income
            </Link>
          </div>
        </div>

        {error && (
          <div className="animate-shake mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <XCircle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}
        {success && (
          <div className="animate-fadeIn mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle2 className="w-5 h-5 text-[var(--secondary-color)] mr-2" />
              <span className="text-green-800">{success}</span>
            </div>
          </div>
        )}

        <div className="animate-slideUp grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow-sm border-l-3 border-[var(--secondary-color)] 
                rounded-2xl p-6 w-80 
                transform transition duration-300 ease-in-out
                hover:scale-100 hover:shadow-xl 
                active:scale-100 cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <DollarSign className="flex items-center justify-center w-5 h-5 
                    bg-gradient-to-tr from-[var(--primary-color)] to-[var(--accent-color)] 
                    rounded-full text-white text-3xl shadow-md" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Income
                </p>
                <p className="text-xl font-bold text-[var(--primary-color)]">
                  {formatCurrency(calculateTotal())}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-sm border-l-3 border-[var(--accent-color)] 
                rounded-2xl p-6 w-80 
                transform transition duration-300 ease-in-out
                hover:scale-100 hover:shadow-xl 
                active:scale-100 cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FileText className="w-6 h-6 text-[var(--secondary-color)]" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Records
                </p>
                <p className="text-2xl font-bold text-[var(--accent-color)]">
                  {incomes.length}
                </p>
              </div>
            </div>
          </div>

          {/* Average Monthly */}
          <div className="bg-white shadow-sm border-l-3 border-purple-600 
                rounded-2xl p-6 w-80 
                transform transition duration-300 ease-in-out
                hover:scale-100 hover:shadow-xl 
                active:scale-100 cursor-pointer">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Average Monthly
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(calculateTotal() / 12)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="animate-fadeIn bg-white rounded-lg shadow mb-8 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-[var(--text-color)] mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={filters.start}
                onChange={(e) => handleFilterChange("start", e.target.value)}
                className="transition-all duration-200 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-[var(--text-color)] mb-2">
                End Date
              </label>
              <input
                type="date"
                value={filters.end}
                onChange={(e) => handleFilterChange("end", e.target.value)}
                className="transition-all duration-200 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setFilters({ start: "", end: "" })}
                className="transition-all duration-200 px-4 py-2 border border-gray-300 rounded-md text-[var(--secondary-color)] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        <div className="animate-fadeIn bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-color)] uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-color)] uppercase tracking-wider">
                    Created At
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-color)] uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-color)] uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-color)] uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-color)] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {incomes.map((income, index) => (
                  <tr 
                    key={income.id} 
                    className="transition-all duration-200 hover:bg-gray-50"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(income.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {new Date(income.createdAt).toLocaleString()}{" "}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-[var(--secondary-color)] font-semibold">
                      {formatCurrency(income.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {income.source || "-"}
                    </td>
                    <td className="px-6 py-4 max-w-2xs truncate">
                      {income.description || "No description"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-4 items-center">
                        <Link
                          to={`/incomes/${income.id}/edit`}
                          className="text-[var(--primary-color)] hover:text-blue-400"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() =>
                            confirmDelete(income.id, income.source)
                          }
                          className="text-[var(--primary-color)] hover:text-blue-400"
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

          {incomes.length === 0 && (
            <div className="animate-fadeIn text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No incomes found
              </h3>
              <p className="mt-1 text-sm text-[var(--text-color)]">
                Get started by creating a new income record.
              </p>
              <div className="mt-6">
                <Link
                  to="/incomes/new"
                  className="transition-all duration-300 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[var(--primary-color)] hover:bg-[var(--secondary-color)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <Plus className="-ml-1 mr-2 h-5 w-5" />
                  Add Income
                </Link>
              </div>
            </div>
          )}
        </div>

        {incomes.length > 0 && (
          <div className="animate-fadeIn mt-6 flex items-center justify-between">
            <p className="text-sm text-[var(--secondary-color)]">
              Showing <span className="font-medium">{incomes.length}</span>{" "}
              results
            </p>
          </div>
        )}

        {deleteConfirm.show && (
          <div
            className="animate-fadeIn fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center p-4 z-50"
            onClick={closeDeleteConfirm}
          >
            <div
              className="animate-scaleIn bg-white rounded-lg max-w-md w-full p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Confirm Deletion
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete the income from "
                {deleteConfirm.incomeSource || "unknown source"}"? This action
                cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeDeleteConfirm}
                  className="transition-all duration-200 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="transition-all duration-200 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Incomes;