import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import '../styles/DashboardLayout.css';

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (user?.role !== 'admin') {
    return <div>Access Denied</div>;
  }

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <div className="dashboard-layout">
      <button className="mobile-menu-toggle" onClick={toggleMenu}>
        ☰
      </button>
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>FormaJOY</h2>
        </div>
        <nav className="sidebar-nav">
          <Link
            to="/dashboard"
            className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Gestion des Utilisateurs
          </Link>
          <Link
            to="/dashboard/students"
            className={`nav-link ${location.pathname === '/dashboard/students' ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Gestion des Étudiants
          </Link>
          <Link
            to="/dashboard/teachers"
            className={`nav-link ${location.pathname === '/dashboard/teachers' ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Gestion des Enseignants
          </Link>
          <Link
            to="/dashboard/courses"
            className={`nav-link ${location.pathname === '/dashboard/courses' ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Gestion des Cours
          </Link>
          <Link
            to="/dashboard/payments"
            className={`nav-link ${location.pathname === '/dashboard/payments' ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Gestion des Paiements
          </Link>
          
        </nav>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            Déconnexion
          </button>
        </div>
      </aside>
      <main className="dashboard-main">
        {children}
      </main>
    </div>
  );
}