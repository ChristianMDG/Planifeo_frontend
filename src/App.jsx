import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import ExpenseForm from './pages/ExpenseForm';
import Incomes from './pages/Incomes';
import IncomeForm from './pages/IncomeForm';
import Categories from './pages/Categories';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<ProtectedRoute><Sidebar /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="expenses/new" element={<ExpenseForm />} />
            <Route path="expenses/:id/edit" element={<ExpenseForm />} />
            <Route path="incomes" element={<Incomes />} />
            <Route path="incomes/new" element={<IncomeForm />} />
            <Route path="incomes/:id/edit" element={<IncomeForm />} />
            <Route path="categories" element={<Categories />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;