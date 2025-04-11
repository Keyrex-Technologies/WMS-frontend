import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiDownload, FiCalendar, FiUser, FiRefreshCw } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isWithinInterval, parseISO } from 'date-fns';
const AttendanceManagement = () => {
  const [timePeriod, setTimePeriod] = useState('');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const recordsPerPage = 10;

  const attendanceData = [
    {
      id: 1,
      emp_id: 'EMP001',
      employee: 'John Doe',
      date: '2023-05-15',
      checkIn: '08:45 AM',
      checkOut: '05:30 PM',
      status: 'Present',
      hoursWorked: '8.75',
      location: 'Restaurant',
      avatarColor: 'bg-blue-100 text-blue-600'
    },
    {
      id: 2,
      emp_id: 'EMP002',
      employee: 'Jane Smith',
      date: '2023-05-16',
      checkIn: '09:15 AM',
      checkOut: '06:00 PM',
      status: 'Present',
      hoursWorked: '8.75',
      location: 'Restaurant',
      avatarColor: 'bg-purple-100 text-purple-600'
    },
    {
      id: 3,
      emp_id: 'EMP003',
      employee: 'Alex Johnson',
      date: '2023-05-17',
      checkIn: '--',
      checkOut: '--',
      status: 'Absent',
      hoursWorked: '0',
      location: '--',
      avatarColor: 'bg-red-100 text-red-600'
    },
    {
      id: 4,
      emp_id: 'EMP004',
      employee: 'Sarah Williams',
      date: '2023-05-18',
      checkIn: '08:50 AM',
      checkOut: '05:45 PM',
      status: 'Present',
      hoursWorked: '8.92',
      location: 'Restaurant',
      avatarColor: 'bg-green-100 text-green-600'
    },
    {
      id: 5,
      emp_id: 'EMP005',
      employee: 'Michael Brown',
      date: '2023-05-19',
      checkIn: '10:00 AM',
      checkOut: '04:30 PM',
      status: 'Late',
      hoursWorked: '6.5',
      location: 'Restaurant',
      avatarColor: 'bg-yellow-100 text-yellow-600'
    },
  ];

  const filteredAttendance = attendanceData.filter(record => {
    const matchesSearch = record.employee.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' ? true : record.status === statusFilter;
    let matchesDate = true;
    if (dateRange.start && dateRange.end) {
      const recordDate = parseISO(record.date);
      const startDate = parseISO(dateRange.start);
      const endDate = parseISO(dateRange.end);
      matchesDate = isWithinInterval(recordDate, {
        start: startDate,
        end: endDate
      });
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleReset = () => {
    setTimePeriod('');
    setDateRange({ start: '', end: '' });
    setSearchTerm('');
    setStatusFilter('All');
    setCurrentPage(1);
  };

  useEffect(() => {
    if (timePeriod === 'weekly') {
      const start = format(new Date(new Date().setDate(new Date().getDate() - 7)), 'yyyy-MM-dd');
      const end = format(new Date(), 'yyyy-MM-dd');
      setDateRange({ start, end });
    } else if (timePeriod === 'monthly') {
      const start = format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd');
      const end = format(new Date(), 'yyyy-MM-dd');
      setDateRange({ start, end });
    } else if (timePeriod === '') {
      // Clear date range when no time period is selected
      setDateRange({ start: '', end: '' });
    }
  }, [timePeriod]);

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredAttendance.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredAttendance.length / recordsPerPage);

  // Handle export with loading state
  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      // In a real app, this would trigger a download
      console.log('Exporting filtered data:', filteredAttendance);
      alert('Export functionality would download the data in CSV format');
    }, 1500);
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusStyles = {
      Present: 'bg-green-100 text-green-800',
      Absent: 'bg-red-100 text-red-800',
      Late: 'bg-yellow-100 text-yellow-800',
      'Half Day': 'bg-blue-100 text-blue-800'
    };

    return (
      <motion.span
        whileHover={{ scale: 1.05 }}
        className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}
      >
        {status}
      </motion.span>
    );
  };

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3, ease: "easeIn" } }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full sm:px-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800">Attendance Management</h1>
          <p className="text-gray-600 mt-2">View and manage employee attendance records</p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white p-4 rounded-xl shadow-sm mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <motion.div whileHover={{ y: -1 }}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search employees..."
                  className="pl-10 w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </motion.div>

            {/* Time Period Selector */}
            <motion.div whileHover={{ y: -1 }}>
              <div className="relative">
                <select
                  className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none pr-8"
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(e.target.value)}
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="custom">Custom Range</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <FiCalendar className="text-gray-400" />
                </div>
              </div>
            </motion.div>

            {/* Start Date */}
            <motion.div whileHover={{ y: -1 }}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCalendar className="text-gray-400" />
                </div>
                <input
                  type="date"
                  className="pl-10 w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={dateRange.start}
                  onChange={(e) => {
                    setDateRange({ ...dateRange, start: e.target.value });
                    if (timePeriod !== 'custom') setTimePeriod('custom');
                  }}
                />
              </div>
            </motion.div>

            {/* End Date */}
            <motion.div whileHover={{ y: -1 }}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCalendar className="text-gray-400" />
                </div>
                <input
                  type="date"
                  className="pl-10 w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={dateRange.end}
                  onChange={(e) => {
                    setDateRange({ ...dateRange, end: e.target.value });
                    if (timePeriod !== 'custom') setTimePeriod('custom');
                  }}
                  disabled={timePeriod !== 'custom'}
                />
              </div>
            </motion.div>

            {/* Status Filter */}
            <motion.div whileHover={{ y: -1 }}>
              <div className="relative">
                <select
                  className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none pr-8"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Late">Late</option>
                  <option value="Half Day">Half Day</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <FiFilter className="text-gray-400" />
                </div>
              </div>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReset}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-all"
            >
              <FiRefreshCw className="text-gray-600" />
              Reset Filters
            </motion.button>

            {/* Export Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExport}
              disabled={isExporting || filteredAttendance.length === 0}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white col-span-2 ${isExporting ? 'bg-blue-400' :
                filteredAttendance.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
              <FiDownload />
              {isExporting ? 'Exporting...' : 'Export Report'}
            </motion.button>
          </div>
        </motion.div>

        {/* Attendance Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Emp_ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <AnimatePresence>
                  {currentRecords.length > 0 ? (
                    currentRecords.map((record) => (
                      <motion.tr
                        key={record.id}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.emp_id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`flex-shrink-0 h-10 w-10 rounded-full ${record.avatarColor} flex items-center justify-center`}>
                              <span className="font-medium">{record.employee.charAt(0)}</span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{record.employee}</div>
                              <div className="text-sm text-gray-500">{record.emp_id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(record.date), 'MMM dd, yyyy')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.checkIn}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.checkOut}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={record.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.hoursWorked} hrs</td>
                      </motion.tr>
                    ))
                  ) : (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <td colSpan="6" className="px-6 py-8 text-center">
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
                          <p className="text-lg font-medium">No attendance records found</p>
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
        {filteredAttendance.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4"
          >
            <div className="text-sm text-gray-500">
              Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, filteredAttendance.length)} of {filteredAttendance.length} records
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 border rounded-lg transition-all ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
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
                      className={`px-4 py-2 border rounded-lg transition-all ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
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
                    className={`px-4 py-2 border rounded-lg transition-all ${currentPage === totalPages ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
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
                className={`px-4 py-2 border rounded-lg transition-all ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
              >
                Next
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default AttendanceManagement;