import React from 'react';
import { FiX, FiPrinter, FiDownload } from 'react-icons/fi';

const PayrollModal = ({ payroll, onClose }) => {
  if (!payroll) return null;

  return (
    <div className='w-full h-full bg-white/10 backdrop-blur-3xl overflow-y-auto fixed inset-0 z-[9999] '>
      <div className=" flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-auto">
          {/* Modal Header */}
          <div className="flex justify-between items-center border-b p-4">
            <h3 className="text-lg font-semibold text-gray-800">Payroll Details</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-4 md:p-6">
            {/* Employee Info */}
            <div className="flex flex-col sm:flex-row items-start mb-6 gap-4">
              <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-medium text-lg">
                  {payroll.employee.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-800">{payroll.employee}</h4>
                <p className="text-gray-600">Employee ID: {payroll.employeeId}</p>
                <p className="text-gray-600">Period: {payroll.period}</p>
              </div>
            </div>

            {/* Salary Breakdown */}
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-800 mb-3">Salary Breakdown</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Basic Salary:</span>
                  <span className="font-medium">PKR {payroll.basicSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Allowances:</span>
                  <span className="text-green-600">+ PKR {payroll.allowances.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Deductions:</span>
                  <span className="text-red-600">- PKR {payroll.deductions.toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="flex justify-between">
                  <span className="text-gray-800 font-semibold">Net Salary:</span>
                  <span className="text-blue-600 font-bold">PKR {payroll.netSalary.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-800 mb-3">Payment Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Status:</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${payroll.status === 'Paid'
                      ? 'bg-green-100 text-green-800'
                      : payroll.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                    {payroll.status}
                  </span>
                </div>
                <div>
                  <p className="text-gray-600">Payment Date:</p>
                  <p className="text-gray-800">{payroll.paymentDate}</p>
                </div>
                <div>
                  <p className="text-gray-600">Payment Method:</p>
                  <p className="text-gray-800">{payroll.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-gray-600">Bank Account:</p>
                  <p className="text-gray-800">HBL ****4532</p>
                </div>
              </div>
            </div>

            {/* Deduction Details */}
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-800 mb-3">Deduction Details</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Tax:</span>
                  <span className="text-gray-800">PKR 1,500</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Late Attendance:</span>
                  <span className="text-gray-800">PKR 500</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Loan Deduction:</span>
                  <span className="text-gray-800">PKR 500</span>
                </div>
              </div>
            </div>

            {/* Allowance Details */}
            <div>
              <h4 className="text-md font-semibold text-gray-800 mb-3">Allowance Details</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Housing Allowance:</span>
                  <span className="text-gray-800">PKR 3,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transportation Allowance:</span>
                  <span className="text-gray-800">PKR 2,000</span>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="border-t p-4 flex flex-col sm:flex-row justify-end gap-3">
            <button className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">
              <FiPrinter />
              Print Payslip
            </button>
            <button className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              <FiDownload />
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollModal;