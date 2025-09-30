import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { incomesAPI } from "../services";
import { ArrowLeft, XCircle, CheckCircle2, Loader2 } from "lucide-react";

const IncomeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    amount: "",
    date: new Date().toISOString().split("T")[0],
    source: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Récupérer les données si édition
  useEffect(() => {
    if (!isEdit) return;

    const fetchIncome = async () => {
      try {
        setLoading(true);
        const { data } = await incomesAPI.getById(id);
        setFormData({
          amount: data.amount.toString(),
          date: new Date(data.date).toISOString().split("T")[0],
          source: data.source || "",
          description: data.description || "",
        });
      } catch {
        setError("Failed to fetch income details");
      } finally {
        setLoading(false);
      }
    };

    fetchIncome();
  }, [id, isEdit]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.amount || parseFloat(formData.amount) <= 0 || !formData.date) {
      return setError("Amount and date are required and must be valid");
    }

    setLoading(true);
    try {
      const payload = { ...formData, amount: parseFloat(formData.amount) };
      if (isEdit) await incomesAPI.update(id, payload);
      else await incomesAPI.create(payload);

      setSuccess(isEdit ? "Income updated successfully!" : "Income created successfully!");
      setTimeout(() => navigate("/incomes"), 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save income");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("fr-MG", { style: "currency", currency: "MGA" }).format(amount);

  return (
    <div className="min-h-full bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="animate-fadeIn mb-8">
          <div className="mb-4 flex items-center">
            <button
              onClick={() => navigate("/incomes")}
              className="transition-all duration-200 mr-4 rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEdit ? "Edit Income" : "Add New Income"}
            </h1>
          </div>
          <p className="ml-11 text-gray-600">
            {isEdit
              ? "Update your income details"
              : "Add a new income source to track your earnings"}
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="animate-shake mb-6 flex items-center rounded-lg p-4 bg-red-50 border border-red-200 text-red-800">
            <XCircle className="w-5 h-5 mr-2 text-red-600" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="animate-fadeIn mb-6 flex items-center rounded-lg p-4 bg-green-50 border border-green-200 text-green-800">
            <CheckCircle2 className="w-5 h-5 mr-2 text-green-600" />
            <span>{success}</span>
          </div>
        )}

        {/* Form */}
        <form 
          onSubmit={handleSubmit} 
          className="animate-slideUp space-y-6 rounded-lg bg-white p-6 shadow-lg"
        >
          {/* Amount */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Amount *</label>
            <input
              id="amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              min="0"
              disabled={loading}
              placeholder="0.00"
              className="transition-all duration-200 w-full rounded-lg border border-gray-300 px-4 py-3 pl-3 outline-none focus:border-transparent focus:ring-2 focus:ring-[var(--accent-color)]"
            />
            {formData.amount && (
              <p className="animate-fadeIn mt-1 text-sm text-gray-500">
                {formatCurrency(parseFloat(formData.amount) || 0)}
              </p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Date *</label>
            <input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
              disabled={loading}
              className="transition-all duration-200 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-transparent focus:ring-2 focus:ring-[var(--accent-color)]"
            />
          </div>

          {/* Source */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Source</label>
            <select
              id="source"
              name="source"
              value={formData.source}
              onChange={handleChange}
              disabled={loading}
              className="transition-all duration-200 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-transparent focus:ring-2 focus:ring-[var(--accent-color)]"
            >
              <option value="">Select a source</option>
              {["Salary", "Freelance", "Investment", "Business", "Rental", "Bonus", "Other"].map(
                (s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              disabled={loading}
              placeholder="Additional details about this income (optional)"
              className="transition-all duration-200 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-transparent focus:ring-2 focus:ring-[var(--accent-color)]"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-4 sm:flex-row">
            <button
              type="submit"
              disabled={loading}
              className="transition-all duration-300 flex flex-1 items-center justify-center rounded-lg bg-[var(--primary-color)] px-6 py-3 font-medium text-white hover:bg-[var(--secondary-color)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5 text-white mr-2" /> : isEdit ? "Update Income" : "Create Income"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/incomes")}
              disabled={loading}
              className="transition-all duration-300 flex-1 rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IncomeForm;