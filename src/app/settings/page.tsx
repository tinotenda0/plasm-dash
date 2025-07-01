export default function SettingsPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Configure your dashboard and Sanity integration
          </p>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Sanity Configuration
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Project ID
                  </label>
                  <p className="mt-1 text-sm text-gray-500">
                    Your Sanity project ID from your project settings
                  </p>
                  <div className="mt-2">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                      {process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'Not configured'}
                    </code>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Dataset
                  </label>
                  <p className="mt-1 text-sm text-gray-500">
                    The dataset to use (usually 'production')
                  </p>
                  <div className="mt-2">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                      {process.env.NEXT_PUBLIC_SANITY_DATASET || 'Not configured'}
                    </code>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-md">
                <h4 className="text-sm font-medium text-blue-900">
                  Configuration Instructions
                </h4>
                <div className="mt-2 text-sm text-blue-700">
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Copy <code>.env.local.template</code> to <code>.env.local</code></li>
                    <li>Add your Sanity project credentials</li>
                    <li>Restart the development server</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
