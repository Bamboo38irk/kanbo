import clsx from 'clsx'
import { CalendarDays, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useState } from 'react'
import {
  WEEK_DAYS,
  addDays,
  formatLongDate,
  formatMonth,
  fromDateKey,
  getCalendarDays,
  getMonthStart,
  toDateKey,
} from '@/utils/date'
import Dropdown from './Dropdown'
import IconButton from './IconButton'
import styles from './DatePicker.module.scss'

interface DatePickerProps {
  value: string
  onChange: (value: string) => void
}

export default function DatePicker({ value, onChange }: DatePickerProps) {
  const [month, setMonth] = useState(() => getMonthStart(value ? fromDateKey(value) : new Date()))
  const today = toDateKey(new Date())

  const shortcuts = [
    { title: 'Сегодня', key: today },
    { title: 'Завтра', key: toDateKey(addDays(new Date(), 1)) },
    { title: 'Через неделю', key: toDateKey(addDays(new Date(), 7)) },
  ]

  function changeMonth(diff: number) {
    setMonth(new Date(month.getFullYear(), month.getMonth() + diff, 1))
  }

  return (
    <span className={styles.wrapper}>
      <Dropdown
        label="Выбрать срок"
        width={288}
        triggerClassName={clsx(styles.trigger, !value && styles.empty)}
        trigger={
          <>
            <CalendarDays size={16} />
            {value ? formatLongDate(value) : 'Без срока'}
          </>
        }
      >
        {(close) => {
          function select(key: string) {
            onChange(key)
            close()
          }

          return (
            <div className={styles.picker}>
              <div className={styles.header}>
                <IconButton label="Предыдущий месяц" onClick={() => changeMonth(-1)}>
                  <ChevronLeft size={18} />
                </IconButton>
                <strong>{formatMonth(month)}</strong>
                <IconButton label="Следующий месяц" onClick={() => changeMonth(1)}>
                  <ChevronRight size={18} />
                </IconButton>
              </div>

              <div className={styles.weekDays}>
                {WEEK_DAYS.map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>

              <div className={styles.days}>
                {getCalendarDays(month).map((day) => (
                  <button
                    key={day.key}
                    type="button"
                    className={clsx(
                      styles.day,
                      !day.isCurrentMonth && styles.otherMonth,
                      day.key === today && styles.today,
                      day.key === value && styles.selected,
                    )}
                    onClick={() => select(day.key)}
                  >
                    {day.day}
                  </button>
                ))}
              </div>

              <div className={styles.shortcuts}>
                {shortcuts.map((item) => (
                  <button key={item.title} type="button" onClick={() => select(item.key)}>
                    {item.title}
                  </button>
                ))}
              </div>
            </div>
          )
        }}
      </Dropdown>
      {value && (
        <IconButton label="Убрать срок" className={styles.clear} onClick={() => onChange('')}>
          <X size={16} />
        </IconButton>
      )}
    </span>
  )
}
