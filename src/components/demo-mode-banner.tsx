'use client';

import { isDemoMode } from '@/lib/sanity';
import { AlertCircle, Settings } from 'lucide-react';

export function DemoModeBanner() {
  if (!isDemoMode) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-medium text-blue-900 mb-1">
            Demo Mode Active
          </h3>
          <p className="text-sm text-blue-700 mb-3">
            You're viewing demo data. To connect your own Sanity CMS:
          </p>
          <ol className="text-sm text-blue-700 space-y-1 mb-3">
            <li>1. Copy <code className="px-1 py-0.5 bg-blue-100 rounded text-xs">.env.local.template</code> to <code className="px-1 py-0.5 bg-blue-100 rounded text-xs">.env.local</code></li>
            <li>2. Add your Sanity project credentials</li>
            <li>3. Restart the development server</li>
          </ol>
          <div className="flex gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText('cp .env.local.template .env.local');
                alert('Command copied to clipboard!');
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors"
            >
              <Settings className="h-3 w-3" />
              Copy Setup Command
            </button>
            <a
              href="https://sanity.io"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-white text-blue-600 text-xs rounded-md border border-blue-200 hover:bg-blue-50 transition-colors"
            >
              Get Sanity Account
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
