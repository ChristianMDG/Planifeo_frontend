import { useState, useEffect } from "react";
import { userAPI } from "../services/userAPI";
import { useAuth } from "../contexts/AuthContext";

import { CreditCard, DollarSign, PieChart as PieChartIcon, Calendar } from 'lucide-react';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const { user, logout } = useAuth();

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const profileResponse = await userAPI.getProfile();
      setProfile(profileResponse.data);
    } catch (error) {
      setError("Failed to fetch profile data");
      console.error("Profile error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError("");
    setSuccess("");

    if (newPassword !== confirmNewPassword) {
      setError("New password and confirm password do not match.");
      setUpdating(false);
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      setUpdating(false);
      return;
    }

    try {
      await userAPI.updatePassword({
        currentPassword,
        newPassword,
      });
      setSuccess("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password.");
      console.error("Password update error:", err);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteAccount = () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }
    if (!window.confirm('This will permanently delete all your data. Please type "DELETE" to confirm.')) {
      return;
    }
    setError("Account deletion is not implemented yet.");
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-color)]"></div>
    </div>
  );

  // Icônes SVG pour les cartes d'information
  const userIcon = (
    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  const mailIcon = (
    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );

  const calendarIcon = (
    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );

  const clockIcon = (
    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  return (
    <div className="max-w-4xl mx-auto p-5 md:p-10">
      {/* HEADER */}
      <div className="animate-fadeIn flex justify-between items-center mb-8 pb-5 border-b-2 border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
          <p className="mt-1 text-gray-600">Manage your account settings</p>
        </div>
      </div>

      {/* Affichage des messages d'erreur et de succès */}
      {error && (
        <div className="animate-shake bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-5">
          {error}
        </div>
      )}
      {success && (
        <div className="animate-fadeIn bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-5">
          {success}
        </div>
      )}

      {/* navigation par onglets */}
      <div className="animate-fadeIn flex gap-0 mb-8 border-b border-gray-300">
        {["overview", "security"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              transition-all duration-200 py-3 px-6 rounded-t-lg font-medium
              ${activeTab === tab
                ? "bg-[#2c98a0] text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
              }
            `}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Contenu de l'onglet Aperçu */}
      {activeTab === "overview" && (
        <div className="animate-fadeIn">
          {/* Statistics cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <StatCard 
              title="Total Expenses" 
              value={profile?._count?.expenses || 0} 
              icon={<CreditCard className="w-5 h-5" />} 
              color="#ff4757" 
              delay="0s"
            />
            <StatCard 
              title="Total Income" 
              value={profile?._count?.incomes || 0} 
              icon={<DollarSign className="w-5 h-5" />} 
              color="#2ed573" 
              delay="0.1s"
            />
            <StatCard 
              title="Categories" 
              value={profile?._count?.categories || 0} 
              icon={<PieChartIcon className="w-5 h-5" />} 
              color="#3742fa" 
              delay="0.2s"
            />
            <StatCard 
              title="Member Since" 
              value={new Date(profile?.createdAt).toLocaleDateString()} 
              icon={<Calendar className="w-5 h-5" />} 
              color="#ffa502" 
              delay="0.3s"
            />
          </div>

          {/* Account information section */}
          <div className="p-6 bg-white rounded-lg shadow mb-5">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">Account Information</h3>
            <div className="flex flex-col gap-4">
              <InfoCard 
                label="Email" 
                value={user?.email || "N/A"} 
                icon={mailIcon} 
                delay="0s"
              />
              <InfoCard 
                label="Account Created" 
                value={new Date(profile?.createdAt).toLocaleString()} 
                icon={calendarIcon} 
                delay="0.1s"
              />
              <InfoCard 
                label="Last Updated" 
                value={profile?.updatedAt ? new Date(profile?.updatedAt).toLocaleString() : "N/A"} 
                icon={clockIcon} 
                delay="0.2s"
              />
            </div>
          </div>
        </div>
      )}

      {/* Security tab content */}
      {activeTab === "security" && (
        <div className="animate-fadeIn p-6 bg-white rounded-xl shadow-lg">
          <h1 className="mt-0 mb-8 text-gray-800 font-semibold">Security Settings</h1>

          <form onSubmit={handlePasswordChange} className="mb-8">
            <div className="grid gap-4 max-w-md mx-auto">
              <div>
                <label className="block mb-1 font-semibold text-gray-700">Current Password</label>
                <input
                  type="password"
                  className="transition-all duration-200 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={updating}
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-gray-700">New Password</label>
                <input
                  type="password"
                  className="transition-all duration-200 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={updating}
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-gray-700">Confirm New Password</label>
                <input
                  type="password"
                  className="transition-all duration-200 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  disabled={updating}
                />
              </div>
              <button
                type="submit"
                disabled={updating}
                className={`
                  transition-all duration-200 py-3 px-6 rounded-lg font-semibold text-white
                  ${updating ? "bg-gray-400 cursor-not-allowed" : "bg-[#2c98a0] hover:bg-opacity-90"}
                `}
              >
                {updating ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>

          <div className="p-5 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 className="mt-0 mb-2 font-semibold text-yellow-800">⚠️ Danger Zone</h4>
            <p className="mt-0 mb-4 text-yellow-800">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button
              onClick={handleDeleteAccount}
              className="transition-all duration-200 py-2 px-5 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700"
            >
              Delete Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon, color, delay }) => (
  <div 
    className="transition-all duration-300 p-5 bg-white rounded-lg shadow border-l-4 hover:shadow-lg"
    style={{ 
      borderColor: color,
      animation: `fadeIn 0.5s ease ${delay} both`
    }}
  >
    <div className="flex items-center mb-3">
      <div className="text-2xl mr-3" style={{ color: color }}>
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-gray-600">{title}</h3>
    </div>
    <div className="text-2xl font-bold text-gray-800">{value}</div>
  </div>
);

const InfoCard = ({ label, value, icon, delay }) => (
  <div 
    className="transition-all duration-300 p-5 bg-white rounded-lg shadow-sm hover:shadow-md flex items-center space-x-4"
    style={{ animation: `fadeIn 0.5s ease ${delay} both` }}
  >
    {icon}
    <div className="flex-1">
      <div className="text-gray-500 font-semibold text-sm">{label}</div>
      <div className="mt-1 text-gray-800 font-medium">{value}</div>
    </div>
  </div>
);

export default Profile;