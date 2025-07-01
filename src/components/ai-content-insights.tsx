'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Target, Lightbulb, AlertCircle, CheckCircle, Calendar, Users, Eye } from 'lucide-react';
import { LineChart, BarChart } from './charts';

interface ContentRecommendation {
  type: 'optimization' | 'timing' | 'topic' | 'engagement';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actionItems: string[];
  expectedImpact: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface PerformanceGoal {
  id: string;
  title: string;
  current: number;
  target: number;
  unit: string;
  progress: number;
  status: 'on-track' | 'behind' | 'exceeded';
  deadline: string;
}

export function AIContentInsights() {
  const [recommendations, setRecommendations] = useState<ContentRecommendation[]>([]);
  const [goals, setGoals] = useState<PerformanceGoal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate AI analysis
    setTimeout(() => {
      setRecommendations([
        {
          type: 'optimization',
          priority: 'high',
          title: 'Optimize Headlines for Better CTR',
          description: 'Your tutorials category shows 23% lower click-through rates compared to industry average.',
          actionItems: [
            'Use numbers in headlines (e.g., "5 Ways to...")',
            'Include power words like "Ultimate", "Complete", "Essential"',
            'Keep headlines between 50-60 characters',
            'Test A/B variations for top-performing posts'
          ],
          expectedImpact: '+15% CTR improvement',
          icon: TrendingUp
        },
        {
          type: 'timing',
          priority: 'medium',
          title: 'Optimal Publishing Schedule',
          description: 'Data shows your audience is most active on Tuesday and Thursday mornings.',
          actionItems: [
            'Schedule posts for Tuesday 9 AM PST',
            'Consider Thursday 11 AM as secondary slot',
            'Avoid weekend publishing for technical content',
            'Test social media promotion timing'
          ],
          expectedImpact: '+25% initial engagement',
          icon: Calendar
        },
        {
          type: 'topic',
          priority: 'high',
          title: 'Content Gap Analysis',
          description: 'High search volume for "React Server Components" with low competition.',
          actionItems: [
            'Create comprehensive guide on React Server Components',
            'Include practical examples and use cases',
            'Cover migration strategies from client components',
            'Address common performance pitfalls'
          ],
          expectedImpact: '+40% organic traffic potential',
          icon: Lightbulb
        },
        {
          type: 'engagement',
          priority: 'medium',
          title: 'Improve Reader Retention',
          description: 'Average session duration decreased by 12% in the last month.',
          actionItems: [
            'Add interactive code examples',
            'Include table of contents for long posts',
            'Use more visual elements and diagrams',
            'Add related posts suggestions'
          ],
          expectedImpact: '+20% session duration',
          icon: Users
        }
      ]);

      setGoals([
        {
          id: '1',
          title: 'Monthly Page Views',
          current: 45680,
          target: 60000,
          unit: 'views',
          progress: 76,
          status: 'on-track',
          deadline: '2024-07-31'
        },
        {
          id: '2',
          title: 'Engagement Rate',
          current: 18.5,
          target: 25,
          unit: '%',
          progress: 74,
          status: 'behind',
          deadline: '2024-07-31'
        },
        {
          id: '3',
          title: 'Email Subscribers',
          current: 2340,
          target: 3000,
          unit: 'subscribers',
          progress: 78,
          status: 'on-track',
          deadline: '2024-08-15'
        },
        {
          id: '4',
          title: 'Average Read Time',
          current: 3.2,
          target: 4.0,
          unit: 'minutes',
          progress: 80,
          status: 'exceeded',
          deadline: '2024-07-15'
        }
      ]);

      setLoading(false);
    }, 1500);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'text-blue-600';
      case 'behind': return 'text-red-600';
      case 'exceeded': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-track': return Target;
      case 'behind': return AlertCircle;
      case 'exceeded': return CheckCircle;
      default: return Target;
    }
  };

  // Chart data for content performance trends
  const contentTrendData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Content Quality Score',
        data: [7.2, 7.8, 8.1, 8.4],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Engagement Rate',
        data: [16.5, 18.2, 19.1, 21.3],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const topicOpportunityData = {
    labels: ['React', 'Next.js', 'TypeScript', 'Tailwind', 'Node.js'],
    datasets: [{
      label: 'Opportunity Score',
      data: [85, 92, 78, 88, 75],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ],
      borderWidth: 0
    }]
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Content Insights</h2>
        <p className="text-gray-600">Get personalized recommendations to optimize your content strategy</p>
      </div>

      {/* Performance Goals */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Performance Goals</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {goals.map((goal) => {
              const StatusIcon = getStatusIcon(goal.status);
              return (
                <div key={goal.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">{goal.title}</h4>
                    <StatusIcon className={`h-4 w-4 ${getStatusColor(goal.status)}`} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{goal.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          goal.status === 'exceeded' ? 'bg-green-500' :
                          goal.status === 'on-track' ? 'bg-blue-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(goal.progress, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{goal.current.toLocaleString()} {goal.unit}</span>
                      <span>{goal.target.toLocaleString()} {goal.unit}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {recommendations.map((rec, index) => {
          const Icon = rec.icon;
          return (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Icon className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(rec.priority)}`}>
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{rec.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <h4 className="text-sm font-medium text-gray-900">Action Items:</h4>
                    <ul className="space-y-1">
                      {rec.actionItems.map((item, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">{rec.expectedImpact}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Performance Trend</h3>
          <LineChart data={contentTrendData} height={250} />
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Topic Opportunity Analysis</h3>
          <BarChart data={topicOpportunityData} height={250} />
        </div>
      </div>

      {/* Content Optimization Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Lightbulb className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Optimization Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <h4 className="font-medium mb-1">SEO Optimization</h4>
                <ul className="space-y-1">
                  <li>• Use long-tail keywords in titles</li>
                  <li>• Optimize meta descriptions</li>
                  <li>• Add internal linking</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-1">Engagement Boost</h4>
                <ul className="space-y-1">
                  <li>• Add interactive elements</li>
                  <li>• Include call-to-actions</li>
                  <li>• Use compelling visuals</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-1">Performance</h4>
                <ul className="space-y-1">
                  <li>• Optimize images for web</li>
                  <li>• Reduce loading times</li>
                  <li>• Use structured data</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-1">User Experience</h4>
                <ul className="space-y-1">
                  <li>• Improve readability score</li>
                  <li>• Add table of contents</li>
                  <li>• Ensure mobile responsiveness</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
