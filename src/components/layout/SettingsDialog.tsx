import { ImageUp, Trash2 } from 'lucide-react'
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import form from '@/components/ui/Form.module.scss'
import Modal from '@/components/ui/Modal'
import { selectCurrentUser, updateProfile } from '@/features/users/usersSlice'
import { resizeImage } from '@/utils/image'
import styles from './SettingsDialog.module.scss'

const MAX_FILE_SIZE = 5 * 1024 * 1024

export default function SettingsDialog({ onClose }: { onClose: () => void }) {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectCurrentUser)
  const [name, setName] = useState(user?.name ?? '')
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl)
  const [error, setError] = useState('')

  if (!user) return null

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Нужна картинка: JPG, PNG или WebP')
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('Файл больше 5 МБ')
      return
    }

    try {
      setAvatarUrl(await resizeImage(file))
      setError('')
    } catch (resizeError) {
      setError((resizeError as Error).message)
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    if (!name.trim()) {
      setError('Введите имя')
      return
    }

    dispatch(updateProfile({ id: user!.id, name: name.trim(), avatarUrl }))
    onClose()
  }

  return (
    <Modal
      title="Настройки профиля"
      onClose={onClose}
      width={480}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Отмена
          </Button>
          <Button type="submit" form="settings-form">
            Сохранить
          </Button>
        </>
      }
    >
      <form id="settings-form" className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.photo}>
          <Avatar user={{ ...user, name: name || user.name, avatarUrl }} size={72} />
          <div className={styles.photoActions}>
            <label className={styles.upload}>
              <ImageUp size={16} />
              Загрузить фото
              <input type="file" accept="image/*" className="visually-hidden" onChange={handleFileChange} />
            </label>
            {avatarUrl && (
              <Button variant="ghost" size="sm" icon={<Trash2 size={15} />} onClick={() => setAvatarUrl(undefined)}>
                Удалить
              </Button>
            )}
          </div>
        </div>

        <label className={form.field}>
          <span className={form.label}>Имя</span>
          <input
            className={form.input}
            value={name}
            onChange={(event) => {
              setName(event.target.value)
              setError('')
            }}
          />
        </label>

        <div className={form.field}>
          <span className={form.label}>Почта</span>
          <span className={styles.email}>{user.email}</span>
        </div>

        {error && <p className={form.error}>{error}</p>}
      </form>
    </Modal>
  )
}
