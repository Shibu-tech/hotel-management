import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AppHeader from './AppHeader';
import ExecutiveSidebar from './ExecutiveSidebar';
import Toast from '../ui/Toast';
import { useTasks } from '../../context/TaskContext';

export default function ExecutiveLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast, hideToast } = useTasks();

  return (
    <div className="min-h-screen bg-[#F3F5F8] flex flex-col font-sans text-[#172033]">
      <AppHeader onToggleMobileMenu={() => setMobileMenuOpen(true)} />

      <div className="flex flex-1">
        <ExecutiveSidebar
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      <Toast toast={toast} onClose={hideToast} />
    </div>
  );
}
