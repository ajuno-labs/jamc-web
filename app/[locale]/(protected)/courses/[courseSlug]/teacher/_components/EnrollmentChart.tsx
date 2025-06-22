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
import type { EnrollmentTrendData } from '@/lib/types/dashboard'

interface EnrollmentChartProps {
  data: EnrollmentTrendData[]
}

export function EnrollmentChart({ data }: EnrollmentChartProps) {
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
