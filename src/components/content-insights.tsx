'use client';

import { useState, useEffect } from 'react';
import { 
  Target, 
  Clock, 
  Calendar, 
  TrendingUp, 
  BookOpen, 
  MessageCircle,
  Share2,
  ThumbsUp,
  Users,
  Zap
} from 'lucide-react';
import { LazyLoad } from './lazy-load';

interface ContentInsight {
  id: string;
  type: 'optimization' | 'trend' | 'opportunity' | 'alert';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  data?: {
    current: number;
    target: number;
    unit: string;
  };
}

interface ContentPerformanceGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
  status: 'on-track' | 'behind' | 'exceeded';
}

export function ContentInsights() {
  const [insights, setInsights] = useState<ContentInsight[]>([]);
  const [goals, setGoals] = useState<ContentPerformanceGoal[]>([]);
  const [loading, setLoading] = useState(true);

  const generateInsights = (): ContentInsight[] => {
    return [
      {
        id: '1',
        type: 'optimization',
        title: 'Optimize posting schedule',
        description: 'Your audience is most active on Tuesday and Thursday afternoons. Consider scheduling more posts during these times.',
        impact: 'high',
        actionable: true,
        data: {
          current: 15,
          target: 35,
          unit: '% engagement rate'
        }
      },
      {
        id: '2',
        type: 'trend',
        title: 'Rising interest in TypeScript content',
        description: 'TypeScript-related posts show 40% higher engagement than average. Consider creating more TypeScript content.',
        impact: 'medium',
        actionable: true,
        data: {
          current: 140,
          target: 100,
          unit: '% of average engagement'
        }
      },
      {
        id: '3',
        type: 'opportunity',
        title: 'Long-form content performing well',
        description: 'Posts over 1,500 words have 60% longer average read time and higher engagement.',
        impact: 'high',
        actionable: true,
        data: {
          current: 850,
          target: 1500,
          unit: 'average words'
        }
      },
      {
        id: '4',
        type: 'alert',
        title: 'Decrease in mobile engagement',
        description: 'Mobile engagement has dropped 15% in the last month. Check mobile optimization and loading speeds.',
        impact: 'medium',
        actionable: true,
        data: {
          current: 65,
          target: 80,
          unit: '% mobile engagement'
        }
      }
    ];
  };

  const generateGoals = (): ContentPerformanceGoal[] => {
    return [
      {
        id: '1',
        title: 'Monthly Page Views',
        target: 50000,
        current: 42500,
        unit: 'views',
        deadline: '2025-07-31',
        status: 'on-track'
      },
      {
        id: '2',
        title: 'Average Read Time',
        target: 4.5,
        current: 3.8,
        unit: 'minutes',
        deadline: '2025-08-15',
        status: 'behind'
      },
      {
        id: '3',
        title: 'Email Subscriptions',
        target: 1000,
        current: 1150,
        unit: 'subscribers',
        deadline: '2025-07-15',
        status: 'exceeded'
      },
      {
        id: '4',
        title: 'Social Media Shares',
        target: 500,
        current: 380,
        unit: 'shares',
        deadline: '2025-07-31',
        status: 'behind'
      }
    ];
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setInsights(generateInsights());
      setGoals(generateGoals());
      setLoading(false);
    }, 1000);
  }, []);

  const getInsightIcon = (type: ContentInsight['type']) => {
    switch (type) {
      case 'optimization':
        return Target;
      case 'trend':
        return TrendingUp;
      case 'opportunity':
        return Zap;
      case 'alert':
        return MessageCircle;
      default:
        return BookOpen;
    }
  };

  const getInsightColor = (type: ContentInsight['type']) => {
    switch (type) {
      case 'optimization':
        return 'blue';
      case 'trend':
        return 'green';
      case 'opportunity':
        return 'purple';
      case 'alert':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getGoalStatusColor = (status: ContentPerformanceGoal['status']) => {
    switch (status) {
      case 'on-track':
        return 'blue';
      case 'behind':
        return 'red';
      case 'exceeded':
        return 'green';
      default:
        return 'gray';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Content Insights */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Zap className="h-5 w-5 text-purple-600" />
          <h2 className="text-lg font-semibold text-gray-900">Content Insights</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {insights.map((insight) => {
            const Icon = getInsightIcon(insight.type);
            const color = getInsightColor(insight.type);
            
            return (
              <LazyLoad key={insight.id} threshold={0.1}>
                <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg bg-${color}-50`}>
                      <Icon className={`h-5 w-5 text-${color}-600`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          insight.impact === 'high' 
                            ? 'bg-red-100 text-red-700'
                            : insight.impact === 'medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {insight.impact} impact
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4">{insight.description}</p>
                      
                      {insight.data && (
                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Current</span>
                            <span className="font-medium">{insight.data.current} {insight.data.unit}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm mt-1">
                            <span className="text-gray-600">Target</span>
                            <span className="font-medium">{insight.data.target} {insight.data.unit}</span>
                          </div>
                        </div>
                      )}
                      
                      {insight.actionable && (
                        <button className={`text-sm font-medium text-${color}-600 hover:text-${color}-700`}>
                          View recommendations →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </LazyLoad>
            );
          })}
        </div>
      </div>

      {/* Performance Goals */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Target className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Performance Goals</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal) => {
            const progress = (goal.current / goal.target) * 100;
            const color = getGoalStatusColor(goal.status);
            
            return (
              <LazyLoad key={goal.id} threshold={0.1}>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full bg-${color}-100 text-${color}-700`}>
                      {goal.status.replace('-', ' ')}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">
                        {goal.current.toLocaleString()} / {goal.target.toLocaleString()} {goal.unit}
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full bg-${color}-500 transition-all duration-300`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{Math.round(progress)}% complete</span>
                      <span>Due {new Date(goal.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </LazyLoad>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Recommended Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors text-left">
            <Clock className="h-5 w-5 text-blue-600 mb-2" />
            <h3 className="font-medium text-blue-900 mb-1">Schedule optimal posts</h3>
            <p className="text-sm text-blue-700">Auto-schedule for peak engagement times</p>
          </button>
          
          <button className="p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors text-left">
            <TrendingUp className="h-5 w-5 text-green-600 mb-2" />
            <h3 className="font-medium text-green-900 mb-1">Create trending content</h3>
            <p className="text-sm text-green-700">Generate ideas based on current trends</p>
          </button>
          
          <button className="p-4 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors text-left">
            <Users className="h-5 w-5 text-purple-600 mb-2" />
            <h3 className="font-medium text-purple-900 mb-1">Analyze audience</h3>
            <p className="text-sm text-purple-700">Deep dive into reader preferences</p>
          </button>
        </div>
      </div>
    </div>
  );
}
