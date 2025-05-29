"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "@/components/ui/chart"
import type { WeeklyActivityData } from '@/lib/types/dashboard'

interface WeeklyActivityChartProps {
  data: WeeklyActivityData[]
}

export function WeeklyActivityChart({ data }: WeeklyActivityChartProps) {
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
