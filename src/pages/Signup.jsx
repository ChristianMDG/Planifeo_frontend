import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Signup = () => {
  // Variants pour orchestrer les animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const { signup } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const calculatePasswordStrength = (password) => {
      let strength = 0;
      if (password.length >= 8) strength += 1;
      if (/[A-Z]/.test(password)) strength += 1;
      if (/[0-9]/.test(password)) strength += 1;
      if (/[^A-Za-z0-9]/.test(password)) strength += 1;
      return strength;
    };
    setPasswordStrength(calculatePasswordStrength(formData.password));
  }, [formData.password]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    try {
      const result = await signup(formData.email, formData.password);
      if (result.success) navigate("/dashboard");
      else setError(result.error);
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = (strength) => {
    if (strength === 0) return "#9ca3af";
    if (strength === 1) return "#ef4444";
    if (strength === 2) return "#f59e0b";
    if (strength === 3) return "#3b82f6";
    return "#10b981";
  };

  const getPasswordStrengthText = (strength) => {
    if (strength === 0) return "Very weak";
    if (strength === 1) return "Weak";
    if (strength === 2) return "Medium";
    if (strength === 3) return "Strong";
    return "Very strong";
  };

  return (
    <div className="min-h-screen flex flex-row-reverse">
      {/* Left Panel - Signup Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ">
        <div className="w-full max-w-md anime">
          <div className="rounded-2xl shadow-xl p-8 bg-[var(--bg-color)]">
            <div className="text-center mb-8">
              <div className="w-30 h-30 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md border-4 border-[var(--accent-color)]">
                <img src="/log.png" alt="Logo" className="w-full h-full object-cover rounded-2xl "/>
              </div>
             
              <p style={{ color: "var(--secondary-color)" }}>
                Join thousands managing their expenses smarter
              </p>
            </div>

            {error && (
              <div
                className="mb-6 p-4 border rounded-lg"
                style={{ borderColor: "var(--error-color)" }}
              >
                <div className="flex items-center">
                  <span className="text-red-600 text-sm">{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--text-color)" }}
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors"
                  style={{
                    borderColor: "var(--secondary-color)",
                    color: "var(--text-color)",
                  }}
                  placeholder="Enter your email"
                  disabled={loading}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--text-color)" }}
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors pr-12"
                    style={{
                      borderColor: "var(--secondary-color)",
                      color: "var(--text-color)",
                    }}
                    placeholder="Create a password"
                    disabled={loading}
                    required
                    minLength="8"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    style={{ color: "var(--secondary-color)" }}
                    disabled={loading}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                {formData.password && (
                  <div className="mt-3">
                    <div className="flex justify-between items-center mb-1">
                      <span
                        className="text-xs"
                        style={{ color: "var(--text-color)" }}
                      >
                        Password strength:
                      </span>
                      <span
                        className="text-xs font-medium"
                        style={{
                          color: getPasswordStrengthColor(passwordStrength),
                        }}
                      >
                        {getPasswordStrengthText(passwordStrength)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${(passwordStrength / 4) * 100}%`,
                          backgroundColor:
                            getPasswordStrengthColor(passwordStrength),
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--text-color)" }}
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors pr-12"
                    style={{
                      borderColor: "var(--secondary-color)",
                      color: "var(--text-color)",
                    }}
                    placeholder="Confirm your password"
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    style={{ color: "var(--secondary-color)" }}
                    disabled={loading}
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: "var(--primary-color)",
                  color: "white",
                }}
                className="w-full py-3 px-4 rounded-lg font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs" style={{ color: "var(--text-color)" }}>
                Already have an account?{" "}
                <Link
                  to="/login"
                  style={{ color: "var(--primary-color)", fontWeight: "500" }}
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm" style={{ color: "var(--secondary-color)" }}>
              © 2024 Expense Tracker. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Welcome Message */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] items-center justify-center p-12 relative overflow-hidden">
        <div className="relative z-10 text-white text-center max-w-lg anime">
          <h1 className="text-5xl font-bold mb-6">
            Start Your Financial Journey
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who are taking control of their finances
            with Planifieo. Track expenses, set budgets, and achieve your
            financial goals.
          </p>
          <div className="space-y-4 text-left">
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-lg mr-4">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <span>Secure and encrypted data protection</span>
            </div>
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-lg mr-4">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 14v6m-3-3h6M6 10h2a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2zm10-4a2 2 0 11-4 0 2 2 0 014 0zM4 6a2 2 0 100-4 2 2 0 000 4z"
                  />
                </svg>
              </div>
              <span>Smart budgeting tools and insights</span>
            </div>
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-lg mr-4">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <span>Fast and intuitive expense tracking</span>
            </div>
          </div>
        </div>

        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-white/70 float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-white/70 float"></div>

          {/* Animated floating elements */}
          <div className="absolute top-1/4 left-1/4 animate-float">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              className="text-white/30"
            >
              <path
                d="M12 1V23M1 12H23"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div
            className="absolute top-1/4 right-1/4 animate-float"
            style={{ animationDelay: "1s" }}
          >
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              className="text-white/30"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>
          <div
            className="absolute bottom-1/4 left-1/4 animate-float"
            style={{ animationDelay: "2s" }}
          >
            <svg
              width="35"
              height="35"
              viewBox="0 0 24 24"
              fill="none"
              className="text-white/30"
            >
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="2"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
