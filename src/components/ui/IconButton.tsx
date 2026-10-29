import clsx from 'clsx'
import type { ButtonHTMLAttributes } from 'react'
import styles from './IconButton.module.scss'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
}

export default function IconButton({ label, className, children, ...props }: IconButtonProps) {
  return (
    <button type="button" aria-label={label} className={clsx(styles.button, className)} {...props}>
      {children}
    </button>
  )
}
