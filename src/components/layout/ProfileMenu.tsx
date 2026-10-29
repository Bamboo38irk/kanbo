import { ChevronDown, LogOut, RotateCcw, Settings } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { dataReset } from '@/app/initialData'
import Avatar from '@/components/ui/Avatar'
import Dropdown, { DropdownItem } from '@/components/ui/Dropdown'
import { createSeedData } from '@/data/seed'
import { logout } from '@/features/auth/authSlice'
import { closePanel } from '@/features/ui/uiSlice'
import { selectCurrentUser } from '@/features/users/usersSlice'
import SettingsDialog from './SettingsDialog'
import styles from './Menus.module.scss'

export default function ProfileMenu() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector(selectCurrentUser)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  function handleReset() {
    if (!window.confirm('Вернуть демо-данные к исходному состоянию? Ваши изменения пропадут.')) return
    dispatch(closePanel())
    dispatch(dataReset(createSeedData()))
    navigate('/')
  }

  return (
    <>
      <Dropdown
        label="Профиль"
        align="right"
        width={260}
        triggerClassName={styles.profileTrigger}
        trigger={
          <>
            <Avatar user={user} size={36} />
            <span className={styles.profileText}>
              <strong>{user?.name}</strong>
              <span>{user?.email}</span>
            </span>
            <ChevronDown size={18} className={styles.profileChevron} />
          </>
        }
      >
        {(close) => (
          <>
            <div className={styles.profileHeader}>
              <Avatar user={user} size={40} />
              <div>
                <strong>{user?.name}</strong>
                <span>{user?.email}</span>
              </div>
            </div>
            <DropdownItem
              icon={<Settings size={16} />}
              onClick={() => {
                close()
                setIsSettingsOpen(true)
              }}
            >
              Настройки
            </DropdownItem>
            <DropdownItem
              icon={<RotateCcw size={16} />}
              onClick={() => {
                close()
                handleReset()
              }}
            >
              Сбросить демо-данные
            </DropdownItem>
            <DropdownItem icon={<LogOut size={16} />} danger onClick={() => dispatch(logout())}>
              Выйти
            </DropdownItem>
          </>
        )}
      </Dropdown>
      {isSettingsOpen && <SettingsDialog onClose={() => setIsSettingsOpen(false)} />}
    </>
  )
}
