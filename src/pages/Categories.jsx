
import { useState, useEffect } from "react";
import {
  Utensils,
  Car,
  Gamepad2,
  Zap,
  Home,
  HeartPulse,
  FolderOpen,
  Pencil,
  Trash2,
  Plus,
  CircleCheck,
  XCircle,
  Loader2,
  Tags,
} from "lucide-react";
import { categoriesAPI } from "../services";
// Page de gestion des catégories de dépenses
const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
// Palette de couleurs pour les catégories
  const colorPalette = [
    "red-500",
    "green-500",
    "blue-500",
    "purple-500",
    "pink-500",
    "yellow-500",
    "indigo-500",
  ];
// Obtenir la classe de couleur pour une catégorie donnée
  const getCategoryColorClass = (categoryName) => {
    const index = categories.findIndex((cat) => cat.name === categoryName);
    return colorPalette[index % colorPalette.length];
  };
// Obtenir la couleur hexadécimale pour une catégorie donnée
  const getCategoryColor = (categoryName) => {
    const index = categories.findIndex((cat) => cat.name === categoryName);
    const color = colorPalette[index % colorPalette.length];
    switch (color) {
      case "red-500":
        return "#ef4444";
      case "green-500":
        return "#22c55e";
      case "blue-500":
        return "#3b82f6";
      case "purple-500":
        return "#a855f7";
      case "pink-500":
        return "#ec4899";
      case "yellow-500":
        return "#eab308";
      case "indigo-500":
        return "#6366f1";
      default:
        return "#000000";
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);
// Récupérer les catégories depuis l'API
  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      setError("Failed to fetch categories");
      console.error("Categories error:", error);
    } finally {
      setLoading(false);
    }
  };
// Gérer la création d'une nouvelle catégorie
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      setError("Category name is required");
      return;
    }
// Indiquer que la création est en cours
    setCreating(true);
    setError("");
    setSuccess("");
// Appeler l'API pour créer la catégorie
    try {
      const response = await categoriesAPI.create({
        name: newCategoryName.trim(),
      });
      setCategories((prev) => [...prev, response.data]);
      setNewCategoryName("");
      setSuccess("Category created successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError(error.response?.data?.error || "Failed to create category");
      console.error("Create category error:", error);
    } finally {
      setCreating(false);
    }
  };
// Gérer la mise à jour d'une catégorie
  const handleUpdateCategory = async (id, newName) => {
    if (!newName.trim()) {
      setError("Category name is required");
      return;
    }
// Appeler l'API pour mettre à jour la catégorie
    try {
      const response = await categoriesAPI.update(id, { name: newName.trim() });
      setCategories((prev) =>
        prev.map((cat) => (cat.id === id ? response.data : cat))
      );
      setEditingId(null);
      setEditName("");
      setSuccess("Category updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError(error.response?.data?.error || "Failed to update category");
      console.error("Update category error:", error);
    }
  };
// Confirmer la suppression d'une catégorie
  const confirmDelete = (category) => {
    setCategoryToDelete(category);
    setShowModal(true);
  };
// Fermer la modale de confirmation
  const closeModal = () => {
    setShowModal(false);
    setCategoryToDelete(null);
  };
// Gérer la suppression d'une catégorie
  const handleConfirmDelete = async () => {
    try {
      await categoriesAPI.delete(categoryToDelete.id);
      setCategories((prev) =>
        prev.filter((category) => category.id !== categoryToDelete.id)
      );
      setSuccess("Category deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError(error.response?.data?.error || "Failed to delete category");
      console.error("Delete category error:", error);
    } finally {
      closeModal();
    }
  };
// Démarrer l'édition d'une catégorie
  const startEditing = (category) => {
    setEditingId(category.id);
    setEditName(category.name);
  };
// Annuler l'édition d'une catégorie
  const cancelEditing = () => {
    setEditingId(null);
    setEditName("");
  };
// Afficher un indicateur de chargement si les données sont en cours de récupération
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div 
          className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
          style={{ animation: "spin 1s linear infinite" }}
        ></div>
      </div>
    );
  }
// Vérifier si une catégorie est une catégorie par défaut
  const isDefaultCategory = (categoryName) => {
    const defaultCategories = [
      "Food",
      "Transportation",
      "Entertainment",
      "Utilities",
      "Rent",
      "Healthcare",
      "Other",
    ];
    return defaultCategories.includes(categoryName);
  };
