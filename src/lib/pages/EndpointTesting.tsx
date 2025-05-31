
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AppLayout from '@/lib/components/AppLayout.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/components/ui/card.tsx";
import { Button } from "@/lib/components/ui/button.tsx";
import { Badge } from "@/lib/components/ui/badge.tsx";
import { ArrowLeft, Play, Activity, Clock, Zap, Target } from 'lucide-react';

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

  const endpointNames: { [key: string]: string } = {
    'create-payment': 'Create Payment',
    'get-payment': 'Get Payment Status',
    'refund-payment': 'Process Refund',
    'user-auth': 'User Authentication',
    'user-profile': 'Get User Profile'
  };

  const appNames: { [key: string]: string } = {
    'payment-api': 'Payment Gateway API',
    'user-service': 'User Management Service'
  };

  const endpointName = endpointNames[endpointId || ''] || 'Unknown Endpoint';
  const appName = appNames[appId || ''] || 'Unknown Application';

  const runTest = async () => {
    setIsRunningTest(true);
    
    // Simulate test execution with progressive updates
    const testDuration = 3000;
    const updateInterval = 100;
    const steps = testDuration / updateInterval;
    
    for (let i = 0; i <= steps; i++) {
      const progress = i / steps;
      
      setMetrics({
        responseTime: Math.round(120 + Math.random() * 80 + progress * 50),
        accuracy: Math.min(95 + progress * 5, 99.8),
        throughput: Math.round(800 + progress * 200 + Math.random() * 100),
        errorRate: Math.max(2 - progress * 1.8, 0.1),
        availability: Math.min(98 + progress * 2, 99.9)
      });
      
      await new Promise(resolve => setTimeout(resolve, updateInterval));
    }
    
    setIsRunningTest(false);
  };

  useEffect(() => {
    // Load initial metrics
    setMetrics({
      responseTime: 145,
      accuracy: 98.5,
      throughput: 950,
      errorRate: 0.3,
      availability: 99.7
    });
  }, []);

  const getMetricStatus = (value: number, type: string) => {
    switch (type) {
      case 'responseTime':
        return value < 200 ? 'excellent' : value < 500 ? 'good' : 'poor';
      case 'accuracy':
        return value > 98 ? 'excellent' : value > 95 ? 'good' : 'poor';
      case 'throughput':
        return value > 800 ? 'excellent' : value > 500 ? 'good' : 'poor';
      case 'errorRate':
        return value < 1 ? 'excellent' : value < 3 ? 'good' : 'poor';
      case 'availability':
        return value > 99 ? 'excellent' : value > 95 ? 'good' : 'poor';
      default:
        return 'good';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'text-green-600';
      case 'good':
        return 'text-blue-600';
      case 'poor':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

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
          
          <Button 
            onClick={runTest} 
            disabled={isRunningTest}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isRunningTest ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Running Test...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Run Performance Test
              </>
            )}
          </Button>
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
