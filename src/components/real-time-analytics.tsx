'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Users, Eye, Clock, Star } from 'lucide-react';
import { LazyLoad } from './lazy-load';
import { LineChart } from './charts';

interface AnalyticsMetric {
  label: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

interface PerformanceData {
  metrics: AnalyticsMetric[];      chartData: {
        labels: string[];
        datasets: {
          label: string;
          data: number[];
          borderColor: string;
          backgroundColor: string;
          fill?: boolean;
          tension?: number;
        }[];
      };
  topPosts: {
    id: string;
    title: string;
    views: number;
    engagement: number;
    publishedAt: string;
  }[];
}

export function RealTimeAnalytics() {
  const [data, setData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Simulate real-time data updates
  const generateMockData = (): PerformanceData => {
    const now = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - (6 - i));
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    });

    return {
      metrics: [
        {
          label: 'Total Views',
          value: Math.floor(Math.random() * 10000) + 15000,
          change: Math.floor(Math.random() * 30) - 15,
          changeType: Math.random() > 0.5 ? 'increase' : 'decrease',
          icon: Eye,
          description: 'Page views in the last 7 days'
        },
        {
          label: 'Unique Visitors',
          value: Math.floor(Math.random() * 3000) + 5000,
          change: Math.floor(Math.random() * 25) - 10,
          changeType: Math.random() > 0.6 ? 'increase' : 'decrease',
          icon: Users,
          description: 'Unique visitors in the last 7 days'
        },
        {
          label: 'Avg. Read Time',
          value: `${Math.floor(Math.random() * 3) + 2}m ${Math.floor(Math.random() * 60)}s`,
          change: Math.floor(Math.random() * 20) - 10,
          changeType: Math.random() > 0.4 ? 'increase' : 'decrease',
          icon: Clock,
          description: 'Average time spent reading posts'
        },
        {
          label: 'Engagement Rate',
          value: `${(Math.random() * 10 + 15).toFixed(1)}%`,
          change: Math.floor(Math.random() * 15) - 5,
          changeType: Math.random() > 0.5 ? 'increase' : 'decrease',
          icon: Star,
          description: 'Comments, shares, and interactions'
        }
      ],
      chartData: {
        labels: last7Days,
        datasets: [
          {
            label: 'Views',
            data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 1000) + 500),
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.4
          },
          {
            label: 'Visitors',
            data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 300) + 150),
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.4
          }
        ]
      },
      topPosts: [
        {
          id: '1',
          title: 'Getting Started with Next.js 15',
          views: Math.floor(Math.random() * 2000) + 1000,
          engagement: Math.floor(Math.random() * 50) + 20,
          publishedAt: '2025-06-15'
        },
        {
          id: '2',
          title: 'TypeScript Best Practices',
          views: Math.floor(Math.random() * 1500) + 800,
          engagement: Math.floor(Math.random() * 40) + 15,
          publishedAt: '2025-06-10'
        },
        {
          id: '3',
          title: 'Building Responsive UIs with Tailwind CSS',
          views: Math.floor(Math.random() * 1200) + 600,
          engagement: Math.floor(Math.random() * 35) + 10,
          publishedAt: '2025-06-05'
        }
      ]
    };
  };

  useEffect(() => {
    // Initial load
    const loadData = () => {
      setLoading(true);
      // Simulate API delay
      setTimeout(() => {
        setData(generateMockData());
        setLastUpdated(new Date());
        setLoading(false);
      }, 1000);
    };

    loadData();

    // Update every 30 seconds
    const interval = setInterval(() => {
      setData(generateMockData());
      setLastUpdated(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Real-Time Analytics</h2>
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Real-Time Analytics</h2>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
          Last updated {lastUpdated.toLocaleTimeString()}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.metrics.map((metric, index) => (
          <LazyLoad key={metric.label} threshold={0.1}>
            <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <metric.icon className="h-5 w-5 text-blue-600" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  metric.changeType === 'increase' 
                    ? 'text-green-600' 
                    : metric.changeType === 'decrease'
                    ? 'text-red-600'
                    : 'text-gray-600'
                }`}>
                  {metric.changeType === 'increase' ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : metric.changeType === 'decrease' ? (
                    <TrendingDown className="h-4 w-4" />
                  ) : null}
                  {Math.abs(metric.change)}%
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                {metric.description && (
                  <p className="text-xs text-gray-500">{metric.description}</p>
                )}
              </div>
            </div>
          </LazyLoad>
        ))}
      </div>

      {/* Chart Section */}
      <LazyLoad threshold={0.1}>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Performance Trend</h3>
          <LineChart 
            data={data.chartData} 
            height={280}
            options={{
              plugins: {
                legend: {
                  position: 'top',
                  align: 'end',
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: function(value) {
                      return typeof value === 'number' ? value.toLocaleString() : value;
                    }
                  }
                }
              }
            }}
          />
        </div>
      </LazyLoad>

      {/* Top Posts */}
      <LazyLoad threshold={0.1}>
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Top Performing Posts</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {data.topPosts.map((post, index) => (
              <div key={post.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-sm font-medium ${
                        index === 0 
                          ? 'bg-yellow-100 text-yellow-800'
                          : index === 1
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {index + 1}
                      </span>
                      <h4 className="font-medium text-gray-900">{post.title}</h4>
                    </div>
                    <p className="text-sm text-gray-500">
                      Published {new Date(post.publishedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <p className="font-semibold text-gray-900">{post.views.toLocaleString()}</p>
                      <p className="text-gray-500">Views</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-gray-900">{post.engagement}%</p>
                      <p className="text-gray-500">Engagement</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </LazyLoad>
    </div>
  );
}
