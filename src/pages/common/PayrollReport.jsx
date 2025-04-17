import React, { useState, useEffect } from 'react';
import { FiSearch, FiClock, FiCalendar, FiChevronDown } from 'react-icons/fi';
import { BiPound } from 'react-icons/bi';
import { getAllPayrolls } from '../../utils/attendance';

const bubbles = [
  "bg-blue-100 text-blue-600",
  "bg-purple-100 text-purple-600",
  "bg-red-100 text-red-600",
  "bg-green-100 text-green-600",
  "bg-yellow-100 text-yellow-600"
];

const PayrollReport = () => {
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    name: new Date(currentYear, i, 1).toLocaleString('default', { month: 'long' })
  }));

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRandomColor = () => {
    return bubbles[Math.floor(Math.random() * bubbles.length)];
  };

  const calculateSummary = (filteredRecords) => {
    if (filteredRecords.length === 0) {
      return null;
    }

    const summary = {
      name: filteredRecords[0]?.employeeName || '',
      position: filteredRecords[0]?.employeePosition || '',
      presentDays: 0,
      absentDays: 0,
      totalSalary: 0,
      totalHours: 0,
      avatarColor: getRandomColor()
    };

    filteredRecords.forEach(record => {
      if (record.status === 'Present') {
        summary.presentDays++;
        summary.totalSalary += record.daily_salary || 0;
        summary.totalHours += record.working_hours || 0;
      } else {
        summary.absentDays++;
      }
    });

    return summary;
  };

  const fetchPayrolls = async (month) => {
    setLoading(true);
    try {
      const response = await getAllPayrolls(month);

      if (response.status) {
        const recordsWithColor = response.data.attendance?.map(record => ({
          ...record,
          avatarColor: getRandomColor()
        })) || [];
        setRecords(recordsWithColor);
      } else {
        console.error("Failed to fetch payroll data:", response.error);
        setRecords([]);
      }
    } catch (error) {
      console.error("Error fetching payroll:", error);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayrolls(selectedMonth);
  }, [selectedMonth]);

  const filteredRecords = records.filter(record => {
    return searchTerm === '' ||
      record.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.employeeEmail && record.employeeEmail.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const isSingleEmployeeView = () => {
    if (searchTerm === '' || filteredRecords.length === 0) return false;

    const firstEmployeeId = filteredRecords[0].employeeId;
    return filteredRecords.every(record => record.employeeId === firstEmployeeId);
  };

  const singleEmployeeSummary = isSingleEmployeeView() ? calculateSummary(filteredRecords) : null;

  // Pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Payroll Management</h1>
        <p className="text-gray-600 mt-2">
          Generate and review employee payroll for selected month
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Search */}
        <div className="relative md:col-span-2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search employee by name, ID or email..."
            className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Month Selector */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
            <FiCalendar className="text-gray-400" />
          </div>
          <select
            className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none"
            value={selectedMonth}
            onChange={(e) => {
              setSelectedMonth(parseInt(e.target.value));
              setCurrentPage(1);
            }}
          >
            {months.map(month => (
              <option key={month.value} value={month.value}>
                {month.name} {currentYear}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <FiChevronDown className="text-gray-400" />
          </div>
        </div>
      </div>

      {/* Employee Summary Card (shown when viewing single employee) */}
      {singleEmployeeSummary && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className={`flex-shrink-0 h-16 w-16 rounded-full ${singleEmployeeSummary.avatarColor} flex items-center justify-center text-2xl font-medium`}>
              {singleEmployeeSummary.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800">{singleEmployeeSummary.name}</h2>
              <p className="text-gray-600">{singleEmployeeSummary.position}</p>
              <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Present Days</p>
                  <p className="font-semibold">{singleEmployeeSummary.presentDays}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Absent Days</p>
                  <p className="font-semibold">{singleEmployeeSummary.absentDays}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Hours</p>
                  <p className="font-semibold">{singleEmployeeSummary.totalHours.toFixed(2)} hrs</p>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600">Estimated Monthly Pay</p>
              <p className="text-2xl font-bold text-blue-700">
                {formatCurrency(singleEmployeeSummary.totalSalary)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Payroll Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  <div className="flex items-center">
                    <FiClock className="mr-1" /> Hours
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  <div className="flex items-center">
                    <BiPound className="mr-1" /> Daily Salary
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {currentRecords.length > 0 ? (
                currentRecords.map((record) => (
                  <tr key={`${record.employeeId}-${record.date}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-10 w-10 rounded-full ${record.avatarColor} flex items-center justify-center`}>
                          <span className="font-medium">
                            {record.employeeName.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {record.employeeName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {record.employeePosition}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(record.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${record.status === 'Present'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.status === 'Present' ? (
                        `${record.working_hours.toFixed(2)} hrs`
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                      {record.status === 'Present' ? (
                        <span className="text-green-600">
                          {formatCurrency(record.daily_salary)}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    {loading ? 'Loading...' : searchTerm ? 'No records found for this employee' : 'No records available'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {filteredRecords.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-500">
            Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, filteredRecords.length)} of {filteredRecords.length} records
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollReport;