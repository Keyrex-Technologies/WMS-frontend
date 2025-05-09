import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUsers, FaCheckCircle } from 'react-icons/fa';
import { getStats, getTodaysAttendance } from '../../utils/attendance';
import Cookies from 'js-cookie';
import { getOrigins, setOrigins } from '../../utils/origins'
import { toast } from 'react-toastify';
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

const DashbaordHome = () => {
  const [todaysAttendance, setTodaysAttendance] = useState([]);
  const [originData, setOriginData] = useState({ lat: "", lng: "" });
  const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;
  const [stats, seStats] = useState({
    totalEmployees: 0,
    presentCount: 0,
    attendancePercentage: 0,
  });

  const handleChangeLocation = (e) => {
    const { name, value } = e.target;
    setOriginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitLocation = async (e) => {
    e.preventDefault();
    try {
      const response = await setOrigins(originData);
      if(response.status){
        toast.success(response.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.error || "Something went wrong!");
    }
  };

  const fetchStats = async () => {
    const response = await getStats();
    if (response.status) {
      seStats(response.data)
    }
  }

  const fetchTodaysAttendance = async () => {
    const response = await getTodaysAttendance();
    if (response.status && Array.isArray(response.data?.attendance)) {
      const formatted = response.data.attendance.map(item => {
        const workingHoursFloat = item.working_hours || 0; // in hours
        const totalSeconds = Math.floor(workingHoursFloat * 3600);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);

        const workingHours = `${hours}h ${minutes}m`;

        return {
          id: item._id,
          employeeId: item.employeeId,
          name: item.employeeName,
          email: item.email,
          clockIn: item.checkin_time
            ? new Date(item.checkin_time).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })
            : null,
          clockOut: item.checkout_time
            ? new Date(item.checkout_time).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })
            : null,
          working_hour: workingHours,
          working_hour_in_seconds: totalSeconds,
          status: item.status === 'in' ? 'Clock In' : 'Clock Out',
        };
      });

      setTodaysAttendance(formatted);
    }
  };

  const fetchOrigins = async () => {
    try {
      const res = await getOrigins();
      if (res?.status) {
        setOriginData(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch origins:", err);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchTodaysAttendance();
    fetchOrigins();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full sm:px-6 space-y-8 mb-10"
    >
      {user.role === "admin" && (
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          onSubmit={handleSubmitLocation}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h2 className="text-xl font-bold mb-4">Update Origin Location</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Latitude</label>
              <input
                type="number"
                name="lat"
                value={originData.lat}
                onChange={handleChangeLocation}
                className="w-full border border-gray-300 rounded-full px-3 py-2 text-sm outline-none"
                step="0.000001"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Longitude</label>
              <input
                type="number"
                name="lng"
                value={originData.lng}
                onChange={handleChangeLocation}
                className="w-full border border-gray-300 rounded-full px-3 py-2 text-sm outline-none"
                step="0.000001"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-full"
          >
            Save Location
          </button>
        </motion.form>

      )}

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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Emp_id</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clock In</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clock Out</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Working Hours</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </motion.tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence>
                {todaysAttendance.length > 0 ? (
                  todaysAttendance?.map((emp, index) => (
                    <motion.tr
                      key={index}
                      whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <span className="text-gray-400">{emp.employeeId}</span>
                        </div>
                      </td>

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
                        <div className="text-sm text-gray-900">
                          {emp.working_hour}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <motion.span
                          initial={{ scale: 0.9 }}
                          animate={{ scale: 1 }}
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${emp.status === "Clock In"
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                            }`}
                        >
                          {emp.status}
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

export default DashbaordHome;