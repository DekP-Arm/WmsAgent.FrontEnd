export function Inbound() {
    return(
        <div className="flex justify-around p-8 bg-gray-100 min-h-screen">
        <div className="bg-white rounded-lg p-6 w-1/4 shadow-md">
          <h2 className="text-xl font-semibold text-center mb-4">Incoming</h2>
          <div className="bg-gray-200 rounded-lg p-4 mb-4 shadow-sm">Order A112</div>
        </div>
        <div className="bg-white rounded-lg p-6 w-1/4 shadow-md">
          <h2 className="text-xl font-semibold text-center mb-4">Checking</h2>
          <div className="bg-gray-200 rounded-lg p-4 mb-4 shadow-sm">Order A112</div>
        </div>
        <div className="bg-white rounded-lg p-6 w-1/4 shadow-md">
          <h2 className="text-xl font-semibold text-center mb-4">Approve</h2>
        </div>
        <div className="bg-white rounded-lg p-6 w-1/4 shadow-md">
          <h2 className="text-xl font-semibold text-center mb-4">Reject</h2>
        </div>
      </div>
    )
    
}