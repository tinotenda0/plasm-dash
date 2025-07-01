'use client';

import React from 'react';
import { LineChart, BarChart, DoughnutChart } from './charts';

interface PerformanceChartProps {
  type: 'line' | 'bar' | 'doughnut';
  data: any;
  options?: any;
  className?: string;
  height?: number;
}

export function PerformanceChart({ type, data, options = {}, className, height = 300 }: PerformanceChartProps) {
  const renderChart = () => {
    switch (type) {
      case 'line':
        return <LineChart data={data} options={options} height={height} />;
      case 'bar':
        return <BarChart data={data} options={options} height={height} />;
      case 'doughnut':
        return <DoughnutChart data={data} options={options} height={height} />;
      default:
        return <LineChart data={data} options={options} height={height} />;
    }
  };

  return (
    <div className={className}>
      {renderChart()}
    </div>
  );
}

// Analytics Charts Collection
export function AnalyticsCharts() {
  // Generate realistic chart data
  const generateWeeklyData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return {
      labels: days,
      datasets: [
        {
          label: 'Page Views',
          data: [1200, 1900, 1500, 2200, 1800, 900, 1100],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
        },
        {
          label: 'Unique Visitors',
          data: [800, 1200, 950, 1400, 1100, 600, 750],
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
        },
      ],
    };
  };

  const generateCategoryData = () => {
    return {
      labels: ['Tutorials', 'Reviews', 'News', 'Guides', 'Opinion'],
      datasets: [
        {
          label: 'Posts Count',
          data: [12, 8, 5, 15, 6],
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(139, 92, 246, 0.8)',
            'rgba(239, 68, 68, 0.8)',
          ],
          borderColor: [
            'rgb(59, 130, 246)',
            'rgb(16, 185, 129)',
            'rgb(245, 158, 11)',
            'rgb(139, 92, 246)',
            'rgb(239, 68, 68)',
          ],
          borderWidth: 2,
        },
      ],
    };
  };

  const generateTrafficSourceData = () => {
    return {
      labels: ['Direct', 'Search', 'Social', 'Referral', 'Email'],
      datasets: [
        {
          data: [35, 28, 20, 12, 5],
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(139, 92, 246, 0.8)',
            'rgba(239, 68, 68, 0.8)',
          ],
          borderColor: [
            'rgb(59, 130, 246)',
            'rgb(16, 185, 129)',
            'rgb(245, 158, 11)',
            'rgb(139, 92, 246)',
            'rgb(239, 68, 68)',
          ],
          borderWidth: 2,
        },
      ],
    };
  };

  const generateMonthlyTrendData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return {
      labels: months,
      datasets: [
        {
          label: 'Posts Published',
          data: [8, 12, 15, 18, 22, 25],
          backgroundColor: 'rgba(59, 130, 246, 0.6)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 2,
        },
        {
          label: 'Total Views (in thousands)',
          data: [15, 25, 35, 45, 60, 75],
          backgroundColor: 'rgba(16, 185, 129, 0.6)',
          borderColor: 'rgb(16, 185, 129)',
          borderWidth: 2,
        },
      ],
    };
  };

  return (
    <div className="space-y-8">
      {/* Weekly Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Performance</h3>
          <div className="h-64">
            <PerformanceChart
              type="line"
              data={generateWeeklyData()}
              options={{
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h3>
          <div className="h-64">
            <PerformanceChart
              type="doughnut"
              data={generateTrafficSourceData()}
              options={{
                plugins: {
                  legend: {
                    position: 'right' as const,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Growth Trends</h3>
        <div className="h-80">
          <PerformanceChart
            type="bar"
            data={generateMonthlyTrendData()}
            options={{
              plugins: {
                legend: {
                  position: 'top' as const,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                  },
                },
                x: {
                  grid: {
                    display: false,
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {/* Content Categories */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Distribution by Category</h3>
        <div className="h-64">
          <PerformanceChart
            type="bar"
            data={generateCategoryData()}
            options={{
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Number of Posts',
                  },
                },
                x: {
                  title: {
                    display: true,
                    text: 'Categories',
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
