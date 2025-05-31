
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import AppLayout from '@/lib/components/AppLayout.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/components/ui/card.tsx";
import { Button } from "@/lib/components/ui/button.tsx";
import { Badge } from "@/lib/components/ui/badge.tsx";
import { ArrowLeft, Play, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface Endpoint {
  id: string;
  name: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description: string;
  status: 'healthy' | 'warning' | 'error';
  responseTime: string;
  lastTested: string;
}

const endpointData: { [key: string]: Endpoint[] } = {
  'payment-api': [
    {
      id: 'create-payment',
      name: 'Create Payment',
      path: '/api/v1/payments',
      method: 'POST',
      description: 'Process a new payment transaction',
      status: 'healthy',
      responseTime: '145ms',
      lastTested: '2 minutes ago'
    },
    {
      id: 'get-payment',
      name: 'Get Payment Status',
      path: '/api/v1/payments/{id}',
      method: 'GET',
      description: 'Retrieve payment status and details',
      status: 'healthy',
      responseTime: '89ms',
      lastTested: '1 minute ago'
    },
    {
      id: 'refund-payment',
      name: 'Process Refund',
      path: '/api/v1/payments/{id}/refund',
      method: 'POST',
      description: 'Process a payment refund',
      status: 'warning',
      responseTime: '2.1s',
      lastTested: '3 minutes ago'
    }
  ],
  'user-service': [
    {
      id: 'user-auth',
      name: 'User Authentication',
      path: '/api/v1/auth/login',
      method: 'POST',
      description: 'Authenticate user credentials',
      status: 'healthy',
      responseTime: '95ms',
      lastTested: '30 seconds ago'
    },
    {
      id: 'user-profile',
      name: 'Get User Profile',
      path: '/api/v1/users/{id}',
      method: 'GET',
      description: 'Retrieve user profile information',
      status: 'healthy',
      responseTime: '67ms',
      lastTested: '1 minute ago'
    }
  ]
};

const getMethodColor = (method: string) => {
  switch (method) {
    case 'GET':
      return 'bg-green-100 text-green-800';
    case 'POST':
      return 'bg-blue-100 text-blue-800';
    case 'PUT':
      return 'bg-orange-100 text-orange-800';
    case 'DELETE':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'healthy':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'warning':
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    case 'error':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const ApplicationEndpoints = () => {
  const { appId } = useParams<{ appId: string }>();
  const endpoints = endpointData[appId || ''] || [];
  
  const appNames: { [key: string]: string } = {
    'payment-api': 'Payment Gateway API',
    'user-service': 'User Management Service',
    'analytics-api': 'Analytics & Reporting API',
    'notification-service': 'Notification Service'
  };

  const appName = appNames[appId || ''] || 'Unknown Application';

  return (
    <AppLayout title={`${appName} - Endpoints`}>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Applications
            </Button>
          </Link>
        </div>

        {/* Endpoints Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Endpoints</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{endpoints.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Healthy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {endpoints.filter(e => e.status === 'healthy').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Avg Response Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">124ms</div>
            </CardContent>
          </Card>
        </div>

        {/* Endpoints List */}
        <div className="space-y-4">
          {endpoints.map((endpoint) => (
            <Card key={endpoint.id} className="hover:shadow-md transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Badge className={getMethodColor(endpoint.method)}>
                        {endpoint.method}
                      </Badge>
                      <CardTitle className="text-lg">{endpoint.name}</CardTitle>
                      {getStatusIcon(endpoint.status)}
                    </div>
                    <CardDescription className="text-sm font-mono bg-gray-50 px-2 py-1 rounded">
                      {endpoint.path}
                    </CardDescription>
                    <p className="text-sm text-gray-600 mt-2">{endpoint.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{endpoint.responseTime}</span>
                    </div>
                    <span>Last tested: {endpoint.lastTested}</span>
                  </div>
                  
                  <Link to={`/applications/${appId}/endpoints/${endpoint.id}/test`}>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Play className="h-4 w-4 mr-1" />
                      Test Endpoint
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default ApplicationEndpoints;
