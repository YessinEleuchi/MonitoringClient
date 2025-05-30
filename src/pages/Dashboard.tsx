
import React from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Server, Activity, Database, Globe, ArrowRight } from 'lucide-react';

interface Application {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'maintenance';
  endpoints: number;
  icon: React.ComponentType<{ className?: string }>;
  lastHealthCheck: string;
}

const applications: Application[] = [
  {
    id: 'payment-api',
    name: 'Payment Gateway API',
    description: 'Core payment processing and transaction management system',
    status: 'active',
    endpoints: 12,
    icon: Server,
    lastHealthCheck: '2 minutes ago'
  },
  {
    id: 'user-service',
    name: 'User Management Service',
    description: 'Authentication, authorization, and user profile management',
    status: 'active',
    endpoints: 8,
    icon: Database,
    lastHealthCheck: '1 minute ago'
  },
  {
    id: 'analytics-api',
    name: 'Analytics & Reporting API',
    description: 'Real-time analytics, metrics collection, and reporting',
    status: 'maintenance',
    endpoints: 15,
    icon: Activity,
    lastHealthCheck: '5 minutes ago'
  },
  {
    id: 'notification-service',
    name: 'Notification Service',
    description: 'Email, SMS, and push notification delivery system',
    status: 'active',
    endpoints: 6,
    icon: Globe,
    lastHealthCheck: '30 seconds ago'
  }
];

const getStatusColor = (status: Application['status']) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'inactive':
      return 'bg-red-100 text-red-800';
    case 'maintenance':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const Dashboard = () => {
  const activeApps = applications.filter(app => app.status === 'active').length;
  const totalEndpoints = applications.reduce((sum, app) => sum + app.endpoints, 0);

  return (
    <AppLayout title="Application Hub">
      <div className="space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Applications</CardTitle>
              <Server className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{applications.length}</div>
              <p className="text-xs text-gray-500 mt-1">{activeApps} active, {applications.length - activeApps} inactive</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Endpoints</CardTitle>
              <Activity className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{totalEndpoints}</div>
              <p className="text-xs text-gray-500 mt-1">Across all applications</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">System Health</CardTitle>
              <Database className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Healthy</div>
              <p className="text-xs text-gray-500 mt-1">All systems operational</p>
            </CardContent>
          </Card>
        </div>

        {/* Applications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {applications.map((app) => {
            const IconComponent = app.icon;
            return (
              <Card key={app.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <IconComponent className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{app.name}</CardTitle>
                        <CardDescription className="text-sm mt-1">
                          {app.description}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={getStatusColor(app.status)}>
                      {app.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{app.endpoints} endpoints</span>
                      <span>Last check: {app.lastHealthCheck}</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Link to={`/applications/${app.id}/endpoints`} className="flex-1">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                          View Endpoints
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
