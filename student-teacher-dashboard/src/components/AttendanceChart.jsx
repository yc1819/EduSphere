import React, { useEffect, useState } from "react";
import { getAttendance } from "../storage/attendanceStorage";

const AttendanceChart = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const records = getAttendance();

    // NO DATA
    if (!Array.isArray(records) || records.length === 0) {
      setChartData([]);
      return;
    }

    // LAST 7 UNIQUE DAYS
    const unique = [
      ...new Map(
        records.map((r) => [r.date, r])
      ).values(),
    ].slice(-7);

    const processed = unique.map((r) => ({
      date: r.date,
      percent: r.presentPercentage || 0,
    }));

    setChartData(processed);
  }, []);

  // EMPTY STATE
  if (!chartData.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow border dark:border-gray-700 w-full transition-all duration-300">

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-semibold text-black dark:text-white">
            Attendance Analysis
          </h3>

          <span className="text-sm text-gray-500 dark:text-gray-300">
            Last 7 Days
          </span>
        </div>

        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-300 text-sm">
            No attendance data available.
          </p>
        </div>
      </div>
    );
  }

  // SVG GRAPH
  const height = 320;
  const width = 900;
  const padding = 60;

  const maxPercent = 100;
  const minPercent = 0;

  const stepX =
    (width - padding * 2) /
    (chartData.length - 1);

  // GRAPH POINTS
  const points = chartData
    .map((p, i) => {
      const x = padding + i * stepX;

      const y =
        height -
        padding -
        ((p.percent - minPercent) /
          (maxPercent - minPercent)) *
          (height - padding * 2);

      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow border dark:border-gray-700 w-full transition-all duration-300 hover:shadow-xl">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-semibold text-black dark:text-white">
            Attendance Analysis
          </h3>

          <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
            Student attendance performance overview
          </p>
        </div>

        <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-4 py-2 rounded-xl text-sm font-medium">
          Last 7 Days
        </div>
      </div>

      {/* GRAPH */}
      <div className="overflow-x-auto">

        <svg
          width="100%"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          className="rounded-xl"
        >

          {/* GRID LINES */}
          {[20, 40, 60, 80, 100].map((v) => {
            const y =
              height -
              padding -
              ((v - minPercent) /
                (maxPercent - minPercent)) *
                (height - padding * 2);

            return (
              <g key={v}>

                <line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="#d1d5db"
                  strokeDasharray="5 5"
                />

                {/* Y LABEL */}
                <text
                  x={15}
                  y={y + 4}
                  fontSize="12"
                  fill="#9ca3af"
                >
                  {v}%
                </text>
              </g>
            );
          })}

          {/* AREA UNDER GRAPH */}
          <polygon
            fill="rgba(59,130,246,0.1)"
            points={`
              ${padding},${height - padding}
              ${points}
              ${width - padding},${height - padding}
            `}
          />

          {/* LINE */}
          <polyline
            fill="none"
            stroke="#2563eb"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />

          {/* DOTS */}
          {points.split(" ").map((pt, idx) => {
            const [x, y] = pt
              .split(",")
              .map(Number);

            return (
              <g key={idx}>

                {/* OUTER GLOW */}
                <circle
                  cx={x}
                  cy={y}
                  r="10"
                  fill="rgba(59,130,246,0.15)"
                />

                {/* INNER DOT */}
                <circle
                  cx={x}
                  cy={y}
                  r="5"
                  fill="#2563eb"
                />

                {/* VALUE */}
                <text
                  x={x}
                  y={y - 18}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#2563eb"
                  fontWeight="700"
                >
                  {chartData[idx].percent}%
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* DATE LABELS */}
      <div className="mt-6 flex justify-between text-sm text-gray-500 dark:text-gray-300 font-medium">

        {chartData.map((d, idx) => (
          <span key={idx}>
            {new Date(d.date).toLocaleDateString(
              "en-IN",
              {
                day: "2-digit",
                month: "short",
              }
            )}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AttendanceChart;