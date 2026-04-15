'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface InputFieldProps {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
  placeholder?: string
  className?: string
  disabled?: boolean
  required?: boolean
  autoComplete?: string
  labelSuffix?: React.ReactNode
  inputSuffix?: React.ReactNode
}

export default function InputField({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  className,
  disabled,
  required,
  autoComplete,
  labelSuffix,
  inputSuffix,
}: InputFieldProps) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-1.5">
        <Label
          htmlFor={name}
          className="text-xs font-medium tracking-wider uppercase text-slate-400 block"
        >
          {label}
        </Label>
        {labelSuffix}
      </div>
      <div className="relative">
        <Input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          className={`h-11 bg-white/5 border-white/10 text-slate-100 placeholder:text-slate-600 focus-visible:ring-blue-600/20 focus-visible:border-blue-600 focus-visible:bg-blue-600/5 rounded-lg text-sm font-light transition ${
            inputSuffix ? 'pr-11' : ''
          }`}
        />
        {inputSuffix && (
          <div className="absolute right-0 top-0 h-11 w-11 flex items-center justify-center">
            {inputSuffix}
          </div>
        )}
      </div>
    </div>
  )
}