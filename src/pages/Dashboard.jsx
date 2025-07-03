import React, { useEffect, useState } from 'react';
import '../styles/Dashboard.css';
import { format, toZonedTime } from 'date-fns-tz';

const Dashboard = () => {
  const employee = JSON.parse(localStorage.getItem('employee'));
  const employeeId = employee?._id;

  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  //Format time to hh:mm AM/PM
  const formatTime = (timeString) => {
    if (!timeString) return '--:--';
    try {
      const date = new Date(timeString);
      const zonedDate = toZonedTime(date, 'Asia/Kolkata');
      return format(zonedDate, 'hh:mm a', { timeZone: 'Asia/Kolkata' });
    } catch {
      return '--:--';
    }
  };

  //Get today's attendance
  const findTodayAttendance = () => {
    if (!attendanceLogs.length) return null;
    const today = new Date().toISOString().split('T')[0];
    return attendanceLogs.find((log) => log.checkIn?.startsWith(today)) || attendanceLogs[0];
  };

  const todayAttendance = findTodayAttendance();
  const latestCheckIn = todayAttendance?.checkIn ? formatTime(todayAttendance.checkIn) : '--:--';
  const isOnBreak = todayAttendance?.breaks?.some((b) => b.startTime && !b.endTime) ?? false;

  // Fetch Attendance Logs
  const fetchAttendanceLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/attendance/log/${employeeId}`);
      const data = await res.json();
      setAttendanceLogs(Array.isArray(data) ? data : []);
    } catch {
      setAttendanceLogs([]);
    } finally {
      setLoading(false);
    }
  };

  //Fetch Recent Activities
  const fetchActivities = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/activities/employee/${employeeId}`);
      const data = await res.json();
      setActivities(Array.isArray(data) ? data : []);
    } catch {
      setActivities([]);
    }
  };

  useEffect(() => {
    if (!employeeId) return;

    const interval = setInterval(() => {
      fetchAttendanceLogs();
      fetchActivities();
    }, 10000); //Refresh every 10 seconds

    // Initial fetch immediately on mount
    fetchAttendanceLogs();
    fetchActivities();

    return () => clearInterval(interval);
  }, [employeeId]);


  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good Morning';
    if (hour >= 12 && hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="dash-container">
      <p className="dash-timings-heading">Timings</p>

      {/* Header */}
      <div className="dash-header">
        <h1>Canova<span>CRM</span></h1>
        <p className="dash-greeting">{getGreeting()}</p>
        <h2>{employee?.firstName} {employee?.lastName}</h2>
      </div>
      <div className="dash-checkin-card">
        <div className="dash-checkin-left">
          <div>
            <p>Check-In</p>
            <p>{loading ? 'Loading...' : latestCheckIn}</p>
          </div>
          <div>
            <p>Check-Out</p>
            <p>--:--</p>
          </div>
        </div>
        <div className={`dash-indicator ${isOnBreak ? 'dash-red' : 'dash-green'}`}></div>
      </div>
      <div className="dash-break-status-card">
        <div className="dash-break-left">
          <div>
            <p>Break</p>
            <p>
              {todayAttendance?.breaks?.length
                ? formatTime(
                  todayAttendance.breaks[todayAttendance.breaks.length - 1]?.startTime
                )
                : '--:--'}
            </p>
          </div>
          <div>
            <p>Ended</p>
            <p>
              {todayAttendance?.breaks?.length
                ? formatTime(
                  todayAttendance.breaks[todayAttendance.breaks.length - 1]?.endTime
                )
                : '--:--'}
            </p>
          </div>
        </div>
        <div className={`dash-indicator ${isOnBreak ? 'dash-red' : 'dash-green'}`}></div>
      </div>

      {/* Break History */}
      <div className="dash-break-container">
        <div className="dash-break-history">
          {loading ? (
            <p>Loading...</p>
          ) : todayAttendance?.breaks?.length ? (
            todayAttendance.breaks.map((b, idx) => (
              <div className="dash-break-entry" key={b._id || idx}>
                <div className="dash-break-column">
                  <h4>Break</h4>
                  <span>{b.startTime ? formatTime(b.startTime) : '--:--'}</span>
                </div>
                <div className="dash-break-column">
                  <h4>Ended</h4>
                  <span>{b.endTime ? formatTime(b.endTime) : '--:--'}</span>
                </div>
                <div className="dash-break-column">
                  <h4>Date</h4>
                  <span>{b.startTime ? new Date(b.startTime).toLocaleDateString() : '--'}</span>
                </div>
              </div>
            ))
          ) : (
            <p>No Breaks Today</p>
          )}
        </div>
      </div>
      <p className="dash-recent-heading">Recent Activity</p>

      {/* Recent Activity */}
      <div className="dash-recent-activity">
        <div className="dash-activity-box">
          {activities.length === 0 ? (
            <p>No Activity</p>
          ) : (
            activities.map((act, idx) => (
              <div className="dash-activity-item" key={act._id || idx}>
                <div className="dash-dot"></div>
                <p>
                  {act.message} — <span>{act.time}</span>
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
