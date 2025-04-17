import { FaExclamationTriangle } from "react-icons/fa";

export default function AccountNotApproved() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center">
        <div className="flex justify-center mb-4 text-red-500 text-4xl">
          <FaExclamationTriangle />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Account Not Approved</h2>
        <p className="text-gray-600 text-sm mb-6">
          Your account is currently under review. You will be notified once it has been approved by the admin team.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-full transition duration-300"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}
