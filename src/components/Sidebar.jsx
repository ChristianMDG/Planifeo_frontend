import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
//composant Sidebar avec animations et navigation
const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
// Fonction de déconnexion
// Lors de la déconnexion, rediriger vers la page de connexion
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
// Vérifier si le chemin est actif pour le style
  const isActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

// Variantes d'animation pour les différentes parties de la barre latérale
  const sidebarVariants = {
    hidden: { x: -300, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 0.5,
      },
    },
  };
// Variantes pour les éléments du menu
  const menuItemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: (i) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
      },
    }),
  };
// Variantes pour le contenu principal
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay: 0.2,
      },
    },
  };
// Variantes pour le logo
  const logoVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        duration: 0.5,
      },
    },
  };
// Variantes pour la section utilisateur
  const userSectionVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        delay: 1,
        duration: 2,
      },
    },
  };
// Éléments du menu avec icônes SVG
  const menuItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      path: "/expenses",
      label: "Expenses",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      path: "/incomes",
      label: "Incomes",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      path: "/categories",
      label: "Categories",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
          />
        </svg>
      ),
    },
    {
      path: "/profile",
      label: "Profile",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="md:hidden bg-white shadow-sm border-b border-gray-200 p-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
           
               <motion.div
                className="w-15 h-15 rounded-full flex items-center justify-center bg-white shadow-md border-4 border-[var(--accent-color)]"
                whileHover={{ scale: 1.1, rotate: 10 }}
                transition={{ type: "spring", stiffness: 300 
                }}
              >
                <img src="/logo.png" alt="Logo" className="w-full h-full object-cover rounded-full "/>
              </motion.div>
            
            <h1 className="text-lg font-semibold text-gray-900">Planifieo</h1>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-gray-600 truncate max-w-[120px]"
          >
            {user?.email}
          </motion.div>
        </div>
      </motion.header>

      <motion.aside
        variants={sidebarVariants}
        initial="hidden"
        animate="visible"
        className="bg-[var(--primary-color)] text-black md:w-64 md:min-h-screen w-full md:sticky md:top-0 md:h-screen"
      >
        <motion.div
          variants={logoVariants}
          className="p-6 border-b border-[var(--secondary-color)]"
        >
          <div className="flex items-center space-x-3">
            <div>
              {/* Logo SVG animé */}
              <motion.div
                className="w-15 h-15 rounded-full items-center justify-center bg-white shadow-md border-4 border-[var(--accent-color)] hidden md:flex"
                whileHover={{ scale: 1.1, rotate: 10 }}
                transition={{ type: "spring", stiffness: 300 
                }}
              >
                <img src="/logo.png" alt="Logo" className="w-full h-full object-cover rounded-full "/>
              </motion.div>
            </div>
            <div className="flex flex-col"> 
            </div>
          
            <div>
              
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-blue-100 text-sm"
              >
                Financial Management
              </motion.p>
            </div>
          </div>
        </motion.div>

        <nav className="p-4 space-y-1">
          <AnimatePresence>
            {menuItems.map((item, i) => (
              <motion.div
                key={item.path}
                variants={menuItemVariants}
                initial="hidden"
                animate="visible"
                custom={i}
                whileHover={{ x: 5 }}

              >
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive(item.path)
                      ? "bg-white bg-opacity-20 text-black shadow-lg transform scale-105"
                      : "text-blue-100 hover:bg-white hover:bg-opacity-10 hover:text-black"
                    }`}
                >
                  <motion.span
                    whileHover={{ rotate: 5 }}
                    className={`transition-colors duration-200 ${isActive(item.path)
                        ? "text-black"
                        : "text-blue-200 group-hover:text-black"
                      }`}
                  >
                    {item.icon}
                  </motion.span>
                  <span className="font-medium">{item.label}</span>
                  {isActive(item.path) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto w-2 h-2 bg-white rounded-full"
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </nav>

        <motion.div
          variants={userSectionVariants}
          initial="hidden"
          animate="visible"
          className="absolute bottom-0 left-0 right-0 p-4 border-t border-[var(--secondary-color)] bg-[var(--primary-color)]"
        >
          <div className="flex items-center space-x-3 mb-4">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center"
            >
              <span className="text-sm">👤</span>
            </motion.div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-white">
                {user?.email}
              </p>
              <p className="text-xs text-blue-200 truncate">Active User</p>
            </div>
          </div>

          <motion.button
            whileHover={{
              scale: 1.02,
              borderColor: "var(--secondary-color)",
            }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-white bg-opacity-10 text-black rounded-lg transition-all duration-200 group"
          >
            <motion.svg
              animate={{ x: [0, 3, 0] }}
              transition={{
                repeat: Infinity,
                repeatType: "reverse",
                duration: 1.5,
              }}
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </motion.svg>
            <span className="font-medium">Logout</span>
          </motion.button>
        </motion.div>
      </motion.aside>

      <motion.main
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 min-h-screen overflow-auto"
      >
        <div className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </motion.main>
    </div>
  );
};

export default Sidebar;
