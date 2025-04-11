import React, { useState, useEffect } from 'react';
import { FiSearch, FiClock, FiDollarSign, FiCalendar, FiChevronDown, FiUser } from 'react-icons/fi';

const PayrollReport = () => {
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Current date helpers
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    name: new Date(currentYear, i, 1).toLocaleString('default', { month: 'long' })
  }));

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Calculate hourly rate based on actual working days
  const calculateHourlyRate = (monthlySalary, workingDays) => {
    const standardHours = workingDays * 8; // 8 hours per day
    return monthlySalary / standardHours;
  };

  // Calculate daily salary and hours with dynamic rates
  const calculateDailySalary = (clockIn, clockOut, hourlyRate) => {
    const [inHour, inMin] = clockIn.split(':').map(Number);
    const [outHour, outMin] = clockOut.split(':').map(Number);
    
    const start = inHour * 60 + inMin;
    const end = outHour * 60 + outMin;
    let minutes = end - start;
    
    // Deduct lunch break if worked more than 5 hours
    if (minutes > 300) minutes -= 60;
    
    const hours = minutes / 60;
    const salary = hours * hourlyRate;
    
    return { 
      hours: parseFloat(hours.toFixed(2)),
      salary: parseFloat(salary.toFixed(2))
    };
  };

  // Generate mock data for selected month
  useEffect(() => {
    const employees = [
      {
        id: 'EMP-001',
        name: 'John Doe',
        email: 'john@example.com',
        monthlySalary: 5000, // $5000 monthly
        avatarColor: 'bg-blue-100 text-blue-600',
        position: 'Software Engineer'
      },
      {
        id: 'EMP-002',
        name: 'Jane Smith',
        email: 'jane@example.com',
        monthlySalary: 6000, // $6000 monthly
        avatarColor: 'bg-purple-100 text-purple-600',
        position: 'Product Manager'
      },
      {
        id: 'EMP-003',
        name: 'Robert Johnson',
        email: 'robert@example.com',
        monthlySalary: 4500, // $4500 monthly
        avatarColor: 'bg-green-100 text-green-600',
        position: 'UX Designer'
      }
    ];

    const generateAttendance = () => {
      const daysInMonth = new Date(currentYear, selectedMonth, 0).getDate();
      const attendance = [];
      let workingDaysCount = 0;

      for (let day = 1; day <= daysInMonth; day++) {
        const date = `${currentYear}-${selectedMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const dayOfWeek = new Date(date).getDay();
        
        // Skip weekends (0=Sunday, 6=Saturday)
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          workingDaysCount++;
          employees.forEach(emp => {
            // Simulate some variation in working hours
            let clockIn = '09:00';
            let clockOut = '17:00';
            
            // Randomly adjust times for realism (±30 minutes)
            if (Math.random() > 0.7) {
              clockIn = `08:${Math.floor(30 + Math.random() * 30).toString().padStart(2, '0')}`;
            }
            if (Math.random() > 0.7) {
              clockOut = `17:${Math.floor(Math.random() * 30).toString().padStart(2, '0')}`;
            }

            // Simulate occasional absences (10% chance)
            const isAbsent = Math.random() > 0.9;
            
            attendance.push({
              empId: emp.id,
              date,
              clockIn: isAbsent ? null : clockIn,
              clockOut: isAbsent ? null : clockOut,
              status: isAbsent ? 'Absent' : 'Present'
            });
          });
        }
      }

      return { attendance, workingDaysCount };
    };

    const { attendance, workingDaysCount } = generateAttendance();
    const payrollRecords = attendance.map(record => {
      const employee = employees.find(e => e.id === record.empId);
      const hourlyRate = calculateHourlyRate(employee.monthlySalary, workingDaysCount);
      
      let hours = 0;
      let salary = 0;
      
      if (record.status === 'Present') {
        const result = calculateDailySalary(record.clockIn, record.clockOut, hourlyRate);
        hours = result.hours;
        salary = result.salary;
      }
      
      return {
        ...record,
        employeeName: employee.name,
        employeeId: employee.id,
        employeeEmail: employee.email,
        employeePosition: employee.position,
        avatarColor: employee.avatarColor,
        hoursWorked: hours,
        dailySalary: salary,
        hourlyRate: parseFloat(hourlyRate.toFixed(2)),
        monthlySalary: employee.monthlySalary
      };
    });

    setRecords(payrollRecords);
  }, [selectedMonth, currentYear]);

  // Filter records based on search
  const filteredRecords = records.filter(record => {
    return searchTerm === '' || 
      record.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) || 
      record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.employeeEmail.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Check if we're viewing a single employee
  const viewingSingleEmployee = () => {
    if (searchTerm === '') return false;
    
    const employeeIds = new Set();
    filteredRecords.forEach(record => employeeIds.add(record.employeeId));
    return employeeIds.size === 1;
  };

  // Calculate summary statistics for the filtered records
  const calculateSummary = () => {
    const employeeData = {};
    
    filteredRecords.forEach(record => {
      if (!employeeData[record.employeeId]) {
        employeeData[record.employeeId] = {
          name: record.employeeName,
          position: record.employeePosition,
          totalHours: 0,
          totalSalary: 0,
          workingDays: 0,
          absentDays: 0,
          monthlySalary: record.monthlySalary,
          avatarColor: record.avatarColor
        };
      }
      
      if (record.status === 'Present') {
        employeeData[record.employeeId].totalHours += record.hoursWorked;
        employeeData[record.employeeId].totalSalary += record.dailySalary;
        employeeData[record.employeeId].workingDays++;
      } else {
        employeeData[record.employeeId].absentDays++;
      }
    });
    
    return employeeData;
  };

  const employeeSummaries = calculateSummary();
  const isSingleEmployeeView = viewingSingleEmployee();
  const singleEmployeeSummary = isSingleEmployeeView ? 
    employeeSummaries[Object.keys(employeeSummaries)[0]] : null;

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
      {isSingleEmployeeView && singleEmployeeSummary && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className={`flex-shrink-0 h-16 w-16 rounded-full ${singleEmployeeSummary.avatarColor} flex items-center justify-center text-2xl font-medium`}>
              {singleEmployeeSummary.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800">{singleEmployeeSummary.name}</h2>
              <p className="text-gray-600">{singleEmployeeSummary.position}</p>
              <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Monthly Salary</p>
                  <p className="font-semibold">{formatCurrency(singleEmployeeSummary.monthlySalary)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Working Days</p>
                  <p className="font-semibold">{singleEmployeeSummary.workingDays}</p>
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
                    <FiDollarSign className="mr-1" /> Daily Salary
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
                      {new Date(record.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        record.status === 'Present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.status === 'Present' ? (
                        `${record.hoursWorked.toFixed(2)} hrs`
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                      {record.status === 'Present' ? (
                        <span className="text-green-600">{formatCurrency(record.dailySalary)}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    {searchTerm ? 'No records found for this employee' : 'Select an employee to view payroll details'}
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

      {/* Monthly Summary for Single Employee */}
      {isSingleEmployeeView && singleEmployeeSummary && (
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Payroll Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="border p-4 rounded-lg">
              <p className="text-sm text-gray-500">Base Salary</p>
              <p className="text-xl font-semibold">{formatCurrency(singleEmployeeSummary.monthlySalary)}</p>
            </div>
            <div className="border p-4 rounded-lg">
              <p className="text-sm text-gray-500">Days Worked</p>
              <p className="text-xl font-semibold">{singleEmployeeSummary.workingDays} days</p>
            </div>
            <div className="border p-4 rounded-lg">
              <p className="text-sm text-gray-500">Total Hours</p>
              <p className="text-xl font-semibold">{singleEmployeeSummary.totalHours.toFixed(2)} hrs</p>
            </div>
            <div className="border p-4 rounded-lg bg-blue-50">
              <p className="text-sm text-blue-600">Total Payable</p>
              <p className="text-xl font-semibold text-blue-700">
                {formatCurrency(singleEmployeeSummary.totalSalary)}
              </p>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Generate Pay Slip
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollReport;