'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Lightbulb, Target, Zap, BookOpen, Wand2, CheckCircle, AlertCircle } from 'lucide-react';

interface ContentSuggestion {
  id: string;
  type: 'headline' | 'structure' | 'seo' | 'engagement' | 'readability' | 'tone';
  title: string;
  description: string;
  suggestion: string;
  originalText?: string;
  improvedText?: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  category: string;
}

interface ContentAnalysis {
  score: number;
  readabilityGrade: string;
  wordCount: number;
  readingTime: string;
  seoScore: number;
  toneAnalysis: {
    sentiment: 'positive' | 'neutral' | 'negative';
    formality: 'formal' | 'casual' | 'mixed';
    confidence: number;
  };
  suggestions: ContentSuggestion[];
}

export function AIContentAssistant({ content = '', title = '' }: { content?: string; title?: string }) {
  const [analysis, setAnalysis] = useState<ContentAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'suggestions' | 'analysis' | 'templates'>('suggestions');

  const analyzeContent = () => {
    if (!content.trim() && !title.trim()) return;
    
    setLoading(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const wordCount = content.split(' ').filter(word => word.length > 0).length;
      const readingTime = Math.ceil(wordCount / 200); // Average reading speed
      
      const mockAnalysis: ContentAnalysis = {
        score: Math.floor(Math.random() * 30) + 70, // 70-100 range
        readabilityGrade: ['8th Grade', '9th Grade', '10th Grade', 'College Level'][Math.floor(Math.random() * 4)],
        wordCount,
        readingTime: `${readingTime} min read`,
        seoScore: Math.floor(Math.random() * 40) + 60, // 60-100 range
        toneAnalysis: {
          sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)] as any,
          formality: ['formal', 'casual', 'mixed'][Math.floor(Math.random() * 3)] as any,
          confidence: Math.floor(Math.random() * 20) + 80 // 80-100 range
        },
        suggestions: [
          {
            id: '1',
            type: 'headline',
            title: 'Improve Headline Impact',
            description: 'Your headline could be more compelling with numbers and power words',
            suggestion: 'Consider adding specific numbers or benefit-focused words like "Ultimate", "Complete", or "Essential"',
            originalText: title,
            improvedText: title.includes('Guide') ? 
              `The Complete Guide to ${title.replace('Guide to ', '').replace('A Guide to ', '')}: 5 Essential Tips` :
              `${title}: 7 Key Strategies for Success`,
            confidence: 85,
            impact: 'high',
            category: 'SEO & Engagement'
          },
          {
            id: '2',
            type: 'structure',
            title: 'Add Table of Contents',
            description: 'Long-form content benefits from clear navigation',
            suggestion: 'Add a table of contents at the beginning to improve user experience and SEO',
            confidence: 90,
            impact: 'medium',
            category: 'User Experience'
          },
          {
            id: '3',
            type: 'seo',
            title: 'Optimize for Keywords',
            description: 'Your content could target more relevant keywords',
            suggestion: 'Include more variations of your target keywords naturally throughout the content',
            confidence: 75,
            impact: 'high',
            category: 'SEO & Engagement'
          },
          {
            id: '4',
            type: 'engagement',
            title: 'Add Interactive Elements',
            description: 'Engage readers with interactive content',
            suggestion: 'Consider adding code examples, quizzes, or call-to-action buttons to increase engagement',
            confidence: 80,
            impact: 'medium',
            category: 'User Experience'
          },
          {
            id: '5',
            type: 'readability',
            title: 'Improve Sentence Structure',
            description: 'Some sentences could be simplified for better readability',
            suggestion: 'Break down complex sentences and use more transition words to improve flow',
            confidence: 70,
            impact: 'medium',
            category: 'Readability'
          },
          {
            id: '6',
            type: 'tone',
            title: 'Adjust Tone for Audience',
            description: 'The tone could be more conversational for better engagement',
            suggestion: 'Use more personal pronouns (you, your) and contractions to create a friendly tone',
            confidence: 65,
            impact: 'low',
            category: 'Tone & Style'
          }
        ]
      };
      
      setAnalysis(mockAnalysis);
      setLoading(false);
    }, 2000);
  };

  useEffect(() => {
    if (content || title) {
      analyzeContent();
    }
  }, [content, title]);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'headline': return Target;
      case 'structure': return BookOpen;
      case 'seo': return Zap;
      case 'engagement': return Sparkles;
      case 'readability': return CheckCircle;
      case 'tone': return Wand2;
      default: return Lightbulb;
    }
  };

  const groupedSuggestions = analysis?.suggestions.reduce((acc, suggestion) => {
    if (!acc[suggestion.category]) {
      acc[suggestion.category] = [];
    }
    acc[suggestion.category].push(suggestion);
    return acc;
  }, {} as Record<string, ContentSuggestion[]>) || {};

  const contentTemplates = [
    {
      id: 'tutorial',
      name: 'Tutorial Post',
      description: 'Step-by-step guide format',
      template: `# How to [Title]

## Introduction
Brief introduction explaining what readers will learn and why it's valuable.

## Prerequisites
- Requirement 1
- Requirement 2
- Requirement 3

## Step 1: [Action]
Detailed explanation with code examples if applicable.

## Step 2: [Action]
Continue with clear, actionable steps.

## Step 3: [Action]
Keep building on previous steps.

## Conclusion
Summarize what was accomplished and next steps.

## Additional Resources
- Link 1
- Link 2
- Link 3`
    },
    {
      id: 'comparison',
      name: 'Comparison Post',
      description: 'Compare different tools or approaches',
      template: `# [Tool A] vs [Tool B]: Which is Better?

## Introduction
Brief overview of what you're comparing and why.

## [Tool A] Overview
### Pros
- Advantage 1
- Advantage 2
- Advantage 3

### Cons
- Disadvantage 1
- Disadvantage 2

## [Tool B] Overview
### Pros
- Advantage 1
- Advantage 2
- Advantage 3

### Cons
- Disadvantage 1
- Disadvantage 2

## Side-by-Side Comparison
| Feature | Tool A | Tool B |
|---------|--------|--------|
| Feature 1 | ✅ | ❌ |
| Feature 2 | ❌ | ✅ |

## Conclusion
Recommendation based on use cases.`
    },
    {
      id: 'listicle',
      name: 'List Article',
      description: 'Numbered or bulleted list format',
      template: `# [Number] [Things] Every [Audience] Should Know

## Introduction
Hook the reader and explain the value of this list.

## 1. [First Item]
Detailed explanation of the first point.

## 2. [Second Item]
Detailed explanation of the second point.

## 3. [Third Item]
Continue the pattern...

## Conclusion
Wrap up with key takeaways and call to action.`
    }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Sparkles className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">AI Content Assistant</h3>
              <p className="text-sm text-gray-600">Get intelligent suggestions to improve your content</p>
            </div>
          </div>
          {!loading && analysis && (
            <button
              onClick={analyzeContent}
              className="inline-flex items-center gap-2 px-3 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Wand2 className="h-4 w-4" />
              Re-analyze
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex px-6">
          {[
            { id: 'suggestions', label: 'Suggestions', icon: Lightbulb },
            { id: 'analysis', label: 'Analysis', icon: Target },
            { id: 'templates', label: 'Templates', icon: BookOpen }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-4 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-6">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
              <span className="text-gray-600">Analyzing your content...</span>
            </div>
          </div>
        )}

        {!content && !title && !loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Start Writing to Get Suggestions</h3>
            <p className="text-gray-500">Add some content and the AI will provide personalized recommendations</p>
          </div>
        )}

        {analysis && !loading && (
          <>
            {activeTab === 'analysis' && (
              <div className="space-y-6">
                {/* Overall Scores */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(analysis.score)}`}>
                      {analysis.score}
                    </div>
                    <div className="text-sm text-gray-600">Overall Score</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(analysis.seoScore)}`}>
                      {analysis.seoScore}
                    </div>
                    <div className="text-sm text-gray-600">SEO Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {analysis.wordCount}
                    </div>
                    <div className="text-sm text-gray-600">Words</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {analysis.readingTime}
                    </div>
                    <div className="text-sm text-gray-600">Reading Time</div>
                  </div>
                </div>

                {/* Detailed Analysis */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Readability</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Grade Level</span>
                        <span className="text-sm font-medium">{analysis.readabilityGrade}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Reading Time</span>
                        <span className="text-sm font-medium">{analysis.readingTime}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Tone Analysis</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Sentiment</span>
                        <span className={`text-sm font-medium capitalize ${
                          analysis.toneAnalysis.sentiment === 'positive' ? 'text-green-600' :
                          analysis.toneAnalysis.sentiment === 'negative' ? 'text-red-600' :
                          'text-gray-600'
                        }`}>
                          {analysis.toneAnalysis.sentiment}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Formality</span>
                        <span className="text-sm font-medium capitalize">{analysis.toneAnalysis.formality}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Confidence</span>
                        <span className="text-sm font-medium">{analysis.toneAnalysis.confidence}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'suggestions' && (
              <div className="space-y-6">
                {Object.entries(groupedSuggestions).map(([category, suggestions]) => (
                  <div key={category}>
                    <h4 className="font-medium text-gray-900 mb-3">{category}</h4>
                    <div className="space-y-4">
                      {suggestions.map((suggestion) => {
                        const Icon = getSuggestionIcon(suggestion.type);
                        return (
                          <div key={suggestion.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                            <div className="flex items-start gap-4">
                              <div className="p-2 bg-blue-50 rounded-lg">
                                <Icon className="h-4 w-4 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h5 className="font-medium text-gray-900">{suggestion.title}</h5>
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getImpactColor(suggestion.impact)}`}>
                                    {suggestion.impact} impact
                                  </span>
                                  <span className="text-xs text-gray-500">{suggestion.confidence}% confidence</span>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>
                                <div className="bg-gray-50 rounded p-3">
                                  <p className="text-sm text-gray-700">{suggestion.suggestion}</p>
                                </div>
                                {suggestion.originalText && suggestion.improvedText && (
                                  <div className="mt-3 space-y-2">
                                    <div className="text-sm">
                                      <span className="font-medium text-red-600">Before:</span>
                                      <p className="text-gray-600 italic">{suggestion.originalText}</p>
                                    </div>
                                    <div className="text-sm">
                                      <span className="font-medium text-green-600">After:</span>
                                      <p className="text-gray-600 italic">{suggestion.improvedText}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'templates' && (
              <div className="space-y-4">
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Content Templates</h4>
                  <p className="text-sm text-gray-600">Use these templates as starting points for your content</p>
                </div>
                {contentTemplates.map((template) => (
                  <div key={template.id} className="border border-gray-200 rounded-lg">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium text-gray-900">{template.name}</h5>
                          <p className="text-sm text-gray-600">{template.description}</p>
                        </div>
                        <button className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                          Use Template
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 rounded p-3 overflow-x-auto">
                        {template.template}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
