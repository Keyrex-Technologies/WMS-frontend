import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUsers, FaCheckCircle } from 'react-icons/fa';
import GPSMap from '../../components/GPSMap';

const mockEmployees = [
  { id: 1, name: 'John Doe', clockIn: '09:00 AM', clockOut: '05:00 PM', onTime: true },
  { id: 2, name: 'Jane Smith', clockIn: '09:30 AM', clockOut: '05:30 PM', onTime: false },
  { id: 3, name: 'Mike Johnson', clockIn: null, clockOut: null, onTime: false },
  { id: 4, name: 'Sarah Williams', clockIn: '08:55 AM', clockOut: '05:00 PM', onTime: true },
];

// Animation variants
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
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [attendanceToday, setAttendanceToday] = useState(0);
  const [pendingPayroll, setPendingPayroll] = useState(0);
  const [mapCenter, setMapCenter] = useState({ lat: 33.6844, lng: 73.0479 });
  const [zoneRadius] = useState(5);

  useEffect(() => {
    setTotalEmployees(mockEmployees.length);
    const clockedInCount = mockEmployees.filter(emp => emp.clockIn).length;
    setAttendanceToday(((clockedInCount / mockEmployees.length) * 100).toFixed(2));
    setPendingPayroll(12);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full sm:px-6 space-y-8"
    >
      {/* Quick Stats Section */}
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
              key={totalEmployees}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-3xl font-bold text-white mt-2"
            >
              {totalEmployees}
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
              key={attendanceToday}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-3xl font-bold text-white mt-2"
            >
              {attendanceToday}%
            </motion.p>
            <p className="text-sm text-white mt-1">{mockEmployees.filter(emp => emp.clockIn).length}/{mockEmployees.length} employees checked in</p>
          </div>
        </motion.div>

        {/* Pending Payroll Card */}
        {/* <motion.div
          variants={item}
          whileHover={cardHover}
          className="bg-gradient-to-r from-orange-400 to-red-500 p-6 rounded-lg shadow-lg flex items-center space-x-4"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <MdPendingActions className="text-white text-3xl" />
          </motion.div>
          <div>
            <h3 className="text-lg font-semibold text-white">Pending Payroll</h3>
            <motion.p
              key={pendingPayroll}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-3xl font-bold text-white mt-2"
            >
              {pendingPayroll}
            </motion.p>
            <p className="text-sm text-white mt-1">Requires approval</p>
          </div>
        </motion.div> */}
      </motion.div>

      {/* Today's Employee Attendance Table */}
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
                {mockEmployees.map((emp) => (
                  <motion.tr
                    key={emp.id}
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
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${emp.clockIn
                            ? emp.onTime
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                          }`}
                      >
                        {emp.clockIn
                          ? emp.onTime
                            ? 'On Time'
                            : 'Late'
                          : 'Absent'}
                      </motion.span>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </motion.table>
        </div>
      </motion.div>

      {/* Live GPS Map Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Live GPS Map</h3>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <GPSMap setLivePosition={setMapCenter} zoneRadius={zoneRadius} mapCenter={mapCenter} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default AdminHome;