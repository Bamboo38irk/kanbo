import type { ReactNode } from 'react'
import styles from './EmptyState.module.scss'

export default function EmptyState({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className={styles.empty}>
      {icon}
      <p>{children}</p>
    </div>
  )
}
