import React, { useState, useEffect, useRef } from 'react';
import GPSMap from '../../components/GPSMap';
import { useSocket } from '../../context/SocketContext';
import Cookies from 'js-cookie';

const UserHome = () => {
  const [isInZone, setIsInZone] = useState(false);
  const [isClockIn, setIsClockIn] = useState(false);
  const [livePosition, setLivePosition] = useState(null);
  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);
  const [timeWorked, setTimeWorked] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const clockInTimerRef = useRef(null);
  const { socket } = useSocket();
  const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;

  const status = () => {
    if (!isClockIn) return "Absent";
    if (clockInTime && clockInTime.getHours() > 9) return "Late"; // Assume the workday starts at 9 AM
    return "Present";
  };

  const handleIn = () => {
    socket.emit('check-in', { userId: user._id, date: new Date() })
  }

  const handleOut = () => {
    socket.emit('check-out', { userId: user._id, date: new Date() })
  }

  // Timer effect for clocked-in employees
  useEffect(() => {
    if (isClockIn) {
      socket.on("check-in-success", (data) => {
        if (data) {
          const workingHour = data.result?.data?.working_hours || data.result?.attendance?.working_hours;
          const workedMinutes = workingHour * 60;
          const workedSeconds = Math.floor(workedMinutes * 60); // convert to seconds
          setClockInTime(new Date(workedMinutes * 60 * 1000));
          setTimeWorked((prev) => prev + workedSeconds);

        }
      });
      clockInTimerRef.current = setInterval(() => {
        setTimeWorked((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(clockInTimerRef.current);
    }

    return () => clearInterval(clockInTimerRef.current);
  }, [isClockIn]);

  // Update the current time for the digital clock every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Clock In/Out Logic
  useEffect(() => {
    if (isInZone && !isClockIn) {
      setIsClockIn(true);

      socket.on("check-in-success", (data) => {
        if (data) {
          if (data.result.message === "Check-in successful") {
            setClockInTime(new Date(data.result.data.checkin_time));
          } else {
            setClockInTime(new Date(data.result.attendance.checkin_time));
          }
        }
      })
      setClockOutTime(null);
    }

    if (!isInZone && isClockIn) {
      setIsClockIn(false);
      setClockOutTime(new Date());
    }
  }, [isInZone, isClockIn]);

  // Format time worked in HH:MM:SS
  const formatTimeWorked = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Format current time as HH:MM:SS for digital clock
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
            <span
              className={`px-4 py-1 ml-3 text-xs rounded-full font-bold ${status() === "Present"
                ? "bg-green-500/10 text-green-400 border border-green-400/40"
                : status() === "Late"
                  ? "bg-yellow-500/10 text-yellow-400 border border-yellow-400/40"
                  : "bg-red-500/10 text-red-400 border border-red-400/40"
                }`}
            >
              {status()}
            </span>
          </h2>
        </div>
        <div>
          <p className="text-3xl font-bold text-center">{formatCurrentTime(currentTime)}</p>
        </div>
      </div>


      <div className="mt-6 p-6 ">
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

      <div className='space-x-4'>
        <button onClick={handleIn}>In</button>
        <button onClick={handleOut}>Out</button>
      </div>

      <GPSMap
        setLivePosition={setLivePosition}
        zoneRadius={10}
        mapCenter={{ lat: 33.6560128, lng: 73.0529792 }}
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
