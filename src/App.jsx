import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MenuProvider } from './context/MenuContext';
import { GroceryProvider } from './context/GroceryContext';
import { TasksProvider } from './context/TasksContext';
import { SchedulesProvider } from './context/SchedulesContext';
import CalendarPage from './pages/CalendarPage';
import GroceryListPage from './pages/GroceryListPage';
import TasksPage from './pages/TasksPage';
import SchedulesPage from './pages/SchedulesPage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import { Button } from './components/ui/button';
import { CalendarDays, ShoppingCart, CheckSquare, Clock, Settings, Loader2 } from 'lucide-react';

const AppContent = () => {
  const { isAuthenticated, loading, user } = useAuth();
  const [currentPage, setCurrentPage] = useState('calendar');

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'calendar':
        return <CalendarPage />;
      case 'grocery':
        return <GroceryListPage />;
      case 'tasks':
        return <TasksPage />;
      case 'schedules':
        return <SchedulesPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <CalendarPage />;
    }
  };

  const navItems = [
    { key: 'calendar', label: 'Menú', icon: CalendarDays },
    { key: 'grocery', label: 'Supermercado', icon: ShoppingCart },
    { key: 'tasks', label: 'Tareas', icon: CheckSquare },
    { key: 'schedules', label: 'Horarios', icon: Clock },
    { key: 'settings', label: 'Ajustes', icon: Settings },
  ];

  return (
    <MenuProvider>
      <GroceryProvider>
        <TasksProvider>
          <SchedulesProvider>
            <div className="min-h-screen bg-background text-foreground">
              <header className="border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
                <div className="container mx-auto px-4 py-2">
                  <div className="flex items-center justify-between mb-2">
                    <h1 className="text-xl font-bold text-gray-800">Tareas Casa</h1>
                    <span className="text-sm text-gray-500 hidden sm:block">
                      Hola, {user?.username}
                    </span>
                  </div>
                  <nav className="flex gap-2 pt-2 pb-2 overflow-x-auto">
                    {navItems.map(({ key, label, icon: Icon }) => (
                      <Button
                        key={key}
                        variant={currentPage === key ? 'primary' : 'ghost'}
                        onClick={() => setCurrentPage(key)}
                        size="sm"
                      >
                        <Icon size={16} />
                        <span className="ml-1.5 hidden sm:inline">{label}</span>
                      </Button>
                    ))}
                  </nav>
                </div>
              </header>
              <main className="container mx-auto py-6 px-4">
                {renderPage()}
              </main>
            </div>
          </SchedulesProvider>
        </TasksProvider>
      </GroceryProvider>
    </MenuProvider>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
