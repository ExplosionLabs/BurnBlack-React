import React, { useState } from 'react'
import { useAuth } from '../contexts/SupabaseAuthContext'
import { motion } from 'framer-motion'
import { 
  Upload, 
  FileText, 
  Download, 
  Trash2, 
  Search,
  Filter,
  Plus,
  Eye,
  MoreVertical
} from 'lucide-react'

interface Document {
  id: string
  name: string
  type: string
  size: string
  uploadDate: string
  category: string
  status: 'uploaded' | 'processing' | 'verified' | 'rejected'
}

const DocumentsPage: React.FC = () => {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  
  // Mock documents data
  const [documents] = useState<Document[]>([
    {
      id: '1',
      name: 'Form 16 - FY 2023-24.pdf',
      type: 'PDF',
      size: '2.3 MB',
      uploadDate: '2024-03-15',
      category: 'form16',
      status: 'verified'
    },
    {
      id: '2', 
      name: 'PAN Card.jpg',
      type: 'JPG',
      size: '856 KB',
      uploadDate: '2024-03-10',
      category: 'identity',
      status: 'verified'
    },
    {
      id: '3',
      name: 'Bank Statement - March 2024.pdf',
      type: 'PDF', 
      size: '4.1 MB',
      uploadDate: '2024-03-20',
      category: 'bank',
      status: 'processing'
    },
    {
      id: '4',
      name: 'Investment Certificates.pdf',
      type: 'PDF',
      size: '1.8 MB', 
      uploadDate: '2024-03-18',
      category: 'investment',
      status: 'uploaded'
    }
  ])

  const categories = [
    { value: 'all', label: 'All Documents' },
    { value: 'form16', label: 'Form 16' },
    { value: 'identity', label: 'Identity Documents' },
    { value: 'bank', label: 'Bank Statements' },
    { value: 'investment', label: 'Investment Proofs' },
    { value: 'property', label: 'Property Documents' },
    { value: 'other', label: 'Other' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800'
      case 'processing': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-blue-100 text-blue-800'
    }
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || doc.category === filterCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
              <p className="text-gray-600">Manage your tax-related documents</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Upload Document
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-8 mb-6 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursor-pointer"
        >
          <div className="text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Drag and drop your documents here
            </h3>
            <p className="text-gray-600 mb-4">
              or click to browse files. Maximum file size: 10MB
            </p>
            <p className="text-sm text-gray-500">
              Supported formats: PDF, JPG, PNG, DOC, DOCX
            </p>
          </div>
        </motion.div>

        {/* Documents List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Your Documents ({filteredDocuments.length})
            </h2>
          </div>
          
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
              <p className="text-gray-600">
                {searchTerm || filterCategory !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Upload your first document to get started'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Document Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Upload Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDocuments.map((doc, index) => (
                    <motion.tr
                      key={doc.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {doc.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {doc.type}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 capitalize">
                          {categories.find(cat => cat.value === doc.category)?.label || doc.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {doc.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(doc.uploadDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(doc.status)}`}>
                          {doc.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button className="text-blue-600 hover:text-blue-800">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-800">
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-800">
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-800">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default DocumentsPage