import { Lock, User } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Navigate, useLocation } from 'react-router'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import Logo from '@/components/layout/Logo'
import Button from '@/components/ui/Button'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { login } from './authSlice'
import styles from './LoginPage.module.scss'

export default function LoginPage() {
  useDocumentTitle('Вход')

  const dispatch = useAppDispatch()
  const location = useLocation()
  const { userId, loading, error } = useAppSelector((state) => state.auth)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  if (userId) {
    return <Navigate to={location.state?.from ?? '/'} replace />
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    dispatch(login({ login: username.trim(), password }))
  }

  return (
    <div className={styles.page}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <Logo size={40} />
        <h1>Вход</h1>
        <p className={styles.subtitle}>Задачи для дома и семьи в одном месте</p>

        <label className={styles.field}>
          <User size={18} />
          <input
            value={username}
            placeholder="Логин"
            autoComplete="username"
            onChange={(event) => setUsername(event.target.value)}
          />
        </label>

        <label className={styles.field}>
          <Lock size={18} />
          <input
            type="password"
            value={password}
            placeholder="Пароль"
            autoComplete="current-password"
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        {error && <p className={styles.error}>{error}</p>}

        <Button type="submit" size="lg" block disabled={loading}>
          {loading ? 'Входим...' : 'Войти'}
        </Button>

        <p className={styles.note}>
          Тестовый доступ: логин <strong>user</strong>, пароль <strong>user123</strong>. Данные хранятся только в этом
          браузере.
        </p>
      </form>
    </div>
  )
}
