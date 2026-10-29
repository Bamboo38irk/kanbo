import { useAppSelector } from '@/app/hooks'
import { selectUsers } from '@/features/users/usersSlice'
import Avatar from './Avatar'
import styles from './AvatarGroup.module.scss'

interface AvatarGroupProps {
  userIds: string[]
  max?: number
  size?: number
}

export default function AvatarGroup({ userIds, max = 3, size = 28 }: AvatarGroupProps) {
  const users = useAppSelector(selectUsers).filter((user) => userIds.includes(user.id))
  const rest = users.length - max

  return (
    <div className={styles.group}>
      {users.slice(0, max).map((user) => (
        <Avatar key={user.id} user={user} size={size} className={styles.item} />
      ))}
      {rest > 0 && (
        <span className={styles.more} style={{ width: size, height: size }}>
          +{rest}
        </span>
      )}
    </div>
  )
}
