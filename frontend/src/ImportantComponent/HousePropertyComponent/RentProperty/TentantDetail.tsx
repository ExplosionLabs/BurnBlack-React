import { Building2, ChevronDown, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'

interface TenantDetails {
  name: string
  panOrTan: string
  aadhaar: string
}

interface TenantDetailsComponentProps {
  data: TenantDetails[]
  onChange: (data: TenantDetails[]) => void
}

export default function TenantDetailsComponent({ data, onChange }: TenantDetailsComponentProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const handleChange = (index: number, field: keyof TenantDetails, value: string) => {
    const updatedData = [...data]
    updatedData[index][field] = value
    onChange(updatedData)
  }

  const handleAddTenant = () => {
    const newTenant = { name: "", panOrTan: "", aadhaar: "" }
    onChange([...data, newTenant])
  }

  const handleRemoveTenant = (index: number) => {
    const updatedData = data.filter((_, i) => i !== index)
    onChange(updatedData)
  }

  return (
    <div className="rounded-md border bg-white p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-50">
          <Building2 className="h-6 w-6 text-blue-500" />
        </div>
        <div className="flex flex-1 items-center justify-between">
          <h2 className="text-lg font-semibold">Tenant Details</h2>
          <ChevronDown 
            className={`h-5 w-5 text-gray-500 cursor-pointer transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            onClick={() => setIsExpanded(!isExpanded)}
          />
        </div>
      </div>
      
      {isExpanded && (
      <div className="space-y-6">
        {data.map((tenant, index) => (
          <div key={index} className="grid grid-cols-[1fr,1fr,1fr,auto] gap-4 items-start">
            <div className="space-y-1.5">
              <label 
                htmlFor={`tenant-name-${index}`}
                className="block text-sm font-medium text-gray-900"
              >
                Name of the Tenant
              </label>
              <input
                type="text"
                id={`tenant-name-${index}`}
                value={tenant.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="space-y-1.5">
              <label 
                htmlFor={`tenant-pan-${index}`}
                className="block text-sm font-medium text-gray-900"
              >
                PAN/TAN of the Tenant
              </label>
              <input
                type="text"
                id={`tenant-pan-${index}`}
                value={tenant.panOrTan}
                onChange={(e) => handleChange(index, "panOrTan", e.target.value)}
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="space-y-1.5">
              <label 
                htmlFor={`tenant-aadhaar-${index}`}
                className="block text-sm font-medium text-gray-900"
              >
                Aadhaar of the Tenant
              </label>
              <input
                type="text"
                id={`tenant-aadhaar-${index}`}
                value={tenant.aadhaar}
                onChange={(e) => handleChange(index, "aadhaar", e.target.value)}
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="button"
              onClick={() => handleRemoveTenant(index)}
              disabled={data.length === 1}
              className="mt-7 rounded-md p-2 text-red-500 hover:bg-red-50 disabled:opacity-50 disabled:hover:bg-transparent"
              aria-label="Remove tenant"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddTenant}
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-500 hover:text-blue-600"
        >
          <Plus className="h-4 w-4" />
          Add more items
        </button>
      </div>
      )}
    </div>
  )
}

