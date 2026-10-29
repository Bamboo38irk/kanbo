import clsx from 'clsx'
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import styles from './Dropdown.module.scss'

interface DropdownProps {
  label: string
  trigger: ReactNode
  triggerClassName?: string
  align?: 'left' | 'right'
  width?: number
  children: ReactNode | ((close: () => void) => ReactNode)
}

export default function Dropdown({
  label,
  trigger,
  triggerClassName,
  align = 'left',
  width = 240,
  children,
}: DropdownProps) {
  const [anchor, setAnchor] = useState<DOMRect | null>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const isOpen = anchor !== null

  const close = () => setAnchor(null)

  function open() {
    setAnchor(buttonRef.current!.getBoundingClientRect())
  }

  useLayoutEffect(() => {
    const panel = panelRef.current
    if (!anchor || !panel) return

    const spaceBelow = window.innerHeight - anchor.bottom - 14
    const spaceAbove = anchor.top - 14
    const openUp = panel.offsetHeight > spaceBelow && spaceAbove > spaceBelow

    panel.style.maxHeight = `${openUp ? spaceAbove : spaceBelow}px`
    if (openUp) {
      panel.style.bottom = `${window.innerHeight - anchor.top + 6}px`
    } else {
      panel.style.top = `${anchor.bottom + 6}px`
    }
  }, [anchor])

  useEffect(() => {
    if (!isOpen) return

    function handleMouseDown(event: MouseEvent) {
      const target = event.target as Node
      if (!panelRef.current?.contains(target) && !buttonRef.current?.contains(target)) {
        setAnchor(null)
      }
    }

    function handleScroll(event: Event) {
      if (!panelRef.current?.contains(event.target as Node)) setAnchor(null)
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setAnchor(null)
    }

    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('keydown', handleKeyDown)
    window.addEventListener('scroll', handleScroll, true)
    window.addEventListener('resize', close)
    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('scroll', handleScroll, true)
      window.removeEventListener('resize', close)
    }
  }, [isOpen])

  const panelWidth = Math.min(width, window.innerWidth - 16)
  const panelLeft = anchor
    ? Math.max(8, Math.min(align === 'right' ? anchor.right - width : anchor.left, window.innerWidth - width - 8))
    : 0

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={triggerClassName}
        aria-label={label}
        aria-expanded={isOpen}
        onClick={(event) => {
          event.stopPropagation()
          if (isOpen) {
            close()
          } else {
            open()
          }
        }}
      >
        {trigger}
      </button>

      {anchor &&
        createPortal(
          <div
            ref={panelRef}
            className={styles.panel}
            style={{ width: panelWidth, left: panelLeft }}
            data-floating
            onClick={(event) => event.stopPropagation()}
          >
            {typeof children === 'function' ? children(close) : children}
          </div>,
          document.body,
        )}
    </>
  )
}

interface DropdownItemProps {
  icon?: ReactNode
  danger?: boolean
  onClick: () => void
  children: ReactNode
}

export function DropdownItem({ icon, danger, onClick, children }: DropdownItemProps) {
  return (
    <button type="button" className={clsx(styles.item, danger && styles.danger)} onClick={onClick}>
      {icon}
      {children}
    </button>
  )
}

export function DropdownLabel({ children }: { children: ReactNode }) {
  return <div className={styles.label}>{children}</div>
}
