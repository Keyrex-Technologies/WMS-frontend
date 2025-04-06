import React, { useState } from 'react';
import { FiDownload, FiFilter, FiCalendar, FiBarChart2, FiUsers, FiDollarSign } from 'react-icons/fi';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { motion } from 'framer-motion';

// Register Chart.js components
Chart.register(...registerables);

const GenerateReport = () => {
  const [activeReport, setActiveReport] = useState('attendance');
  const [dateRange, setDateRange] = useState({
    start: '2023-05-01',
    end: '2023-05-31'
  });

  // Sample data for reports
  const reportData = {
    attendance: {
      title: "Attendance Report",
      icon: <FiUsers />,
      summary: {
        totalEmployees: 45,
        averageAttendance: 92,
        lateArrivals: 18
      },
      chart: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
          {
            label: 'Present',
            data: [42, 43, 44, 41],
            backgroundColor: '#3B82F6',
            borderRadius: 6
          },
          {
            label: 'Absent',
            data: [3, 2, 1, 4],
            backgroundColor: '#EF4444',
            borderRadius: 6
          }
        ]
      }
    },
    payroll: {
      title: "Payroll Report",
      icon: <FiDollarSign />,
      summary: {
        totalPaid: 2450000,
        averageSalary: 54444,
        taxDeductions: 245000
      },
      chart: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [
          {
            label: 'Total Payroll (PKR)',
            data: [2200000, 2300000, 2350000, 2400000, 2450000],
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.3
          }
        ]
      }
    },
    productivity: {
      title: "Productivity Report",
      icon: <FiBarChart2 />,
      summary: {
        averageHours: 8.2,
        overtimeHours: 64,
        tasksCompleted: 328
      },
      chart: {
        labels: ['Morning', 'Afternoon', 'Evening', 'Night'],
        datasets: [
          {
            label: 'Productivity Level',
            data: [85, 92, 78, 65],
            backgroundColor: [
              '#3B82F6',
              '#10B981',
              '#F59E0B',
              '#EF4444'
            ],
            borderWidth: 1
          }
        ]
      }
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExport = () => {
    // Export functionality would go here
    console.log(`Exporting ${activeReport} report for`, dateRange);
  };

  return (
    <div className="w-full px-4 sm:px-6">
      <div className="max-w-7xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800">Reports Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Analyze and export workforce management data
          </p>
        </motion.div>

        {/* Report Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {Object.keys(reportData).map((reportKey) => (
            <motion.button
              key={reportKey}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveReport(reportKey)}
              className={`p-4 rounded-xl shadow-sm transition-all flex items-center gap-3 ${
                activeReport === reportKey
                  ? 'bg-white border border-blue-200 shadow-md'
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              <div className={`p-3 rounded-lg ${
                activeReport === reportKey ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
              }`}>
                {reportData[reportKey].icon}
              </div>
              <span className="font-medium text-gray-800">{reportData[reportKey].title}</span>
            </motion.button>
          ))}
        </div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-4 mb-6"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="font-medium text-gray-800 flex items-center gap-2">
              <FiFilter /> Report Filters
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <div className="flex items-center gap-2 w-full sm:w-64">
                <FiCalendar className="text-gray-400" />
                <input
                  type="date"
                  name="start"
                  value={dateRange.start}
                  onChange={handleDateChange}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-64">
                <FiCalendar className="text-gray-400" />
                <input
                  type="date"
                  name="end"
                  value={dateRange.end}
                  onChange={handleDateChange}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleExport}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg whitespace-nowrap"
              >
                <FiDownload /> Export Report
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Report Content */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Report Header */}
          <div className="border-b border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                {reportData[activeReport].icon}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{reportData[activeReport].title}</h2>
                <p className="text-gray-600">
                  {new Date(dateRange.start).toLocaleDateString()} - {new Date(dateRange.end).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            {Object.entries(reportData[activeReport].summary).map(([key, value]) => (
              <motion.div 
                key={key}
                whileHover={{ y: -3 }}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  {key.split(/(?=[A-Z])/).join(' ')}
                </h3>
                <p className="mt-1 text-2xl font-semibold text-gray-800">
                  {typeof value === 'number' && key.includes('total') 
                    ? `PKR ${value.toLocaleString()}` 
                    : typeof value === 'number' && key.includes('average') 
                      ? `PKR ${value.toLocaleString()}` 
                      : typeof value === 'number' 
                        ? value.toLocaleString() 
                        : `${value}%`}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Chart */}
          <div className="p-6">
            <div className="h-80">
              {activeReport === 'attendance' && (
                <Bar 
                  data={reportData.attendance.chart}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: function(value) {
                            return value + (activeReport === 'attendance' ? ' employees' : '');
                          }
                        }
                      }
                    }
                  }}
                />
              )}
              {activeReport === 'payroll' && (
                <Line 
                  data={reportData.payroll.chart}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: false,
                        ticks: {
                          callback: function(value) {
                            return 'PKR ' + value.toLocaleString();
                          }
                        }
                      }
                    }
                  }}
                />
              )}
              {activeReport === 'productivity' && (
                <Pie 
                  data={reportData.productivity.chart}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                    },
                  }}
                />
              )}
            </div>
          </div>

          {/* Detailed Data Table */}
          <div className="p-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Detailed Records</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {activeReport === 'attendance' ? 'Present' : activeReport === 'payroll' ? 'Amount' : 'Metric'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {activeReport === 'attendance' ? 'Absent' : activeReport === 'payroll' ? 'Tax' : 'Value'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <tr key={item}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(dateRange.start).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {activeReport === 'attendance' 
                          ? Math.floor(Math.random() * 45) 
                          : activeReport === 'payroll' 
                            ? `PKR ${Math.floor(Math.random() * 50000 + 20000).toLocaleString()}` 
                            : `${Math.floor(Math.random() * 100)}%`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {activeReport === 'attendance' 
                          ? 45 - Math.floor(Math.random() * 45) 
                          : activeReport === 'payroll' 
                            ? `PKR ${Math.floor(Math.random() * 5000).toLocaleString()}` 
                            : `${Math.floor(Math.random() * 10)} hrs`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          Math.random() > 0.3 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {Math.random() > 0.3 ? 'Completed' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateReport;