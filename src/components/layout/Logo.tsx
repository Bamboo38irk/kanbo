import styles from './Logo.module.scss'

export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <span className={styles.logo}>
      <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="9" fill="#0c8ab0" />
        <rect x="7" y="7" width="5" height="18" rx="2.5" fill="#fff" />
        <rect x="13.5" y="7" width="5" height="12" rx="2.5" fill="#fff" opacity="0.8" />
        <rect x="20" y="7" width="5" height="8" rx="2.5" fill="#fff" opacity="0.6" />
      </svg>
      <span className={styles.text}>kanbo</span>
    </span>
  )
}
