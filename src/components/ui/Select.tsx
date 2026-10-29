import clsx from 'clsx'
import { Check, ChevronDown } from 'lucide-react'
import type { ReactNode } from 'react'
import type { Tone } from '@/types'
import Dropdown, { DropdownItem } from './Dropdown'
import styles from './Select.module.scss'

interface SelectOption {
  value: string
  label: string
  tone?: Tone
}

interface SelectProps {
  label: string
  value: string
  options: SelectOption[]
  onChange: (value: string) => void
  icon?: ReactNode
  variant?: 'field' | 'inline'
  width?: number
}

export default function Select({
  label,
  value,
  options,
  onChange,
  icon,
  variant = 'field',
  width = 220,
}: SelectProps) {
  const selected = options.find((option) => option.value === value)

  return (
    <Dropdown
      label={label}
      width={width}
      triggerClassName={clsx(styles.trigger, styles[variant])}
      trigger={
        <>
          {icon}
          <span className={styles.value} data-tone={selected?.tone}>
            {selected?.label}
          </span>
          <ChevronDown size={16} className={styles.chevron} />
        </>
      }
    >
      {(close) =>
        options.map((option) => (
          <DropdownItem
            key={option.value}
            onClick={() => {
              onChange(option.value)
              close()
            }}
          >
            <span className={styles.optionLabel} data-tone={option.tone}>
              {option.label}
            </span>
            {option.value === value && <Check size={16} className={styles.check} />}
          </DropdownItem>
        ))
      }
    </Dropdown>
  )
}
