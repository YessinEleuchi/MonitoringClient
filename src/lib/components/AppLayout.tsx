
import React from 'react';
import { useAuth } from '@/contexts/AuthContext.tsx';
import { Button } from "@/lib/components/ui/button.tsx";
import { LogOut, Monitor, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, title }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Monitor className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Monitoring Portal</span>
              </Link>
              
              {location.pathname !== '/' && (
                <nav className="hidden md:flex space-x-1">
                  <Link 
                    to="/" 
                    className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    Applications
                  </Link>
                </nav>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{user?.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        </div>
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
