const API_URL = `${process.env.REACT_APP_API_BASE_URL}/api/attendance`;

// Tab Open
export const tabOpen = async (employeeId) => {
  if (!employeeId) return;
  try {
    await fetch(`${API_URL}/api/tab-open`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId }),
    });
    console.log('tab Opened');
  } catch (err) {
    console.error('tab Open Error:', err);
  }
};

// Tab Close — using sendBeacon for reliability
export const tabClose = (employeeId) => {
  if (!employeeId) return;
  try {
    const blob = new Blob([JSON.stringify({ employeeId })], {
      type: 'application/json',
    });
    navigator.sendBeacon(`${API_URL}/api/tab-close`, blob);
    console.log('Tab Closed');
  } catch (err) {
    console.error('Tab Close Error:', err);
  }
};

// Heartbeat — Runs every 60 seconds to mark user active
export const heartbeat = async (employeeId) => {
  if (!employeeId) return;
  try {
    await fetch(`${API_URL}/api/heartbeat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId }),
    });
    console.log('Heartbeat sent');
  } catch (err) {
    console.error('Heartbeat Error:', err);
  }
};
