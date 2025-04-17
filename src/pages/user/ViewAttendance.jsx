import React, { useState, useEffect } from 'react';
import { FiClock, FiCalendar, FiChevronDown } from 'react-icons/fi';
import { getPayroll } from '../../utils/attendance';
import Cookies from 'js-cookie';
import { BiPound } from 'react-icons/bi';

const ViewAttendance = () => {
    const [records, setRecords] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;
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

    const calculateSummary = () => {
        if (records.length === 0) {
            return {
                name: '',
                position: '',
                presentDays: 0,
                absentDays: 0,
                totalSalary: 0,
                totalHours: 0
            };
        }

        const summary = {
            name: records[0]?.employeeName || '',
            position: records[0]?.role || '',
            presentDays: 0,
            absentDays: 0,
            totalSalary: 0,
            totalHours: 0
        };

        records.forEach(record => {
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

    const employeeSummary = calculateSummary();

    const fetchPayrolls = async (month) => {
        if (!user?._id) return;
        
        setLoading(true);
        try {
            const response = await getPayroll(user._id, month);
            
            if (response.status) {
                console.log(response.data.attendance)
                setRecords(response.data.attendance || []);
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
                            const month = parseInt(e.target.value);
                            setSelectedMonth(month);
                            setCurrentPage(1);
                        }}
                        disabled={loading}
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
                    <div className="flex-shrink-0 h-16 w-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-medium">
                        {employeeSummary.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-800">{employeeSummary.name}</h2>
                        <p className="text-gray-600 capitalize">{employeeSummary.position}</p>
                        <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Present Days</p>
                                <p className="font-semibold">{employeeSummary.presentDays}</p>
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
                        <p className="text-sm text-blue-600">Monthly Earnings</p>
                        <p className="text-2xl font-bold text-blue-700">
                            {formatCurrency(employeeSummary.totalSalary)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Attendance Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading attendance data...</div>
                ) : (
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
                                            <BiPound className="mr-1" /> Daily Salary
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentRecords.length > 0 ? (
                                    currentRecords.map((record) => (
                                        <tr key={`${record._id}`} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(record.date)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs rounded-full ${
                                                    record.status === 'Present' 
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
                                        <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                            No attendance records found for selected month
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
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