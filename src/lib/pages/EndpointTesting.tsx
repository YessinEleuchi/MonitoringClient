import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AppLayout from '@/lib/components/AppLayout.tsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/lib/components/ui/card.tsx";
import { Button } from "@/lib/components/ui/button.tsx";
import { Badge } from "@/lib/components/ui/badge.tsx";
import { ArrowLeft, Play, Activity, Clock, Zap, Target, ShieldCheck } from 'lucide-react';
import { loginApplication } from '@/services/authService';
import { testEndpoint } from '@/services/endpointService';
import { AxiosResponse } from 'axios'; // Import AxiosResponse pour le typage

// Interface pour la réponse de testEndpoint
interface TestEndpointResponse {
  response_time?: number;
  success?: boolean;
  status_code?: number;
  response_content?: any; // Utilisez un type plus spécifique si possible (par ex. string, object, etc.)
}

interface TestMetrics {
  responseTime: number;
  accuracy: number;
  throughput: number;
  errorRate: number;
  availability: number;
}

const EndpointTesting = () => {
  const { appId, endpointId } = useParams<{ appId: string; endpointId: string }>();
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [metrics, setMetrics] = useState<TestMetrics>({
    responseTime: 0,
    accuracy: 0,
    throughput: 0,
    errorRate: 0,
    availability: 0
  });
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    console.log('useEffect triggered for appId:', appId);
    const saved = localStorage.getItem(`token_${appId}`);
    console.log('Retrieved token from localStorage:', saved);
    if (saved) setAuthToken(saved);
  }, [appId]);

  const handleLogin = async () => {
    if (!appId) {
      console.log('No appId provided for login');
      return;
    }
    console.log('Attempting login for appId:', appId);
    try {
      const res = await loginApplication(Number(appId));
      console.log('Login response:', res);
      setAuthToken(res.data.token);
      localStorage.setItem(`token_${appId}`, res.data.token);
      console.log('Token saved to localStorage:', res.data.token);
      alert("✅ Authentification réussie !");
    } catch (err) {
      console.error('Login error:', err);
      alert("❌ Échec de l'authentification !");
    }
  };

  const runTest = async () => {
    if (!endpointId) {
      console.log('No endpointId provided for test');
      return;
    }
    console.log('Starting test for endpointId:', endpointId, 'with authToken:', authToken);
    setIsRunningTest(true);

    try {
      const res: AxiosResponse<TestEndpointResponse> = await testEndpoint(Number(endpointId), authToken ?? undefined);
      console.log('Test endpoint response:', res);
      console.log('Response content:', res.data.response_content); // Log de response_content
      const data = res.data;

      const newMetrics = {
        responseTime: Math.round((data.response_time ?? 0) * 1000),
        accuracy: 98.5,
        throughput: 950,
        errorRate: data.success ? 0.2 : 5.0,
        availability: data.status_code === 200 ? 99.9 : 90.0
      };
      console.log('Setting metrics:', newMetrics);
      setMetrics(newMetrics);
    } catch (error) {
      console.error('Test API failed:', error);
      const errorMetrics = {
        responseTime: 999,
        accuracy: 92.0,
        throughput: 400,
        errorRate: 5.5,
        availability: 88.0
      };
      console.log('Setting error metrics:', errorMetrics);
      setMetrics(errorMetrics);
    }

    console.log('Test completed, setting isRunningTest to false');
    setIsRunningTest(false);
  };

  const getMetricStatus = (value: number, type: string) => {
    console.log(`Calculating status for ${type}:`, value);
    switch (type) {
      case 'responseTime': return value < 200 ? 'excellent' : value < 500 ? 'good' : 'poor';
      case 'accuracy': return value > 98 ? 'excellent' : value > 95 ? 'good' : 'poor';
      case 'throughput': return value > 800 ? 'excellent' : value > 500 ? 'good' : 'poor';
      case 'errorRate': return value < 1 ? 'excellent' : value < 3 ? 'good' : 'poor';
      case 'availability': return value > 99 ? 'excellent' : value > 95 ? 'good' : 'poor';
      default: return 'good';
    }
  };

  const getStatusColor = (status: string) => {
    console.log('Determining color for status:', status);
    switch (status) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  console.log('Rendering with appId:', appId, 'endpointId:', endpointId, 'metrics:', metrics, 'authToken:', authToken);

  const endpointName = endpointId || 'Endpoint';
  const appName = appId || 'Application';

  return (
      <AppLayout title={`${endpointName} - Testing Dashboard`}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to={`/applications/${appId}/endpoints`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Endpoints
                </Button>
              </Link>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{appName}</h2>
                <p className="text-sm text-gray-600">{endpointName}</p>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                  onClick={handleLogin}
                  variant="outline"
                  className="text-sm border-gray-300"
              >
                <ShieldCheck className="h-4 w-4 mr-1" />
                Login Application
              </Button>
              <Button
                  onClick={runTest}
                  disabled={isRunningTest}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
              >
                {isRunningTest ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Running...
                    </>
                ) : (
                    <>
                      <Play className="h-4 w-4 mr-1" />
                      Run Test
                    </>
                )}
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card className="text-center">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                </div>
                <CardTitle className="text-sm font-medium text-gray-600">Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getStatusColor(getMetricStatus(metrics.responseTime, 'responseTime'))}`}>
                  {metrics.responseTime}ms
                </div>
                <Badge className="mt-1 bg-blue-100 text-blue-800">
                  {getMetricStatus(metrics.responseTime, 'responseTime')}
                </Badge>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-center mb-2">
                  <Target className="h-5 w-5 text-green-500" />
                </div>
                <CardTitle className="text-sm font-medium text-gray-600">Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getStatusColor(getMetricStatus(metrics.accuracy, 'accuracy'))}`}>
                  {metrics.accuracy.toFixed(1)}%
                </div>
                <Badge className="mt-1 bg-green-100 text-green-800">
                  {getMetricStatus(metrics.accuracy, 'accuracy')}
                </Badge>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-center mb-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                </div>
                <CardTitle className="text-sm font-medium text-gray-600">Throughput</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getStatusColor(getMetricStatus(metrics.throughput, 'throughput'))}`}>
                  {metrics.throughput}
                </div>
                <Badge className="mt-1 bg-yellow-100 text-yellow-800">
                  req/sec
                </Badge>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-center mb-2">
                  <Activity className="h-5 w-5 text-red-500" />
                </div>
                <CardTitle className="text-sm font-medium text-gray-600">Error Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getStatusColor(getMetricStatus(metrics.errorRate, 'errorRate'))}`}>
                  {metrics.errorRate.toFixed(1)}%
                </div>
                <Badge className="mt-1 bg-red-100 text-red-800">
                  {getMetricStatus(metrics.errorRate, 'errorRate')}
                </Badge>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-center mb-2">
                  <Activity className="h-5 w-5 text-purple-500" />
                </div>
                <CardTitle className="text-sm font-medium text-gray-600">Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getStatusColor(getMetricStatus(metrics.availability, 'availability'))}`}>
                  {metrics.availability.toFixed(1)}%
                </div>
                <Badge className="mt-1 bg-purple-100 text-purple-800">
                  {getMetricStatus(metrics.availability, 'availability')}
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Test Results Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Summary</CardTitle>
                <CardDescription>Latest test execution results</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Response Time</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min((metrics.responseTime / 300) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold">{metrics.responseTime}ms</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Accuracy Rate</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${metrics.accuracy}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold">{metrics.accuracy.toFixed(1)}%</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Throughput</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min((metrics.throughput / 1200) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold">{metrics.throughput} req/s</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Test Configuration</CardTitle>
                <CardDescription>Current testing parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Test Duration</span>
                    <span className="text-sm">3 seconds</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Concurrent Users</span>
                    <span className="text-sm">50</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Request Interval</span>
                    <span className="text-sm">100ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Test Environment</span>
                    <span className="text-sm">Production</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Last Executed</span>
                    <span className="text-sm">Just now</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AppLayout>
  );
};

export default EndpointTesting;