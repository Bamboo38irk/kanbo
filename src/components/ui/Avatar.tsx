import clsx from 'clsx'
import type { User } from '@/types'
import styles from './Avatar.module.scss'

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('')
}

interface AvatarProps {
  user?: User
  size?: number
  className?: string
}

export default function Avatar({ user, size = 32, className }: AvatarProps) {
  if (!user) return null

  if (user.avatarUrl) {
    return (
      <img
        className={clsx(styles.avatar, className)}
        src={user.avatarUrl}
        alt={user.name}
        width={size}
        height={size}
      />
    )
  }

  return (
    <span
      className={clsx(styles.avatar, styles.initials, className)}
      style={{ width: size, height: size, background: user.color, fontSize: size * 0.4 }}
    >
      {getInitials(user.name)}
    </span>
  )
}
