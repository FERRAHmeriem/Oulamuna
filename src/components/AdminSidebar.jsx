import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../redux/user/userAction';
import { LogOut, Home, FileText, Users, BarChart2 } from 'lucide-react'; 
import logo from "/logo.png";

const NavItem = ({ to, icon: Icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
        isActive ? 'bg-[#2f7062] text-white' : 'text-gray-200 hover:bg-[#2f7062a9]'
      }`}
    >
      <Icon size={20} />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
};

const AdminSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  return (
    <aside className="h-screen w-64 bg-[#274a43] text-white flex flex-col justify-between fixed left-0 top-0 px-4 py-6 shadow-lg z-50">
      {/* Top logo & title */}
      <div>
        <div className="flex items-center gap-3 mb-10 px-4">
          <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
          <h1 className="text-xl font-bold tracking-wide">Admin Panel</h1>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          <NavItem to="/admin_home" icon={Home} label="Accueil" />
          <NavItem to="/admin_articles" icon={FileText} label="Articles" />
          <NavItem to="/admin_savants" icon={Users} label="Savants" />
          <NavItem to="/admin_statistique" icon={BarChart2} label="Statistiques" />
        </nav>
      </div>

      {/* Logout */}
      <div className="px-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2 rounded-lg hover:bg-[#be6464] transition-colors duration-200 text-sm"
        >
          <LogOut size={20} />
          Se déconnecter
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
