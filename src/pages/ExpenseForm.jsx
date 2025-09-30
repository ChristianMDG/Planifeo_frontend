import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { expensesAPI, categoriesAPI } from '../services';

const ExpenseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    amount: '',
    date: '',
    categoryId: '',
    description: '',
    type: 'one-time',
    startDate: '',
    endDate: '',
    receipt: null
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCategories();
    if (isEdit) fetchExpense();
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
      if (!isEdit && response.data.length > 0) {
        setFormData(prev => ({ ...prev, categoryId: response.data[0].id }));
      }
    } catch (error) {
      setError('Failed to load categories');
    }
  };

  const fetchExpense = async () => {
    try {
      setLoading(true);
      const response = await expensesAPI.getById(id);
      const expense = response.data;

      setFormData({
        amount: expense.amount.toString(),
        date: expense.date?.split('T')[0] || '',
        categoryId: expense.categoryId,
        description: expense.description || '',
        type: expense.type,
        startDate: expense.startDate?.split('T')[0] || '',
        endDate: expense.endDate?.split('T')[0] || '',
        receipt: null
      });
    } catch (error) {
      setError('Failed to load expense details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
 
    if (type === 'file' && files[0]) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file' && files[0]) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validation
      if (!formData.amount || !formData.categoryId) {
        throw new Error('Amount and category are required');
      }

      if (parseFloat(formData.amount) <= 0) {
        throw new Error('Amount must be greater than 0');
      }

      if (formData.type === 'one-time' && !formData.date) {
        throw new Error('Date is required for one-time expenses');
      }

      if (formData.type === 'recurring' && !formData.startDate) {
        throw new Error('Start date is required for recurring expenses');
      }

      // Prepare data
      const apiData = {
        amount: parseFloat(formData.amount),
        categoryId: formData.categoryId,
        type: formData.type,
        description: formData.description
      };

      // Add dates based on type
      if (formData.type === 'one-time') {
        apiData.date = formData.date;
      } else {
        apiData.startDate = formData.startDate;
        if (formData.endDate) apiData.endDate = formData.endDate;
      }

      // Send to API
      if (isEdit) {
        await expensesAPI.update(id, apiData);
        setSuccess('Expense updated successfully!');
      } else {
        await expensesAPI.create(apiData);
        setSuccess('Expense created successfully!');
      }

      // Redirect after success
      setTimeout(() => navigate('/expenses'), 1000);
    } catch (error) {
      setError(error.message || 'Failed to save expense');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
const formatCurrency = (amount) =>
    new Intl.NumberFormat("fr-MG", { style: "currency", currency: "MGA" }).format(amount);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {isEdit ? 'Edit Expense' : 'New Expense'}
            </h1>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-800">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-green-800">
            {success}
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount *
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
                className="w-full p-3 border border-[var(--secondary-color)] rounded outline-[var(--secondary-color)]"
                placeholder="0.00"
                disabled={loading}
              />
            </div>
            {formData.amount && (
              <p className="animate-fadeIn mt-1 text-sm text-gray-500">
                {formatCurrency(parseFloat(formData.amount) || 0)}
              </p>
            )}

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
                className="w-full p-3 border border-[var(--secondary-color)] rounded outline-[var(--secondary-color)]"
                disabled={loading}
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <div className="flex gap-6">
                <label className="cursor-pointer relative">
                  <input
                    type="radio"
                    name="type"
                    value="one-time"
                    checked={formData.type === "one-time"}
                    onChange={handleChange}
                    className="hidden peer"
                    disabled={loading}
                  />
                  <div className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 bg-white shadow-sm 
                      hover:shadow-lg hover:border-[var(--primary-color)]  transition-all duration-300
                      peer-checked:bg-gradient-to-r peer-checked:from-[var(--primary-color)] peer-checked:to-[var(--secondary-color)] 
                      peer-checked:text-white peer-checked:shadow-xl">
                    <span className="text-lg">🛒</span>
                    <span className="font-medium">One-time</span>
                  </div>
                </label>

                <label className="cursor-pointer relative">
                  <input
                    type="radio"
                    name="type"
                    value="recurring"
                    checked={formData.type === "recurring"}
                    onChange={handleChange}
                    className="hidden peer"
                    disabled={loading}
                  />
                  <div className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 bg-white shadow-sm 
                      hover:shadow-lg hover:border-[var(--secondary-color)] transition-all duration-300
                      peer-checked:bg-gradient-to-r peer-checked:from-[var(--secondary-color)] peer-checked:to-[var(--primary-color)]
                      peer-checked:text-white peer-checked:shadow-xl">
                    <span className="text-lg">🔄</span>
                    <span className="font-medium">Recurring</span>
                  </div>
                </label>
              </div>
            </div>


            {/* Date Fields */}
            {formData.type === 'one-time' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-[var(--secondary-color)] rounded outline-[var(--secondary-color)]"
                  disabled={loading}
                />
              </div>
            )}

            {formData.type === 'recurring' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-[var(--secondary-color)] rounded outline-[var(--secondary-color)]"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date (optional)
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full p-3 border border-[var(--secondary-color)] rounded outline-[var(--secondary-color)]"
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full p-3 border border-[var(--secondary-color)] rounded outline-[var(--secondary-color)]"
                placeholder="Optional description"
                disabled={loading}
              />
            </div>

            {/* Receipt */}
            <div>
              <label className="block text-sm font-medium  text-gray-700 mb-2">
                Receipt (optional)
              </label>
              <input
                type="file"
                name="receipt"
                onChange={handleChange}
                className="w-full p-3 border border-[var(--secondary-color)] rounded outline-[var(--secondary-color)]"
                disabled={loading}
              />
              
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 text-white py-3 px-6 rounded font-medium bg-[var(--primary-color)] hover:bg-[var(--secondary-color)] disabled:bg-gray-400"
              >
                {loading ? 'Saving...' : (isEdit ? 'Update Expense' : 'Create Expense')}
              </button>

              <button
                type="button"
                onClick={() => navigate('/expenses')}
                disabled={loading}
                className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded font-medium hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExpenseForm;