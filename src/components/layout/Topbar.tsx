import { Link } from 'react-router'
import NotificationsMenu from '@/features/notifications/NotificationsMenu'
import Logo from './Logo'
import ProfileMenu from './ProfileMenu'
import styles from './Topbar.module.scss'

export default function Topbar() {
  return (
    <header className={styles.topbar}>
      <Link to="/" aria-label="На главную">
        <Logo />
      </Link>
      <div className={styles.actions}>
        <NotificationsMenu />
        <ProfileMenu />
      </div>
    </header>
  )
}
