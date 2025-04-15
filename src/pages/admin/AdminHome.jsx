import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUsers, FaCheckCircle } from 'react-icons/fa';
import { getStats, getTodaysAttendance } from '../../utils/attendance';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const cardHover = {
  scale: 1.03,
  transition: {
    type: "spring",
    stiffness: 300,
    damping: 10
  }
};

const AdminHome = () => {
  const [todaysAttendance, setTodaysAttendance] = useState([])
  const [stats, seStats] = useState({
    totalEmployees: 0,
    presentCount: 0,
    attendancePercentage: 0,
  });

  const fetchStats = async () => {
    const response = await getStats();
    if (response.status) {
      seStats(response.data)
    }
  }

  const fetchTodaysAttendance = async () => {
    const response = await getTodaysAttendance();
    if (response.status) {
      setTodaysAttendance(response.data)
    }
  }

  useEffect(() => {
    fetchStats();
    fetchTodaysAttendance()
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full sm:px-6 space-y-8"
    >
      {/* Quick Stats */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2  gap-6"
      >
        {/* Total Employees Card */}
        <motion.div
          variants={item}
          whileHover={cardHover}
          className="bg-gradient-to-r from-blue-400 to-indigo-600 p-6 rounded-lg shadow-lg flex items-center space-x-4"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
          >
            <FaUsers className="text-white text-3xl" />
          </motion.div>
          <div>
            <h3 className="text-lg font-semibold text-white">Total Employees</h3>
            <motion.p
              key={stats?.totalEmployees}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-3xl font-bold text-white mt-2"
            >
              {stats?.totalEmployees}
            </motion.p>
          </div>
        </motion.div>

        {/* Today's Attendance Card */}
        <motion.div
          variants={item}
          whileHover={cardHover}
          className="bg-gradient-to-r from-green-400 to-teal-500 p-6 rounded-lg shadow-lg flex items-center space-x-4"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <FaCheckCircle className="text-white text-3xl" />
          </motion.div>
          <div>
            <h3 className="text-lg font-semibold text-white">Today's Attendance</h3>
            <motion.p
              key={stats?.attendancePercentage}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-3xl font-bold text-white mt-2"
            >
              {stats?.attendancePercentage}%
            </motion.p>
            <p className="text-sm text-white mt-1">{stats?.presentCount}/{stats?.totalEmployees} employees checked in</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Today's Employee Attendance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Today's Employee Attendance</h3>

        <div className="overflow-x-auto">
          <motion.table
            className="min-w-full divide-y divide-gray-200"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <thead className="bg-gray-50">
              <motion.tr variants={item}>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clock In</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clock Out</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </motion.tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence>
                {todaysAttendance.length > 0 ? (
                  todaysAttendance?.map((emp) => (
                    <motion.tr
                      key={emp.employeeId}
                      variants={item}
                      whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-indigo-600 font-medium">{emp.name.charAt(0)}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{emp.name}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {emp.clockIn || <span className="text-gray-400">Not clocked in</span>}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {emp.clockOut || <span className="text-gray-400">Not clocked out</span>}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <motion.span
                          initial={{ scale: 0.9 }}
                          animate={{ scale: 1 }}
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${emp.status === "On-Time"
                            ? 'bg-green-100 text-green-800'
                            : emp.status === "Late" ?
                              'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                            }`}
                        >
                          {emp.status === "On-Time" ?
                            'On Time'
                            : emp.status === "Late" ?
                              'Late'
                              : 'Absent'}
                        </motion.span>
                      </td>
                    </motion.tr>
                  ))) : (
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
          </motion.table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminHome;