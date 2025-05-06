"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "@/components/ui/chart"

const data = [
  {
    name: "Mon",
    "Active Users": 42,
    "Questions Asked": 8,
  },
  {
    name: "Tue",
    "Active Users": 58,
    "Questions Asked": 12,
  },
  {
    name: "Wed",
    "Active Users": 51,
    "Questions Asked": 9,
  },
  {
    name: "Thu",
    "Active Users": 47,
    "Questions Asked": 5,
  },
  {
    name: "Fri",
    "Active Users": 63,
    "Questions Asked": 14,
  },
  {
    name: "Sat",
    "Active Users": 29,
    "Questions Asked": 3,
  },
  {
    name: "Sun",
    "Active Users": 25,
    "Questions Asked": 2,
  },
]

export function WeeklyActivityChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Active Users" fill="#6366f1" />
        <Bar dataKey="Questions Asked" fill="#f43f5e" />
      </BarChart>
    </ResponsiveContainer>
  )
}
