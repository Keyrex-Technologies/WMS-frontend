import React, { useState } from 'react';
import { FiSearch, FiFilter, FiDownload, FiDollarSign, FiPrinter } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import PayrollModal from '../../components/dialogs/PayrollModal';

const PayrollManagement = () => {
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [payrolls, setPayrolls] = useState([
    {
      id: 1,
      employee: 'John Doe',
      employeeId: 'EMP-001',
      period: 'May 2023',
      basicSalary: 50000,
      allowances: 5000,
      deductions: 2500,
      netSalary: 52500,
      status: 'Paid',
      paymentDate: '2023-05-31',
      paymentMethod: 'Bank Transfer',
      avatarColor: 'bg-blue-100 text-blue-600'
    },
    {
      id: 2,
      employee: 'Jane Smith',
      employeeId: 'EMP-002',
      period: 'May 2023',
      basicSalary: 60000,
      allowances: 6000,
      deductions: 3000,
      netSalary: 63000,
      status: 'Paid',
      paymentDate: '2023-05-31',
      paymentMethod: 'Bank Transfer',
      avatarColor: 'bg-purple-100 text-purple-600'
    },
    {
      id: 3,
      employee: 'Alex Johnson',
      employeeId: 'EMP-003',
      period: 'May 2023',
      basicSalary: 45000,
      allowances: 4500,
      deductions: 2250,
      netSalary: 47250,
      status: 'Pending',
      paymentDate: '--',
      paymentMethod: '--',
      avatarColor: 'bg-green-100 text-green-600'
    },
    {
      id: 4,
      employee: 'Sarah Williams',
      employeeId: 'EMP-004',
      period: 'April 2023',
      basicSalary: 55000,
      allowances: 5500,
      deductions: 2750,
      netSalary: 57750,
      status: 'Paid',
      paymentDate: '2023-04-30',
      paymentMethod: 'Cash',
      avatarColor: 'bg-yellow-100 text-yellow-600'
    },
    {
      id: 5,
      employee: 'Michael Brown',
      employeeId: 'EMP-005',
      period: 'April 2023',
      basicSalary: 48000,
      allowances: 4800,
      deductions: 2400,
      netSalary: 50400,
      status: 'Paid',
      paymentDate: '2023-04-30',
      paymentMethod: 'Bank Transfer',
      avatarColor: 'bg-red-100 text-red-600'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [periodFilter, setPeriodFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const recordsPerPage = 10;

  // Get unique periods for filter dropdown
  const uniquePeriods = ['All', ...new Set(payrolls.map(p => p.period))];

  // Filter payrolls based on search and filters
  const filteredPayrolls = payrolls.filter(payroll => {
    const matchesSearch =
      payroll.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payroll.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPeriod = periodFilter === 'All' ? true : payroll.period === periodFilter;
    const matchesStatus = statusFilter === 'All' ? true : payroll.status === statusFilter;
    return matchesSearch && matchesPeriod && matchesStatus;
  });

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredPayrolls.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredPayrolls.length / recordsPerPage);

  // Status badge component
  const StatusBadge = ({ status }) => {
    let bgColor = '';
    let textColor = '';

    switch (status) {
      case 'Paid':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        break;
      case 'Pending':
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-800';
        break;
      case 'Cancelled':
        bgColor = 'bg-red-100';
        textColor = 'text-red-800';
        break;
      default:
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-800';
    }

    return (
      <motion.span 
        whileHover={{ scale: 1.05 }}
        className={`px-2 py-1 text-xs font-medium rounded-full ${bgColor} ${textColor}`}
      >
        {status}
      </motion.span>
    );
  };

  // Process payroll function
  const processPayroll = (id) => {
    setIsProcessing(true);
    setTimeout(() => {
      setPayrolls(payrolls.map(payroll =>
        payroll.id === id ? { 
          ...payroll, 
          status: 'Paid', 
          paymentDate: new Date().toISOString().split('T')[0] 
        } : payroll
      ));
      setIsProcessing(false);
    }, 1000);
  };

  // Handle export
  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      // In a real app, this would trigger a download
      console.log('Exporting payroll data...');
    }, 1500);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      x: -50,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full sm:px-6"
    >
      <div className="max-w-7xl">
        {/* Header */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800">Payroll Management</h1>
          <p className="text-gray-600 mt-2">
            Process and manage employee payrolls with detailed breakdowns
          </p>
        </motion.div>

        {/* Action Bar */}
        <motion.div 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6"
        >
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              <FiDollarSign />
              Run Payroll
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExport}
              disabled={isExporting}
              className={`flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg transition-all ${
                isExporting ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FiDownload />
              {isExporting ? 'Exporting...' : 'Export'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg"
            >
              <FiPrinter />
              Print
            </motion.button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full md:w-auto">
            {/* Search */}
            <motion.div whileHover={{ y: -1 }}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search employees..."
                  className="pl-10 w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </motion.div>

            {/* Period Filter */}
            <motion.div whileHover={{ y: -1 }}>
              <div className="relative">
                <select
                  className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none pr-8"
                  value={periodFilter}
                  onChange={(e) => setPeriodFilter(e.target.value)}
                >
                  {uniquePeriods.map(period => (
                    <option key={period} value={period}>{period}</option>
                  ))}
                </select>
                <FiFilter className="absolute right-2 top-2.5 text-gray-400" />
              </div>
            </motion.div>

            {/* Status Filter */}
            <motion.div whileHover={{ y: -1 }}>
              <select
                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </motion.div>
          </div>
        </motion.div>

        {/* Payroll Table */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden mb-6"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Basic Salary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Net Salary
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
                <AnimatePresence>
                  {currentRecords.length > 0 ? (
                    currentRecords.map((payroll) => (
                      <motion.tr
                        key={payroll.id}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        layout
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <motion.div 
                              whileHover={{ scale: 1.1 }}
                              className={`flex-shrink-0 h-10 w-10 rounded-full ${payroll.avatarColor} flex items-center justify-center`}
                            >
                              <span className="font-medium">
                                {payroll.employee.charAt(0)}
                              </span>
                            </motion.div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {payroll.employee}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {payroll.employeeId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {payroll.period}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {payroll.basicSalary.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {payroll.netSalary.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={payroll.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-3">
                            {payroll.status === 'Pending' && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => processPayroll(payroll.id)}
                                disabled={isProcessing}
                                className={`text-sm px-3 py-1 rounded-lg ${
                                  isProcessing ? 'bg-gray-300 text-gray-500' : 'bg-green-600 text-white'
                                }`}
                              >
                                {isProcessing ? 'Processing...' : 'Pay'}
                              </motion.button>
                            )}
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setSelectedPayroll(payroll)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <td colSpan="7" className="px-6 py-8 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <svg
                            className="w-16 h-16 mb-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <p className="text-lg font-medium">No payroll records found</p>
                          <p className="text-sm mt-1">Try adjusting your search or filters</p>
                        </div>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Pagination */}
        {filteredPayrolls.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4"
          >
            <div className="text-sm text-gray-500">
              Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, filteredPayrolls.length)} of {filteredPayrolls.length} records
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 border rounded-lg transition-all ${
                  currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Previous
              </motion.button>
              
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let page;
                  if (totalPages <= 5) {
                    page = i + 1;
                  } else if (currentPage <= 3) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    page = totalPages - 4 + i;
                  } else {
                    page = currentPage - 2 + i;
                  }
                  
                  return (
                    <motion.button
                      key={page}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 border rounded-lg transition-all ${
                        currentPage === page ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </motion.button>
                  );
                })}
                
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <span className="px-4 py-2 text-gray-500">...</span>
                )}
                
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(totalPages)}
                    className={`px-4 py-2 border rounded-lg transition-all ${
                      currentPage === totalPages ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {totalPages}
                  </motion.button>
                )}
              </div>
              
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 border rounded-lg transition-all ${
                  currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Next
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Payroll Modal */}
      <AnimatePresence>
        {selectedPayroll && (
          <PayrollModal
            payroll={selectedPayroll}
            onClose={() => setSelectedPayroll(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PayrollManagement;