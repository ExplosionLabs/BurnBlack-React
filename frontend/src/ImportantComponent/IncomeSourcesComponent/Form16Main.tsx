import { Link } from "react-router-dom"
import { useSelector } from 'react-redux'
import { RootState } from "@/stores/store"
import { Banknote } from "lucide-react"


function Form16Main() {
  const selectIsUserLoggedIn = (state: RootState) => state.user.user !== null
  const isUserLoggedIn = useSelector(selectIsUserLoggedIn)

  return (

    <div className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden p-6">
  {/* Header Section */}
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-4">
      <Banknote className="w-6 h-6 text-blue-600" />
      <div>
        <h3 className="font-medium text-gray-900 text-base">Salary Income</h3>
        <p className="text-xs text-gray-500 mt-1">
          Add details manually or Upload Form 16 to auto-fill your salary details. <br />
          You can add salary income from multiple jobs as well.
        </p>
      </div>
    </div>
    <div className="flex items-center space-x-4">
      {/* <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 font-medium">
        Add Manually
      </button> */}
      <Link
        to="/fileITR/incomeSources/fill-detail"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
      >
      Add Manually
      </Link>
      <Link
        to="/fileITR/uploadForm16"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
      >
        Upload Form 16
      </Link>
    </div>
  </div>

  {/* Salary Details Section */}
  {/* <div className="mt-4 bg-gray-50 rounded-md p-4 flex items-center justify-between">
    <div className="flex items-center space-x-2">
      <span className="font-medium text-gray-900">Tata Consultancy Services Ltd.</span>
    </div>
    <div className="flex items-center space-x-4">
      <span className="font-medium text-gray-900">₹2,000</span>
      <button className="text-gray-700 hover:text-gray-900 font-medium">Edit</button>
      <button className="text-gray-700 hover:text-gray-900 font-medium">Remove</button>
    </div>
  </div> */}
</div>

    // <div className="p-6 bg-white rounded-md shadow-sm border">
    //   <div className="space-y-4">
    //     {/* Header Section */}
    //     <div className="flex items-center justify-between">
    //       <div className="flex items-center space-x-3">
    //         <Banknote className="w-6 h-6 text-blue-600" />
    //         <h2 className="text-xl font-semibold text-gray-900">Salary Income</h2>
    //       </div>
    //       <div className="flex items-center space-x-4">
    //         {/* <button className="text-blue-600 hover:text-blue-700 font-medium">
    //           Add Manually
    //         </button> */}
    //         <Link
    //           to="/fileITR/uploadForm16"
    //           className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
    //         >
    //           Upload Form 16
    //         </Link>
    //       </div>
    //     </div>

    //     {/* Description */}
    //     <div className="text-sm text-gray-600 mx-8">
    //       Add details manually or Upload Form 16 to auto-fill your salary details.
    //       <p>

    //       You can add salary income from multiple jobs as well.
    //       </p>
    //     </div>

    //     {/* Salary Entry */}
    //     <div className="mt-4 ml-4 p-4 bg-gray-50 rounded-md flex items-center justify-between">
    //       <div className="flex items-center space-x-2">
    //         <span className="font-medium text-gray-900">Tata Consultancy Services Ltd.</span>
    //         {/* <ExclamationTriangleIcon className="w-5 h-5 text-orange-500" /> */}
    //       </div>
    //       <div className="flex items-center space-x-4">
    //         <span className="font-medium text-gray-900">₹2,000</span>
    //         <button className="text-gray-700 hover:text-gray-900 font-medium">
    //           Edit
    //         </button>
    //         <button className="text-gray-700 hover:text-gray-900 font-medium">
    //           Remove
    //         </button>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  )
}

export default Form16Main

