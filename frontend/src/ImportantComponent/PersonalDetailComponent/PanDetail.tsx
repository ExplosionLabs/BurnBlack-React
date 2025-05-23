import { UserPlus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
export default function PanLinkingSection() {
    const navigate=useNavigate();
  return (
    <div className="w-full">
      <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-900">Link your PAN</h2>
            <p className="text-gray-600 text-sm">
              PAN Linking is a mandatory requirement to e-file your returns.
            </p>
          </div>
        </div>
        <button onClick={()=>navigate("/fileITR/addPanCardDetail")} className="px-4 py-2 text-blue-500 font-medium bg-white border-2 border-blue-500 rounded-md hover:bg-blue-50 transition-colors">
          Link your PAN
        </button>
      </div>
    </div>
  )
}

