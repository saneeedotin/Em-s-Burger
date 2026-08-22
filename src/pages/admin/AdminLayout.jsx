import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Users, Award, LogOut, Store, Search, QrCode } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function AdminLayout() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Sidebar */}
      <aside className="w-64 bg-dark text-cream flex flex-col hidden md:flex border-r border-primary/20">
        <div className="p-6 border-b border-white/10">
          <Link to="/" className="flex items-center gap-3 text-primary hover:text-accent transition-colors group">
            <img 
              src="/logoo.svg" 
              alt="EM's Burgers" 
              className="w-10 h-10 object-contain group-hover:scale-110 group-hover:rotate-[-3deg] transition-transform duration-300 filter drop-shadow-md" 
            />
            <div className="flex flex-col">
              <span className="font-heading font-black text-2xl tracking-tighter uppercase leading-none">Admin</span>
              <span className="font-heading font-extrabold tracking-widest uppercase opacity-90 text-[10px] text-cream pt-1">EM's Burgers</span>
            </div>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <NavLink 
            to="/admin" 
            end
            className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive ? 'bg-primary text-cream' : 'text-cream/70 hover:bg-white/5 hover:text-cream'}`}
          >
            <Search size={20} />
            Search
          </NavLink>
          <NavLink 
            to="/admin/orders" 
            className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive ? 'bg-primary text-cream' : 'text-cream/70 hover:bg-white/5 hover:text-cream'}`}
          >
            <LayoutDashboard size={20} />
            Orders
          </NavLink>
          <NavLink 
            to="/admin/users" 
            className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive ? 'bg-primary text-cream' : 'text-cream/70 hover:bg-white/5 hover:text-cream'}`}
          >
            <Users size={20} />
            Customers
          </NavLink>
          <NavLink 
            to="/admin/loyalty" 
            className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive ? 'bg-primary text-cream' : 'text-cream/70 hover:bg-white/5 hover:text-cream'}`}
          >
            <Award size={20} />
            Loyalty Override
          </NavLink>
          <NavLink 
            to="/admin/menu" 
            className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive ? 'bg-primary text-cream' : 'text-cream/70 hover:bg-white/5 hover:text-cream'}`}
          >
            <Store size={20} />
            Menu
          </NavLink>
          <NavLink 
            to="/admin/qr" 
            className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive ? 'bg-primary text-cream' : 'text-cream/70 hover:bg-white/5 hover:text-cream'}`}
          >
            <QrCode size={20} />
            Table QR Codes
          </NavLink>
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link 
            to="/" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-cream/70 hover:bg-white/5 hover:text-cream transition-colors"
          >
            <Store size={20} />
            Back to Store
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-dark/10 flex items-center justify-between px-6 lg:px-10 shrink-0 shadow-sm z-10">
          <h1 className="font-heading font-bold text-xl text-dark">
            EM's Burger Management
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-dark/60">
              Logged in as: <strong className="text-dark">{currentUser?.name || 'Admin'}</strong>
            </span>
          </div>
        </header>

        {/* Scrollable Content */}
        <div data-lenis-prevent="true" className="flex-1 overflow-y-auto p-6 lg:p-10 bg-[#FAF7F2]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
