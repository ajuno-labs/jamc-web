import { format } from "date-fns"

export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  return format(dateObj, "MMM d, yyyy 'at' HH:mm")
}

export function formatDateOnly(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  return format(dateObj, "MMM d, yyyy")
}

export function formatTimeOnly(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  return format(dateObj, "HH:mm")
} 
