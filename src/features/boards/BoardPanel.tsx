import { nanoid } from '@reduxjs/toolkit'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import Button from '@/components/ui/Button'
import form from '@/components/ui/Form.module.scss'
import PeoplePicker from '@/components/ui/PeoplePicker'
import SidePanel, { SidePanelBody, SidePanelFooter, SidePanelHeader } from '@/components/ui/SidePanel'
import { useCloseSidePanel } from '@/components/ui/sidePanelContext'
import { closePanel } from '@/features/ui/uiSlice'
import { selectTeammates } from '@/features/users/usersSlice'
import { addBoard } from './boardsSlice'
import styles from './BoardPanel.module.scss'

export default function BoardPanel() {
  const dispatch = useAppDispatch()

  return (
    <SidePanel label="Новая доска" onClose={() => dispatch(closePanel())}>
      <BoardForm />
    </SidePanel>
  )
}

function BoardForm() {
  const dispatch = useAppDispatch()
  const close = useCloseSidePanel()
  const userId = useAppSelector((state) => state.auth.userId) ?? ''
  const teammates = useAppSelector(selectTeammates)

  const [name, setName] = useState('')
  const [memberIds, setMemberIds] = useState<string[]>([])
  const [error, setError] = useState('')
  const [isCreated, setIsCreated] = useState(false)

  function handleCreate() {
    if (!name.trim()) {
      setError('Введите название доски')
      return
    }

    setIsCreated(true)
    dispatch(
      addBoard({
        id: nanoid(),
        name: name.trim(),
        ownerId: userId,
        memberIds: [userId, ...memberIds],
      }),
    )
    close()
  }

  return (
    <>
      <SidePanelHeader>
        <h2>Новая доска</h2>
      </SidePanelHeader>

      <SidePanelBody>
        <div className={styles.form}>
          <label className={form.field}>
            <span className={form.label}>Название</span>
            <input
              className={form.input}
              value={name}
              placeholder="Например, Здоровье или Учеба"
              autoFocus
              onChange={(event) => {
                setName(event.target.value)
                setError('')
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !isCreated) handleCreate()
              }}
            />
            {error && <span className={form.error}>{error}</span>}
          </label>

          <div className={form.field}>
            <span className={form.label}>Пригласить</span>
            <PeoplePicker
              users={teammates}
              selectedIds={memberIds}
              addLabel="Пригласить людей"
              onChange={setMemberIds}
            />
          </div>
        </div>
      </SidePanelBody>

      <SidePanelFooter>
        <Button variant="secondary" onClick={close}>
          Отмена
        </Button>
        <Button disabled={isCreated} onClick={handleCreate}>
          Создать доску
        </Button>
      </SidePanelFooter>
    </>
  )
}
