"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "@/components/ui/chart"

const data = [
  {
    name: "Week 1",
    "Total Enrolled": 45,
    "Active Students": 42,
  },
  {
    name: "Week 2",
    "Total Enrolled": 52,
    "Active Students": 48,
  },
  {
    name: "Week 3",
    "Total Enrolled": 61,
    "Active Students": 55,
  },
  {
    name: "Week 4",
    "Total Enrolled": 67,
    "Active Students": 59,
  },
  {
    name: "Week 5",
    "Total Enrolled": 75,
    "Active Students": 64,
  },
  {
    name: "Week 6",
    "Total Enrolled": 80,
    "Active Students": 68,
  },
  {
    name: "Week 7",
    "Total Enrolled": 87,
    "Active Students": 64,
  },
]

export function EnrollmentChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area type="monotone" dataKey="Total Enrolled" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
        <Area type="monotone" dataKey="Active Students" stroke="#22c55e" fill="#22c55e" fillOpacity={0.2} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
