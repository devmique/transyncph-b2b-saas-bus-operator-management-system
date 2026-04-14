// components/ui/InputField.tsx
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
}

export default function InputField({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  className,
}: InputFieldProps) {
  return (
    <div className={className}>
      <Label
        htmlFor={name}
        className="text-xs font-medium tracking-wider uppercase text-slate-500 mb-1.5 block"
      >
        {label}
      </Label>
      <Input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="bg-white/5 border-white/10 text-slate-200 placeholder:text-slate-600 focus-visible:ring-blue-500/20 focus-visible:border-blue-500/50"
      />
    </div>
  )
}