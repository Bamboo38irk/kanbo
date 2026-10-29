import clsx from 'clsx'
import { ArrowRightToLine } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import IconButton from './IconButton'
import { SidePanelContext, useCloseSidePanel } from './sidePanelContext'
import styles from './SidePanel.module.scss'

interface SidePanelProps {
  label: string
  onClose: () => void
  children: ReactNode
}

export default function SidePanel({ label, onClose, children }: SidePanelProps) {
  const panelRef = useRef<HTMLElement>(null)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !document.querySelector('[data-floating]')) setIsClosing(true)
    }

    function handleMouseDown(event: MouseEvent) {
      const target = event.target as Element
      if (panelRef.current?.contains(target) || target.closest('[data-floating], [data-panel-trigger]')) return
      setIsClosing(true)
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleMouseDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [])

  return (
    <SidePanelContext value={() => setIsClosing(true)}>
      <aside
        ref={panelRef}
        className={clsx(styles.panel, isClosing && styles.closing)}
        aria-label={label}
        onAnimationEnd={(event) => {
          if (isClosing && event.target === event.currentTarget) onClose()
        }}
      >
        {children}
      </aside>
    </SidePanelContext>
  )
}

export function SidePanelHeader({ children }: { children: ReactNode }) {
  const close = useCloseSidePanel()

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>{children}</div>
      <IconButton label="Закрыть" onClick={close}>
        <ArrowRightToLine size={20} />
      </IconButton>
    </header>
  )
}

export function SidePanelBody({ children }: { children: ReactNode }) {
  return <div className={styles.body}>{children}</div>
}

export function SidePanelFooter({ children }: { children: ReactNode }) {
  return <footer className={styles.footer}>{children}</footer>
}
