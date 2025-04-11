import React, { useState, useEffect } from 'react';
import { FiClock, FiDollarSign, FiCalendar, FiChevronDown } from 'react-icons/fi';

const ViewAttendance = () => {
    const [records, setRecords] = useState([]);
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
        const employee = {
            id: 'EMP-001',
            name: 'John Doe',
            email: 'john@example.com',
            monthlySalary: 5000, // $5000 monthly
            avatarColor: 'bg-blue-100 text-blue-600',
            position: 'Software Engineer'
        };

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
                        empId: employee.id,
                        date,
                        clockIn: isAbsent ? null : clockIn,
                        clockOut: isAbsent ? null : clockOut,
                        status: isAbsent ? 'Absent' : 'Present'
                    });
                }
            }

            return { attendance, workingDaysCount };
        };

        const { attendance, workingDaysCount } = generateAttendance();
        const payrollRecords = attendance.map(record => {
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

    // Calculate summary statistics
    const calculateSummary = () => {
        let summary = {
            name: '',
            position: '',
            totalHours: 0,
            totalSalary: 0,
            workingDays: 0,
            absentDays: 0,
            monthlySalary: 0,
            avatarColor: ''
        };

        records.forEach(record => {
            if (!summary.name) {
                summary = {
                    ...summary,
                    name: record.employeeName,
                    position: record.employeePosition,
                    monthlySalary: record.monthlySalary,
                    avatarColor: record.avatarColor
                };
            }

            if (record.status === 'Present') {
                summary.totalHours += record.hoursWorked;
                summary.totalSalary += record.dailySalary;
                summary.workingDays++;
            } else {
                summary.absentDays++;
            }
        });

        return summary;
    };

    const employeeSummary = calculateSummary();

    // Pagination
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = records.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(records.length / recordsPerPage);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Employee Attendance</h1>
                <p className="text-gray-600 mt-2">
                    View attendance and payroll for selected month
                </p>
            </div>

            {/* Month Selector */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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

            {/* Employee Summary Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className={`flex-shrink-0 h-16 w-16 rounded-full ${employeeSummary.avatarColor} flex items-center justify-center text-2xl font-medium`}>
                        {employeeSummary.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-800">{employeeSummary.name}</h2>
                        <p className="text-gray-600">{employeeSummary.position}</p>
                        <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Monthly Salary</p>
                                <p className="font-semibold">{formatCurrency(employeeSummary.monthlySalary)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Working Days</p>
                                <p className="font-semibold">{employeeSummary.workingDays}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Absent Days</p>
                                <p className="font-semibold">{employeeSummary.absentDays}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Hours</p>
                                <p className="font-semibold">{employeeSummary.totalHours.toFixed(2)} hrs</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-600">Estimated Monthly Pay</p>
                        <p className="text-2xl font-bold text-blue-700">
                            {formatCurrency(employeeSummary.totalSalary)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Attendance Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
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
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                        No attendance records found for selected month
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {records.length > 0 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-sm text-gray-500">
                        Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, records.length)} of {records.length} records
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

export default ViewAttendance;