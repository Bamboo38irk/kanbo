import { Link } from 'react-router'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import styles from './NotFoundPage.module.scss'

export default function NotFoundPage() {
  useDocumentTitle('Страница не найдена')

  return (
    <div className={styles.page}>
      <span className={styles.code}>404</span>
      <h1>Такой страницы нет</h1>
      <p>Возможно, доску удалили или ссылка устарела.</p>
      <Link to="/" className={styles.link}>
        На главную
      </Link>
    </div>
  )
}
