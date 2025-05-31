import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '@/lib/components/AppLayout.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/lib/components/ui/card.tsx';
import { Button } from '@/lib/components/ui/button.tsx';
import { Badge } from '@/lib/components/ui/badge.tsx';
import { Server, Activity, Database, ArrowRight } from 'lucide-react';
import { listApplications, getAllStats } from '@/services/applicationService.ts';
import {Application , ApplicationStats} from "@/services/applicationService.ts";
import { loginApplication } from '@/services/authService';


const handleLogin = async (appId: number) => {
  try {
    const res = await loginApplication(appId);
    console.log(`🔐 Token pour application ${appId}:`, res.data.token);
    alert(`✅ Authentification réussie pour ${appId}`);
    // Optionnel : localStorage.setItem(`token_${appId}`, res.data.token);
  } catch (error) {
    console.error("❌ Échec de l'authentification :", error);
    alert(`❌ Échec de l'authentification pour ${appId}`);
  }
};

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

const Dashboard: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<{
    total_applications: number;
    total_endpoints: number;
    applications: ApplicationStats[];
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les données avec useEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [apps, statsData] = await Promise.all([listApplications(), getAllStats()]);

        setApplications(apps.data);
        setStats(statsData.data);
      } catch (err) {
        setError('Erreur lors du chargement des données');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculs pour les statistiques
  const activeApps = applications.filter((app) => app.status === 'active').length;
  const systemHealth = stats?.applications.every((stat) => stat.success_rate > 0)
      ? 'Healthy'
      : 'Issues Detected';

  // Rendu conditionnel
  if (loading) return <AppLayout title="Application Hub"><div>Chargement...</div></AppLayout>;
  if (error) return <AppLayout title="Application Hub"><div>{error}</div></AppLayout>;

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
                <div className="text-2xl font-bold text-gray-900">{stats?.total_applications ?? 0}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {activeApps} active, {applications.length - activeApps} inactive
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Endpoints</CardTitle>
                <Activity className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stats?.total_endpoints ?? 0}</div>
                <p className="text-xs text-gray-500 mt-1">Across all applications</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">System Health</CardTitle>
                <Database className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div
                    className={`text-2xl font-bold ${
                        systemHealth === 'Healthy' ? 'text-green-600' : 'text-red-600'
                    }`}
                >
                  {systemHealth}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {systemHealth === 'Healthy' ? 'All systems operational' : 'Check application stats'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Applications Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {applications.map((app) => {
              const appStats = stats?.applications.find((stat) => stat.app_id === app.id);
              return (
                  <Card key={app.id} className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <Server className="h-6 w-6 text-blue-600" /> {/* Icône par défaut */}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{app.name}</CardTitle>
                            <CardDescription className="text-sm mt-1">
                              {app.description || 'No description available'}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge className={getStatusColor(app.status)}>{app.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>{appStats?.endpoints ?? 0} endpoints</span>
                          <span>Last check: {appStats?.last_health_check ?? 'No data'}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Link to={`/applications/${app.id}/endpoints`} className="flex-1">
                            <Button className="w-full px-2 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white">
                              View Endpoints
                              <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                          </Link>
                          <div className="flex-1">
                            <Button
                                variant="outline"
                                className="w-full px-2 py-1 text-sm"
                                onClick={() => handleLogin(app.id)}
                            >
                              Login
                            </Button>
                          </div>
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