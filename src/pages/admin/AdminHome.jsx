import React from "react";
import { Col, Row, Card } from "antd";
import { FaUsers, FaUserTie, FaChartLine, FaCalendarAlt } from "react-icons/fa"; // Icons from react-icons
import { Line } from "react-chartjs-2"; // For Area Chart
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement, ArcElement } from "chart.js";

// Registering the required components for chart.js
ChartJS.register(LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement, ArcElement);

// Sample Data for Graphs
const employeeAttendanceData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"], // Example months
  datasets: [
    {
      label: "Employee Attendance",
      data: [95, 97, 93, 98, 96, 99], // Example data
      borderColor: "#4CAF50", // Green
      backgroundColor: "rgba(76, 175, 80, 0.3)", // Gradient color
      fill: true, // Fills the area below the line
      tension: 0.3, // Smooths the curve
    },
  ],
};

const managerAttendanceData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Manager Attendance",
      data: [99, 98, 97, 96, 98, 100],
      borderColor: "#FF5722", // Orange
      backgroundColor: "rgba(255, 87, 34, 0.3)", // Gradient color
      fill: true, // Fills the area below the line
      tension: 0.3, // Smooths the curve
    },
  ],
};

const AdminHome = () => {
  const totalActiveEmployees = 120; // example count
  const totalManagers = 5; // example count

  return (
    <div className="admin-home-page" style={{ padding: "24px" }}>
      <Row gutter={24}>
        {/* Card for Total Active Employees */}
        <Col span={8}>
          <Card className="bg-primary text-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <FaUsers size={32} />
              <span className="text-xl font-semibold">Total Active Employees</span>
            </div>
            <h2 className="text-3xl font-bold">{totalActiveEmployees}</h2>
          </Card>
        </Col>

        {/* Card for Total Managers */}
        <Col span={8}>
          <Card className="bg-primary text-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <FaUserTie size={32} />
              <span className="text-xl font-semibold">Total Managers</span>
            </div>
            <h2 className="text-3xl font-bold">{totalManagers}</h2>
          </Card>
        </Col>

        {/* Upcoming Events or Announcements */}
        <Col span={8}>
          <Card className="bg-white text-black rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <FaCalendarAlt size={32} />
              <span className="text-xl font-semibold">Upcoming Announcements</span>
            </div>
            <ul className="list-disc pl-5">
              <li>Quarterly team review meeting scheduled for next Monday.</li>
              <li>New employee onboarding on Friday.</li>
            </ul>
          </Card>
        </Col>
      </Row>

      <Row gutter={24} style={{ marginTop: "24px" }}>
        {/* Graph for Employee Attendance */}
        <Col span={12}>
          <div className="bg-white p-4 rounded-lg shadow-lg h-[500px]">
            <div className="flex items-center gap-2 mb-4">
              <FaChartLine size={24} />
              <span className="text-lg font-semibold">Employee Attendance Trend</span>
            </div>
            <Line
              data={employeeAttendanceData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: (tooltipItem) => `${tooltipItem.raw}%`, // Format tooltip data
                    },
                  },
                },
                scales: {
                  x: {
                    grid: {
                      display: false, // Hide grid lines on x-axis
                    },
                  },
                  y: {
                    grid: {
                      display: false, // Hide grid lines on y-axis
                    },
                  },
                },
              }}
            />
          </div>
        </Col>

        {/* Graph for Manager Attendance */}
        <Col span={12}>
          <div className="bg-white p-4 rounded-lg shadow-lg h-[500px]">
            <div className="flex items-center gap-2 mb-4">
              <FaChartLine size={24} />
              <span className="text-lg font-semibold">Manager Attendance Trend</span>
            </div>
            <Line
              data={managerAttendanceData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: (tooltipItem) => `${tooltipItem.raw}%`, // Format tooltip data
                    },
                  },
                },
                scales: {
                  x: {
                    grid: {
                      display: false, // Hide grid lines on x-axis
                    },
                  },
                  y: {
                    grid: {
                      display: false, // Hide grid lines on y-axis
                    },
                  },
                },
              }}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default AdminHome;
