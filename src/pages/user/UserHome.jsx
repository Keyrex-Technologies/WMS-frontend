import React, { useState, useEffect, useRef } from 'react';
import GPSMap from '../../components/GPSMap';
import { useSocket } from '../../context/SocketContext';
import Cookies from 'js-cookie';

const UserHome = () => {
  const { socket } = useSocket();
  const [isInZone, setIsInZone] = useState(false);
  const [isClockIn, setIsClockIn] = useState(false);
  const [livePosition, setLivePosition] = useState(null);
  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);
  const [timeWorked, setTimeWorked] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const clockInTimerRef = useRef(null);
  const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;

  const status = () => {
    if (!isClockIn) return "Absent";
    // if (clockInTime && clockInTime.getHours() > 9) return "Late";
    return "Present";
  };

  useEffect(() => {
    const handleCheckInSuccess = (data) => {
      if (!data?.result) return;

      const responseData = data.result.data || data.result.attendance;
      if (responseData) {
        setClockInTime(new Date(responseData.checkin_time));
        if (responseData.checkout_time) {
          setClockOutTime(new Date(responseData.checkout_time));
        }
        const savedTime = responseData.working_hours;
        const backendSeconds = Math.floor((responseData.working_hours || 0) * 3600);
        const initialTime = Math.max(backendSeconds, savedTime ? parseInt(savedTime) : 0);

        setTimeWorked(initialTime);
        setIsClockIn(true);
      }
    };

    const handleCheckOutSuccess = (data) => {
      if (!data?.result) return;

      const responseData = data.result.data || data.result.attendance;
      if (responseData) {
        setClockInTime(new Date(responseData.checkin_time));
        setClockOutTime(new Date(responseData.checkout_time));
        const savedTime = responseData.working_hours;
        const backendSeconds = Math.floor((responseData.working_hours || 0) * 3600);
        const initialTime = Math.max(backendSeconds, savedTime ? parseInt(savedTime) : 0);
        setTimeWorked(initialTime);
        setIsClockIn(false);
      }
    };

    socket.on("check-in-success", handleCheckInSuccess);
    socket.on("check-out-success", handleCheckOutSuccess);

    return () => {
      socket.off("check-in-success", handleCheckInSuccess);
      socket.off("check-out-success", handleCheckOutSuccess);
    };
  }, [socket]);

  // Timer for counting working time
  useEffect(() => {
    if (isClockIn) {
      clockInTimerRef.current = setInterval(() => {
        setTimeWorked(prev => {
          const newTime = prev + 1;
          return newTime;
        });
      }, 1000);
    } else {
      clearInterval(clockInTimerRef.current);
    }

    return () => clearInterval(clockInTimerRef.current);
  }, [isClockIn]);

  // Update current time every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Auto clock-in/out based on zone
  useEffect(() => {
    if (isInZone && !isClockIn) {
      socket.emit('check-in', { userId: user._id, date: new Date() });
    } else if (!isInZone && isClockIn) {
      socket.emit('check-out', { userId: user._id, date: new Date() });
    }
  }, [isInZone, isClockIn]);

  const formatTimeWorked = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const formatCurrentTime = (time) => {
    return time.toLocaleTimeString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome back to WMS</h1>
        <p className="text-gray-600 mt-2">
          View your location based on your device's GPS and geolocation.
        </p>
      </div>

      <div className="flex flex-col justify-between mb-4 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-1">Status:
            <span className={`px-4 py-1 ml-3 text-xs rounded-full font-bold ${status() === "Present" ? "bg-green-500/10 text-green-400 border border-green-400/40" :
              status() === "Late" ? "bg-yellow-500/10 text-yellow-400 border border-yellow-400/40" :
                "bg-red-500/10 text-red-400 border border-red-400/40"
              }`}>
              {status()}
            </span>
          </h2>
        </div>
        <div>
          <p className="text-3xl font-bold text-center">{formatCurrentTime(currentTime)}</p>
        </div>
      </div>

      <div className="mt-6 p-6">
        <div className="text-center">
          <p className="text-2xl font-semibold flex flex-col gap-2">
            <span>Working Time:</span>
            <span>{formatTimeWorked(timeWorked)}</span>
          </p>
        </div>

        <div className="flex justify-between mt-4">
          <div className='w-fit text-center'>
            <p className="text-lg font-semibold">Clock In Time:</p>
            {clockInTime ? <p>{clockInTime.toLocaleTimeString()}</p> : "00:00:00"}
          </div>
          <div className='w-fit text-center'>
            <p className="text-lg font-semibold">Clock Out Time:</p>
            {clockOutTime ? <p>{clockOutTime.toLocaleTimeString()}</p> : "00:00:00"}
          </div>
        </div>
      </div>

      <GPSMap
        setLivePosition={setLivePosition}
        zoneRadius={10}
        mapCenter={{ lat: 33.5537031, lng: 73.1023577 }}
        isInZone={isInZone}
        setIsInZone={setIsInZone}
        userHeading={livePosition?.heading}
        isClockIn={isClockIn}
        setIsClockIn={setIsClockIn}
        setClockInTime={setClockInTime}
        setClockOutTime={setClockOutTime}
      />
    </div>
  );
};

export default UserHome;