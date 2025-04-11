import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaClock, FaCheckCircle, FaTimesCircle, FaMapMarkedAlt } from 'react-icons/fa';
import GPSMap from '../../components/GPSMap';

const UserDashboard = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mapCenter, setMapCenter] = useState({ lat: 33.6844, lng: 73.0479 });
  const [zoneRadius] = useState(10); // 10 meter radius
  const [isInZone, setIsInZone] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);
  const [todayRecord, setTodayRecord] = useState(null);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [timeInZone, setTimeInZone] = useState(0);

  // Office coordinates
  const officeLocation = { lat: 33.6844, lng: 73.0479 };

  // Format time as HH:MM:SS
  const formatTime = (date) => {
    if (!date) return '00:00:00';
    return date.toLocaleTimeString('en-US', { hour12: false });
  };

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      // Update time in zone if clocked in
      if (isClockedIn && isInZone) {
        setTimeInZone(prev => prev + 1);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isClockedIn, isInZone]);

  // Handle zone entry/exit
  useEffect(() => {
    if (isInZone && !isClockedIn) {
      // Automatic clock in when entering zone
      handleClockIn();
    } else if (!isInZone && isClockedIn) {
      // Automatic clock out when exiting zone
      handleClockOut();
    }
  }, [isInZone]);

  // Initialize today's record
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayRec = {
      date: today,
      clockIn: null,
      clockOut: null,
      status: 'Absent',
      location: null,
      timeInZone: 0
    };
    setTodayRecord(todayRec);
    setAttendanceData([todayRec]);
  }, []);

  const handleClockIn = () => {
    const now = new Date();
    setClockInTime(now);
    setIsClockedIn(true);
    setTimeInZone(0);
    
    const updatedRecord = {
      ...todayRecord,
      clockIn: formatTime(now),
      status: 'On-Time',
      location: mapCenter
    };
    
    setTodayRecord(updatedRecord);
    setAttendanceData([updatedRecord]);
  };

  const handleClockOut = () => {
    const now = new Date();
    setClockOutTime(now);
    setIsClockedIn(false);
    
    const updatedRecord = {
      ...todayRecord,
      clockOut: formatTime(now),
      timeInZone: timeInZone
    };
    
    setTodayRecord(updatedRecord);
    setAttendanceData([updatedRecord]);
  };

  // Update live position from GPS
  const handlePositionUpdate = (position) => {
    setMapCenter(position);
    
    // Calculate distance from office (simplified for demo)
    const distance = Math.sqrt(
      Math.pow(position.lat - officeLocation.lat, 2) + 
      Math.pow(position.lng - officeLocation.lng, 2)
    ) * 100000; // Rough conversion to meters
    
    // setIsInZone(distance <= zoneRadius);
    setIsInZone(false);

  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'On-Time':
        return <FaCheckCircle className="text-green-500" />;
      case 'Late':
        return <FaClock className="text-yellow-500" />;
      case 'Absent':
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'On-Time':
        return 'bg-green-100 text-green-800';
      case 'Late':
        return 'bg-yellow-100 text-yellow-800';
      case 'Absent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full px-4 py-6 space-y-6"
    >
      {/* Current Status Card */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={`p-6 rounded-lg shadow-md ${getStatusColor(todayRecord?.status)}`}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-1">Current Status</h2>
            <p className="text-lg flex items-center gap-2">
              {getStatusIcon(todayRecord?.status)} 
              {isClockedIn ? 'Clocked In' : todayRecord?.status || 'Not Checked In'}
            </p>
            <p className="text-sm mt-2">
              {currentTime.toLocaleTimeString()} • {currentTime.toLocaleDateString()}
            </p>
          </div>
          
          {/* Digital Clocks */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="bg-white p-3 rounded-lg shadow-inner text-center">
              <p className="text-sm text-gray-600">Clock In</p>
              <p className="text-2xl font-mono font-bold">
                {todayRecord?.clockIn || '00:00:00'}
              </p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-inner text-center">
              <p className="text-sm text-gray-600">Clock Out</p>
              <p className="text-2xl font-mono font-bold">
                {todayRecord?.clockOut || '00:00:00'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Zone Status */}
        <div className="mt-4 flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isInZone ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm">
            {isInZone ? 'Inside office zone' : 'Outside office zone'} ({zoneRadius}m radius)
          </span>
        </div>
      </motion.div>

      {/* GPS Tracking Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-lg overflow-hidden"
      >
        <div className="p-4 bg-gray-50 border-b flex items-center">
          <FaMapMarkedAlt className="text-blue-500 mr-2" />
          <h3 className="text-lg font-semibold">Live Location Tracking</h3>
        </div>
        <div className="p-4 h-96">
          <GPSMap 
            setLivePosition={handlePositionUpdate} 
            zoneRadius={zoneRadius} 
            mapCenter={mapCenter}
          />
        </div>
        <div className="p-4 bg-gray-50 border-t text-sm">
          <p className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isInZone ? 'bg-green-500' : 'bg-red-500'}`}></span>
            {isInZone ? 'Currently inside office zone' : 'Currently outside office zone'}
          </p>
        </div>
      </motion.div>

      {/* Today's Attendance Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-lg shadow-lg overflow-hidden"
      >
        <div className="p-4 bg-gray-50 border-b">
          <h3 className="text-lg font-semibold">Today's Attendance</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border p-4 rounded-lg">
              <p className="text-sm text-gray-600">Clock In Time</p>
              <p className="text-xl font-bold">
                {todayRecord?.clockIn || '--:--:--'}
              </p>
            </div>
            <div className="border p-4 rounded-lg">
              <p className="text-sm text-gray-600">Clock Out Time</p>
              <p className="text-xl font-bold">
                {todayRecord?.clockOut || '--:--:--'}
              </p>
            </div>
            <div className="border p-4 rounded-lg">
              <p className="text-sm text-gray-600">Time in Zone</p>
              <p className="text-xl font-bold">
                {new Date(timeInZone * 1000).toISOString().substr(11, 8)}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UserDashboard;