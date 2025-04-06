import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUsers, FaRegClock, FaCheckCircle, FaDollarSign } from 'react-icons/fa';
import GPSMap from '../../components/GPSMap';

const mockEmployees = [
  { id: 1, name: 'John Doe', clockedIn: true, onTime: true },
  { id: 2, name: 'Jane Smith', clockedIn: true, onTime: false },
  { id: 3, name: 'Mike Johnson', clockedIn: false, onTime: false },
  { id: 4, name: 'Sarah Williams', clockedIn: true, onTime: true },
];

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

const ManagerHome = () => {
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [attendanceToday, setAttendanceToday] = useState(0);
  const [mapCenter, setMapCenter] = useState({ lat: 33.6844, lng: 73.0479 });
  const [zoneRadius] = useState(5);

  useEffect(() => {
    setTotalEmployees(mockEmployees.length);
    const clockedInCount = mockEmployees.filter(emp => emp.clockedIn).length;
    setAttendanceToday(((clockedInCount / mockEmployees.length) * 100).toFixed(2));
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
        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
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
            <p className="text-sm text-white mt-1">+5% from last month</p>
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
            <p className="text-sm text-white mt-1">{mockEmployees.filter(emp => emp.clockedIn).length}/80 employees checked in</p>
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
        <motion.div 
          className="space-y-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <AnimatePresence>
            {mockEmployees.map(emp => (
              <motion.div 
                key={emp.id}
                variants={item}
                whileHover={{ scale: 1.01 }}
                className="flex justify-between sm:flex-row flex-col gap-5 sm:items-center py-3 px-4 border-b border-b-black/10"
              >
                <div className="flex items-center space-x-2">
                  <motion.div
                    animate={{ rotate: emp.clockedIn ? 0 : [0, 10, -10, 0] }}
                    transition={emp.clockedIn ? {} : { repeat: Infinity, duration: 2 }}
                  >
                    <FaRegClock className="text-gray-500" />
                  </motion.div>
                  <p className="text-gray-700 font-medium">{emp.name}</p>
                </div>
                <motion.div 
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className={`flex items-center space-x-2 p-2 text-sm rounded-full ${emp.clockedIn ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
                >
                  {emp.clockedIn ? (
                    <>
                      <FaCheckCircle className="text-green-600" />
                      <span>Clocked In</span>
                    </>
                  ) : (
                    <>
                      <FaRegClock className="text-red-600" />
                      <span>Clocked Out</span>
                    </>
                  )}
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Live GPS Map Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Live GPS Map</h3>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <GPSMap setLivePosition={setMapCenter} zoneRadius={zoneRadius} mapCenter={mapCenter} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ManagerHome;
