import { Check, Plus, Search, X } from 'lucide-react'
import { useState } from 'react'
import type { User } from '@/types'
import { firstName } from '@/utils/text'
import Avatar from './Avatar'
import Dropdown from './Dropdown'
import styles from './PeoplePicker.module.scss'

interface PeoplePickerProps {
  users: User[]
  selectedIds: string[]
  onChange: (ids: string[]) => void
  addLabel: string
  currentUserId?: string | null
}

export default function PeoplePicker({ users, selectedIds, onChange, addLabel, currentUserId }: PeoplePickerProps) {
  const [query, setQuery] = useState('')

  const selected = users.filter((user) => selectedIds.includes(user.id))
  const found = users.filter((user) => user.name.toLowerCase().includes(query.trim().toLowerCase()))

  function toggle(id: string) {
    onChange(selectedIds.includes(id) ? selectedIds.filter((item) => item !== id) : [...selectedIds, id])
  }

  return (
    <div className={styles.picker}>
      {selected.map((user) => (
        <span key={user.id} className={styles.chip}>
          <Avatar user={user} size={22} />
          {user.id === currentUserId ? 'Я' : firstName(user)}
          <button type="button" aria-label={`Убрать: ${user.name}`} onClick={() => toggle(user.id)}>
            <X size={12} />
          </button>
        </span>
      ))}

      <Dropdown
        label={addLabel}
        width={300}
        triggerClassName={styles.add}
        trigger={
          <>
            <Plus size={14} />
            {selected.length > 0 ? 'Добавить' : addLabel}
          </>
        }
      >
        <label className={styles.search}>
          <Search size={16} />
          <input
            autoFocus
            value={query}
            placeholder="Найти по имени"
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>

        <div className={styles.options}>
          {found.map((user) => (
            <button key={user.id} type="button" className={styles.option} onClick={() => toggle(user.id)}>
              <Avatar user={user} size={30} />
              <span className={styles.optionText}>
                <strong>{user.name}</strong>
                <small>{user.email}</small>
              </span>
              {selectedIds.includes(user.id) && <Check size={16} className={styles.check} />}
            </button>
          ))}
          {found.length === 0 && <p className={styles.empty}>Никого не нашли</p>}
        </div>
      </Dropdown>
    </div>
  )
}
