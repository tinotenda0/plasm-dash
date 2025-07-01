'use client'

import { useState, useEffect, useRef } from 'react'
import { Upload, Search, Trash2, Download, Image as ImageIcon, X, Grid, List } from 'lucide-react'

interface MediaFile {
  id: string
  name: string
  url: string
  size: number
  type: string
  uploadedAt: string
  alt?: string
  dimensions?: {
    width: number
    height: number
  }
}

interface MediaManagerProps {
  isOpen: boolean
  onClose: () => void
  onSelectImage?: (image: MediaFile) => void
  mode?: 'select' | 'manage'
}

export function MediaManager({ isOpen, onClose, onSelectImage, mode = 'manage' }: MediaManagerProps) {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      loadMediaFiles()
    }
  }, [isOpen])

  const loadMediaFiles = () => {
    // In a real app, this would fetch from your CMS/storage
    // For now, we'll use localStorage to simulate media files
    const stored = localStorage.getItem('mediaFiles')
    if (stored) {
      setFiles(JSON.parse(stored))
    }
  }

  const saveMediaFiles = (newFiles: MediaFile[]) => {
    localStorage.setItem('mediaFiles', JSON.stringify(newFiles))
    setFiles(newFiles)
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(event.target.files || [])
    if (uploadedFiles.length === 0) return

    setLoading(true)

    try {
      const newFiles: MediaFile[] = []

      for (const file of uploadedFiles) {
        const fileId = Date.now().toString() + Math.random().toString(36).substr(2, 9)
        
        // Simulate upload progress
        setUploadProgress(prev => ({ ...prev, [fileId]: 0 }))
        
        // Create object URL for preview (in a real app, you'd upload to a service)
        const url = URL.createObjectURL(file)
        
        // Get image dimensions if it's an image
        let dimensions: { width: number; height: number } | undefined
        if (file.type.startsWith('image/')) {
          dimensions = await getImageDimensions(file)
        }

        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 20) {
          await new Promise(resolve => setTimeout(resolve, 100))
          setUploadProgress(prev => ({ ...prev, [fileId]: progress }))
        }

        const mediaFile: MediaFile = {
          id: fileId,
          name: file.name,
          url,
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toISOString(),
          dimensions
        }

        newFiles.push(mediaFile)
        setUploadProgress(prev => {
          const { [fileId]: _, ...rest } = prev
          return rest
        })
      }

      const updatedFiles = [...files, ...newFiles]
      saveMediaFiles(updatedFiles)

    } catch (error) {
      console.error('Error uploading files:', error)
      alert('Failed to upload some files')
    } finally {
      setLoading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        resolve({ width: img.width, height: img.height })
      }
      img.src = URL.createObjectURL(file)
    })
  }

  const deleteFiles = (fileIds: string[]) => {
    if (!confirm(`Are you sure you want to delete ${fileIds.length} file(s)?`)) {
      return
    }

    const updatedFiles = files.filter(file => !fileIds.includes(file.id))
    saveMediaFiles(updatedFiles)
    setSelectedFiles([])
  }

  const updateFileAlt = (fileId: string, alt: string) => {
    const updatedFiles = files.map(file => 
      file.id === fileId ? { ...file, alt } : file
    )
    saveMediaFiles(updatedFiles)
  }

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.alt?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleFileSelect = (file: MediaFile) => {
    if (mode === 'select' && onSelectImage) {
      onSelectImage(file)
      onClose()
    } else {
      // Toggle selection for management mode
      setSelectedFiles(prev =>
        prev.includes(file.id)
          ? prev.filter(id => id !== file.id)
          : [...prev, file.id]
      )
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-6xl transform overflow-hidden rounded-lg bg-white shadow-xl">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {mode === 'select' ? 'Select Image' : 'Media Manager'}
              </h3>
              <button
                onClick={onClose}
                className="rounded-md p-2 text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search files..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="rounded-md border border-gray-300 pl-10 pr-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  />
                </div>
                
                {selectedFiles.length > 0 && (
                  <button
                    onClick={() => deleteFiles(selectedFiles)}
                    className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Selected ({selectedFiles.length})
                  </button>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="flex rounded-md border border-gray-300">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Files
                </button>
              </div>
            </div>
          </div>

          {/* File Grid/List */}
          <div className="p-6 max-h-[calc(100vh-300px)] overflow-y-auto">
            {loading && (
              <div className="mb-4 text-center">
                <div className="text-sm text-gray-500">Uploading files...</div>
                {Object.entries(uploadProgress).map(([fileId, progress]) => (
                  <div key={fileId} className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredFiles.length === 0 ? (
              <div className="text-center py-12">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No media files</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Upload images and other media files to get started.
                </p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    className={`relative group cursor-pointer rounded-lg border-2 transition-all ${
                      selectedFiles.includes(file.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleFileSelect(file)}
                  >
                    <div className="aspect-square p-2">
                      {file.type.startsWith('image/') ? (
                        <img
                          src={file.url}
                          alt={file.alt || file.name}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded">
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent rounded-b-lg p-2">
                      <p className="text-xs text-white truncate">{file.name}</p>
                      <p className="text-xs text-gray-300">{formatFileSize(file.size)}</p>
                    </div>
                    
                    {mode !== 'select' && (
                      <div className="absolute top-2 right-2">
                        <input
                          type="checkbox"
                          checked={selectedFiles.includes(file.id)}
                          onChange={() => {}}
                          className="rounded"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    className={`flex items-center space-x-4 p-4 rounded-lg border transition-all cursor-pointer ${
                      selectedFiles.includes(file.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleFileSelect(file)}
                  >
                    {mode !== 'select' && (
                      <input
                        type="checkbox"
                        checked={selectedFiles.includes(file.id)}
                        onChange={() => {}}
                        className="rounded"
                      />
                    )}
                    
                    <div className="flex-shrink-0 w-16 h-16">
                      {file.type.startsWith('image/') ? (
                        <img
                          src={file.url}
                          alt={file.alt || file.name}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded">
                          <ImageIcon className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{file.name}</p>
                      <div className="mt-1 text-sm text-gray-500">
                        <span>{formatFileSize(file.size)}</span>
                        {file.dimensions && (
                          <span> • {file.dimensions.width}×{file.dimensions.height}</span>
                        )}
                        <span> • {file.uploadedAt ? new Date(file.uploadedAt).toLocaleDateString() : 'Date unavailable'}</span>
                      </div>
                      
                      {mode !== 'select' && (
                        <input
                          type="text"
                          placeholder="Alt text..."
                          value={file.alt || ''}
                          onChange={(e) => updateFileAlt(file.id, e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="mt-2 block w-full text-sm border border-gray-300 rounded px-2 py-1 focus:border-blue-500 focus:outline-none"
                        />
                      )}
                    </div>
                    
                    <div className="flex-shrink-0">
                      <a
                        href={file.url}
                        download={file.name}
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 text-gray-400 hover:text-gray-500"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>
    </div>
  )
}
