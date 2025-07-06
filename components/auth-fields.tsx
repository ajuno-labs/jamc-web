"use client"

import { useState } from "react"
import { FieldError, UseFormRegisterReturn } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { useTranslations } from 'next-intl'

interface EmailFieldProps {
  id?: string
  register: UseFormRegisterReturn
  error?: FieldError
  disabled?: boolean
}

export function EmailField({ id = "email", register, error, disabled }: EmailFieldProps) {
  const t = useTranslations('SignInPage');
  
  return (
    <div className="space-y-2">
      <div className="relative">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            id={id}
            type="email"
            placeholder=" "
            {...register}
            className="peer h-11 pl-10"
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${id}-error` : undefined}
            disabled={disabled}
          />
        </div>
        <Label
          htmlFor={id}
          className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-background px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
        >
          {t('email')}
        </Label>
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-red-500">
          {error.message}
        </p>
      )}
    </div>
  )
}

interface PasswordFieldProps {
  id?: string
  register: UseFormRegisterReturn
  error?: FieldError
  disabled?: boolean
  label?: string
}

export function PasswordField({ 
  id = "password", 
  register, 
  error, 
  disabled,
  label 
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false)
  const t = useTranslations('SignInPage');

  return (
    <div className="space-y-2">
      <div className="relative">
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            id={id}
            type={showPassword ? "text" : "password"}
            placeholder=" "
            {...register}
            className="peer h-11 pl-10"
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${id}-error` : undefined}
            disabled={disabled}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 h-full pr-3 text-gray-500 hover:text-gray-700"
            aria-label={showPassword ? "Hide password" : "Show password"}
            disabled={disabled}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
        <Label
          htmlFor={id}
          className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-background px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
        >
          {label || t('password')}
        </Label>
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-red-500">
          {error.message}
        </p>
      )}
    </div>
  )
}
