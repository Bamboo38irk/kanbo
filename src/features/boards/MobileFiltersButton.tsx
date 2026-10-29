import { SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import { useAppSelector } from '@/app/hooks'
import FiltersSheet from './FiltersSheet'
import styles from './MobileFiltersButton.module.scss'

export default function MobileFiltersButton() {
  const [isOpen, setIsOpen] = useState(false)
  const count = useAppSelector((state) => {
    const { search, status, sort, onlyMine } = state.ui
    return [search, status, sort !== 'manual', onlyMine].filter(Boolean).length
  })

  return (
    <>
      <button type="button" className={styles.button} onClick={() => setIsOpen(true)}>
        <SlidersHorizontal size={18} />
        Фильтры
        {count > 0 && <span className={styles.badge}>{count}</span>}
      </button>
      {isOpen && <FiltersSheet onClose={() => setIsOpen(false)} />}
    </>
  )
}
