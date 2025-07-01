'use client';

import { useState } from 'react';
import { Download, FileText, Table, Calendar, Filter, TrendingUp } from 'lucide-react';
import { BarChart, LineChart, DoughnutChart } from './charts';

interface ReportData {
  summary: {
    totalPosts: number;
    totalViews: number;
    totalEngagement: number;
    averageReadTime: string;
    topCategory: string;
    publishingConsistency: number;
  };
  chartData: {
    monthly: any;
    categories: any;
    engagement: any;
  };
  detailedMetrics: {
    posts: Array<{
      title: string;
      publishedAt: string;
      views: number;
      engagementRate: number;
      readTime: string;
      category: string;
    }>;
    categories: Array<{
      name: string;
      postCount: number;
      avgViews: number;
      avgEngagement: number;
    }>;
  };
}

export function ExportableReports() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'csv' | 'json'>('pdf');
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock data - in real app, this would come from API
  const reportData: ReportData = {
    summary: {
      totalPosts: 28,
      totalViews: 45680,
      totalEngagement: 2340,
      averageReadTime: '3m 45s',
      topCategory: 'Tutorials',
      publishingConsistency: 85
    },
    chartData: {
      monthly: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Posts Published',
          data: [4, 6, 8, 5, 7, 9],
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 1
        }]
      },
      categories: {
        labels: ['Tutorials', 'Reviews', 'News', 'Guides', 'Opinion'],
        datasets: [{
          data: [35, 20, 15, 20, 10],
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(139, 92, 246, 0.8)'
          ],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      engagement: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
          label: 'Engagement Rate (%)',
          data: [18.5, 22.1, 19.8, 25.3],
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.4
        }]
      }
    },
    detailedMetrics: {
      posts: [
        {
          title: 'Getting Started with Next.js 15',
          publishedAt: '2024-06-15',
          views: 2845,
          engagementRate: 24.5,
          readTime: '4m 30s',
          category: 'Tutorials'
        },
        {
          title: 'TypeScript Advanced Patterns',
          publishedAt: '2024-06-10',
          views: 1923,
          engagementRate: 19.2,
          readTime: '6m 15s',
          category: 'Guides'
        },
        {
          title: 'React 19 New Features Review',
          publishedAt: '2024-06-05',
          views: 3156,
          engagementRate: 28.7,
          readTime: '3m 45s',
          category: 'Reviews'
        }
      ],
      categories: [
        { name: 'Tutorials', postCount: 12, avgViews: 2150, avgEngagement: 22.3 },
        { name: 'Reviews', postCount: 8, avgViews: 1890, avgEngagement: 18.5 },
        { name: 'Guides', postCount: 6, avgViews: 2340, avgEngagement: 25.1 },
        { name: 'News', postCount: 4, avgViews: 1650, avgEngagement: 16.8 }
      ]
    }
  };

  const handleExport = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (selectedFormat === 'csv') {
        // Generate CSV
        const csvContent = generateCSV(reportData);
        downloadFile(csvContent, `blog-report-${selectedPeriod}.csv`, 'text/csv');
      } else if (selectedFormat === 'json') {
        // Generate JSON
        const jsonContent = JSON.stringify(reportData, null, 2);
        downloadFile(jsonContent, `blog-report-${selectedPeriod}.json`, 'application/json');
      } else {
        // For PDF, we would use a library like jsPDF
        // For now, we'll simulate it
        alert('PDF export functionality would be implemented with jsPDF library');
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateCSV = (data: ReportData) => {
    const headers = ['Title', 'Published Date', 'Views', 'Engagement Rate', 'Read Time', 'Category'];
    const rows = data.detailedMetrics.posts.map(post => [
      post.title,
      post.publishedAt,
      post.views.toString(),
      `${post.engagementRate}%`,
      post.readTime,
      post.category
    ]);
    
    return [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Export Controls */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Analytics Reports</h2>
            <p className="text-sm text-gray-600">Generate comprehensive reports for your blog performance</p>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
            
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pdf">PDF Report</option>
              <option value="csv">CSV Data</option>
              <option value="json">JSON Export</option>
            </select>
            
            <button
              onClick={handleExport}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Export Report
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">Total Posts</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{reportData.summary.totalPosts}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Total Views</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{reportData.summary.totalViews.toLocaleString()}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-600">Engagement</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{reportData.summary.totalEngagement}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Filter className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium text-gray-600">Avg Read Time</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{reportData.summary.averageReadTime}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Table className="h-4 w-4 text-red-600" />
            <span className="text-sm font-medium text-gray-600">Top Category</span>
          </div>
          <p className="text-lg font-bold text-gray-900">{reportData.summary.topCategory}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-indigo-600" />
            <span className="text-sm font-medium text-gray-600">Consistency</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{reportData.summary.publishingConsistency}%</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Publishing Trend</h3>
          <BarChart data={reportData.chartData.monthly} height={250} />
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Categories</h3>
          <DoughnutChart data={reportData.chartData.categories} height={250} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Trend</h3>
        <LineChart data={reportData.chartData.engagement} height={300} />
      </div>

      {/* Detailed Tables */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Top Performing Posts</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Published
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Engagement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Read Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reportData.detailedMetrics.posts.map((post, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{post.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Date unavailable'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{post.views.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{post.engagementRate}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{post.readTime}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {post.category}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
