import { useState } from 'react';
import { Link } from 'react-router-dom'

export default function TaxDonation() {
      const [showForm, setShowForm] = useState(false);
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border">
    <div
        className="flex items-center justify-between gap-3 cursor-pointer"
        onClick={() => setShowForm(!showForm)} // Toggle the form visibility
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-50 rounded-md flex items-center justify-center">
            <svg
              className="w-6 h-6 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Donations / Contributions</h2>
            <p className="text-sm text-gray-500">
            Deductions for donations to charitable orgs., political parties, R&D, etc.
            </p>
          </div>
        </div>
        <div>
          <svg
            className={`w-5 h-5 transform transition-transform ${
              showForm ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {showForm && ( 
      <div className="space-y-6 mt-6">
        <div className="flex justify-between items-start pb-6 border-b">
          <div>
            <h2 className="text-gray-900 font-medium mb-1">Donations to charitable organizations</h2>
            <p className="text-gray-600 text-sm">80G - Govt requires itemized details of donations for this.</p>
          </div>
          <Link
            to="/tax-saving/deduction-80g"
            className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
          >
            Add Details
          </Link>
        </div>

        <div className="flex justify-between items-start pb-6 border-b">
          <div>
            <h2 className="text-gray-900 font-medium mb-1">Donations for Research/Rural Development</h2>
            <p className="text-gray-600 text-sm">80GGA - Govt requires itemized details of donations for this.</p>
          </div>
          <Link
            to="/tax-saving/deduction-80gga"
            className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
          >
            Add Details
          </Link>
        </div>

        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-gray-900 font-medium mb-1">80GGC - Contribution to political party</h2>
            <p className="text-gray-600 text-sm">Enter the contribution or donation made to a political party <span className="text-blue-600">New</span></p>
          </div>
          <Link
            to="/tax-saving/contri-party"
            className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
          >
            Add Details
          </Link>
        </div>
      </div>
      )}
    </div>

  )
}
