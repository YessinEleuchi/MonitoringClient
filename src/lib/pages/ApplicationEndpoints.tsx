// src/pages/ApplicationEndpoints.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AppLayout from '@/lib/components/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/lib/components/ui/card';
import { Button } from '@/lib/components/ui/button';
import { Badge } from '@/lib/components/ui/badge';
import { ArrowLeft, Play, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { listEndpoints } from '@/services/endpointService';
import { getApplication, getAppStats } from '@/services/applicationService';

interface Endpoint {
  id: number;
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description?: string;
  responseTime?: string;
  status?: 'healthy' | 'warning' | 'error';
  lastTested?: string;
  application_id: number;
}

interface AppStats {
  app_id: number;
  success_rate: number;
  avg_response_time: number;
  last_updated: string;
  endpoints: number;
  last_health_check: string;
}

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

const getStatusIcon = (status?: string) => {
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
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [appName, setAppName] = useState<string>('...');
  const [stats, setStats] = useState<AppStats | null>(null);

  useEffect(() => {
    const fetchAppName = async () => {
      try {
        if (appId) {
          const res = await getApplication(Number(appId));
          setAppName(res.data.name || `Application ${appId}`);
        }
      } catch (err) {
        console.warn('❌ Erreur chargement nom application :', err);
        setAppName(`Application ${appId}`);
      }
    };
    fetchAppName();
  }, [appId]);

  useEffect(() => {
    const fetchEndpoints = async () => {
      try {
        const res = await listEndpoints();
        const all = res.data;
        const filtered = all.filter(e => e.application_id.toString() === appId);
        setEndpoints(filtered);
      } catch (err) {
        console.error('Erreur chargement endpoints:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEndpoints();
  }, [appId]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (appId) {
          const res = await getAppStats(Number(appId));
          setStats(res.data);
          console.log(stats)
        }
      } catch (err) {
        console.warn('❌ Erreur chargement stats:', err);
      }
    };
    fetchStats();
  }, [appId]);

  return (
      <AppLayout title={`Endpoints for ${appName}`}>
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
                <div className="text-2xl font-bold text-gray-900">{stats?.endpoints ?? endpoints.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats?.success_rate.toFixed(1)}%</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Avg Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats?.avg_response_time.toFixed(2)}s</div>
              </CardContent>
            </Card>
          </div>

          {/* Endpoints List */}
          <div className="space-y-4">
            {loading ? (
                <div>Loading...</div>
            ) : (
                endpoints.map((endpoint) => (
                    <Card key={endpoint.id} className="hover:shadow-md transition-shadow duration-200">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <Badge className={getMethodColor(endpoint.method)}>{endpoint.method}</Badge>
                              <CardTitle className="text-lg">{endpoint.name}</CardTitle>
                              {getStatusIcon(endpoint.status)}
                            </div>
                            <CardDescription className="text-sm font-mono bg-gray-50 px-2 py-1 rounded">
                              {endpoint.url}
                            </CardDescription>
                            <p className="text-sm text-gray-600 mt-2">{endpoint.description || '-'}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-6 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{stats?.avg_response_time.toFixed(2)|| '-'}</span>
                            </div>
                            <span>Last tested: </span>
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
                ))
            )}
          </div>
        </div>
      </AppLayout>
  );
};

export default ApplicationEndpoints;