import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDownload, FiPrinter, FiCalendar, FiUser } from 'react-icons/fi';

const PayrollReports = () => {
  const [selectedReport, setSelectedReport] = useState('monthly');
  const [dateRange, setDateRange] = useState({
    start: '2023-01-01',
    end: '2023-01-31'
  });
  const [generatedReport, setGeneratedReport] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const reports = [
    { id: 'monthly', name: 'Monthly Summary', icon: <FiCalendar />, desc: 'Salary breakdown by month' },
    { id: 'employee', name: 'By Employee', icon: <FiUser />, desc: 'Individual employee reports' }
  ];

  // Mock report data
  const mockReportData = {
    monthly: {
      title: "Monthly Payroll Summary",
      data: [
        { month: 'January 2023', totalPaid: 125000, employees: 15 },
        { month: 'February 2023', totalPaid: 132000, employees: 16 },
        { month: 'March 2023', totalPaid: 128500, employees: 15 }
      ]
    },
    employee: {
      title: "Employee Payroll Details",
      data: [
        { name: 'John Doe', id: 'EMP001', basicSalary: 80000, allowances: 5000, deductions: 2000, netSalary: 83000 },
        { name: 'Jane Smith', id: 'EMP002', basicSalary: 75000, allowances: 4500, deductions: 1500, netSalary: 78000 },
        { name: 'Mike Johnson', id: 'EMP003', basicSalary: 85000, allowances: 6000, deductions: 2500, netSalary: 88500 }
      ]
    }
  };

  const generateReport = () => {
    setIsGenerating(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setGeneratedReport(mockReportData[selectedReport]);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full sm:px-6 max-w-4xl"
    >
      <motion.h1 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="text-2xl font-bold text-gray-800 mb-6"
      >
        Payroll Reports
      </motion.h1>

      {/* Report Type Selector */}
      <motion.div 
        className="grid grid-cols-2 gap-3 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {reports.map((report) => (
          <motion.button
            key={report.id}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`p-4 rounded-lg border transition-colors flex items-start gap-3 ${selectedReport === report.id ? 
              'bg-blue-50 border-blue-300 text-blue-700' : 
              'bg-white border-gray-200 hover:bg-gray-50'}`}
            onClick={() => {
              setSelectedReport(report.id);
              setGeneratedReport(null);
            }}
          >
            <div className={`p-2 rounded-full ${selectedReport === report.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}>
              {report.icon}
            </div>
            <div className="text-left">
              <h3 className="font-medium">{report.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{report.desc}</p>
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Date Range Picker */}
      <motion.div 
        className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-2 mb-3 text-gray-700">
          <FiCalendar />
          <span className="font-medium">Date Range</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-sm text-gray-500 mb-1">Start Date</label>
            <input 
              type="date" 
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm text-gray-500 mb-1">End Date</label>
            <input 
              type="date" 
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </motion.div>

      {/* Generate Button */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={generateReport}
          disabled={isGenerating}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isGenerating ? 'bg-blue-400' : 'bg-blue-600'} text-white`}
        >
          {isGenerating ? (
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="inline-block"
            >
              ⏳
            </motion.span>
          ) : (
            <FiDownload />
          )}
          {isGenerating ? 'Generating...' : 'Generate Report'}
        </motion.button>
      </motion.div>

      {/* Report Display */}
      <AnimatePresence>
        {generatedReport && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-8"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">{generatedReport.title}</h2>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-white border border-gray-300 rounded-lg"
                >
                  <FiPrinter />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-white border border-gray-300 rounded-lg"
                >
                  <FiDownload />
                </motion.button>
              </div>
            </div>

            {selectedReport === 'monthly' ? (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="grid grid-cols-3 bg-gray-50 p-3 font-medium text-gray-700 border-b">
                  <div>Month</div>
                  <div className="text-right">Total Paid</div>
                  <div className="text-right">Employees</div>
                </div>
                {generatedReport.data.map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`grid grid-cols-3 p-3 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    <div>{item.month}</div>
                    <div className="text-right font-medium">PKR {item.totalPaid.toLocaleString()}</div>
                    <div className="text-right">{item.employees}</div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="grid grid-cols-5 bg-gray-50 p-3 font-medium text-gray-700 border-b">
                  <div className="col-span-2">Employee</div>
                  <div className="text-right">Basic Salary</div>
                  <div className="text-right">Net Salary</div>
                  <div className="text-right">Details</div>
                </div>
                {generatedReport.data.map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`grid grid-cols-5 p-3 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    <div className="col-span-2">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-500">{item.id}</div>
                    </div>
                    <div className="text-right">PKR {item.basicSalary.toLocaleString()}</div>
                    <div className="text-right font-medium text-green-600">PKR {item.netSalary.toLocaleString()}</div>
                    <div className="text-right">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-blue-600 text-sm font-medium"
                      >
                        View
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            <div className="mt-4 text-sm text-gray-500">
              Report generated for {dateRange.start} to {dateRange.end}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PayrollReports;