// Obtenir l'icône pour une catégorie donnée
  const getCategoryIcon = (categoryName, colorClass) => {
    const color = colorClass.replace("-500", "-600");
    const className = `w-8 h-8 text-${color}`;
    switch (categoryName) {
      case "Food":
        return <Utensils className={className} />;
      case "Transportation":
        return <Car className={className} />;
      case "Entertainment":
        return <Gamepad2 className={className} />;
      case "Utilities":
        return <Zap className={className} />;
      case "Rent":
        return <Home className={className} />;
      case "Healthcare":
        return <HeartPulse className={className} />;
      case "Other":
        return <FolderOpen className={className} />;
      default:
        return <Tags className={className} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div 
          className="mb-8"
          style={{ animation: "fadeIn 0.5s ease" }}
        >
          <h1 className="text-3xl font-bold text-gray-900">
            Expense Categories
          </h1>
          <p className="text-gray-600 mt-2">
            Organize your expenses with custom categories
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div 
            className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4"
            style={{ animation: "fadeIn 0.3s ease, shake 0.5s ease" }}
          >
            <div className="flex items-center">
              <XCircle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}
        {success && (
          <div 
            className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4"
            style={{ animation: "fadeIn 0.5s ease, slideUp 0.5s ease" }}
          >
            <div className="flex items-center">
              <CircleCheck className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-green-800">{success}</span>
            </div>
          </div>
        )}

        {/* Add Category */}
        <div 
          className="bg-white rounded-lg shadow-lg p-6 mb-8 flex flex-col sm:flex-row items-center justify-between"
          style={{ animation: "fadeIn 0.5s ease, slideUp 0.5s ease" }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4 sm:mb-0">
            Add New Category
          </h2>
          <form
            onSubmit={handleCreateCategory}
            className="flex flex-col sm:flex-row gap-2 items-center w-full sm:w-auto"
          >
            <input
              id="categoryName"
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Category name"
              className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              disabled={creating}
              style={{ transition: "all 0.2s ease" }}
            />
            <button
              type="submit"
              disabled={creating || !newCategoryName.trim()}
              className="w-full sm:w-auto px-4 py-2 bg-[var(--primary-color)] text-white font-medium rounded-lg hover:bg-[var(--secondary-color)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              style={{ transition: "all 0.2s ease" }}
            >
              {creating ? (
                <div className="flex items-center justify-center">
                  <Loader2 
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                  Creating...
                </div>
              ) : (
                <>
                  <Plus className="inline-block h-4 w-4 mr-2" /> Add
                </>
              )}
            </button>
          </form>
        </div>

        {/* Categories */}
        <div 
          className="bg-white rounded-lg shadow-lg p-6"
          style={{ animation: "fadeIn 0.5s ease, slideUp 0.5s ease" }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Your Categories
            </h2>
            <span className="text-sm text-gray-500">
              {categories.length}{" "}
              {categories.length === 1 ? "category" : "categories"}
            </span>
          </div>
         

          {categories.length === 0 ? (
            <div 
              className="text-center py-12"
              style={{ animation: "fadeIn 0.5s ease" }}
            >
              <Tags className="mx-auto h-16 w-16 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No categories yet
              </h3>
              <p className="mt-2 text-gray-500">
                Start by adding your first category above.
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category, index) => {
                const colorClass = getCategoryColorClass(category.name);
                const colorHex = getCategoryColor(category.name);
                return (
                  <div
                    key={category.id}
                    className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.67rem)] relative flex flex-col items-center justify-center p-6 border-l-4 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300"
                    style={{ 
                      borderLeftColor: colorHex,
                      animation: `fadeIn 0.5s ease ${index * 0.1}s both`,
                      transition: "all 0.3s ease"
                    }}
                  >
                    <div
                      className={`p-3 rounded-full mb-4 bg-white border transition-all duration-300`}
                      style={{ borderColor: colorHex }}
                    >
                      {getCategoryIcon(category.name, colorClass)}
                    </div>
                    <div className="text-center">
                      {editingId === category.id ? (
                        <div className="flex flex-col items-center gap-2">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--secondary-color)] focus:border-transparent transition-all duration-200"
                            autoFocus
                            style={{ transition: "all 0.2s ease" }}
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={() =>
                                handleUpdateCategory(category.id, editName)
                              }
                              className="p-2 text-green-600 hover:text-green-800 rounded-md transition-all duration-200"
                              title="Save"
                              style={{ transition: "all 0.2s ease" }}
                            >
                              <CircleCheck className="w-5 h-5" />
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="p-2 text-gray-500 hover:text-gray-700 rounded-md transition-all duration-200"
                              title="Cancel"
                              style={{ transition: "all 0.2s ease" }}
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <span className="text-lg font-semibold text-gray-900">
                            {category.name}
                          </span>
                          {isDefaultCategory(category.name) && (
                            <span className="ml-2 px-2 py-1 bg-blue-100 text-[var(--primary-color)] text-xs font-medium rounded-full">
                              Default
                            </span>
                          )}
                          {!isDefaultCategory(category.name) && (
                            <div className="absolute top-2 right-2 flex space-x-1">
                              <button
                                onClick={() => startEditing(category)}
                                className="p-1 text-[var(--primary-color)] hover:text-[var(--secondary-color)] hover:bg-blue-50 rounded-md transition-all duration-200"
                                title="Edit category"
                                style={{ transition: "all 0.2s ease" }}
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => confirmDelete(category)}
                                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-all duration-200"
                                title="Delete category"
                                style={{ transition: "all 0.2s ease" }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showModal && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ animation: "fadeIn 0.3s ease" }}
          >
            <div className="absolute inset-0 backdrop-blur-sm bg-black/30"></div>
            <div 
              className="relative bg-white rounded-lg shadow-lg max-w-sm w-full p-6 z-10"
              style={{ animation: "scaleIn 0.3s ease" }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Confirm Deletion
              </h3>
              <p className="mb-6">
                Are you sure you want to delete the category{" "}
                <strong>{categoryToDelete?.name}</strong>?
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition-all duration-200"
                  style={{ transition: "all 0.2s ease" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all duration-200"
                  style={{ transition: "all 0.2s ease" }}
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

export default Categories;