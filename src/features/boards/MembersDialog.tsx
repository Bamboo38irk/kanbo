import { useAppDispatch, useAppSelector } from '@/app/hooks'
import Avatar from '@/components/ui/Avatar'
import form from '@/components/ui/Form.module.scss'
import Modal from '@/components/ui/Modal'
import PeoplePicker from '@/components/ui/PeoplePicker'
import { selectUser, selectUsers } from '@/features/users/usersSlice'
import type { Board } from '@/types'
import { setBoardMembers } from './boardsSlice'
import styles from './MembersDialog.module.scss'

interface MembersDialogProps {
  board: Board
  onClose: () => void
}

export default function MembersDialog({ board, onClose }: MembersDialogProps) {
  const dispatch = useAppDispatch()
  const userId = useAppSelector((state) => state.auth.userId)
  const owner = useAppSelector((state) => selectUser(state, board.ownerId))
  const users = useAppSelector(selectUsers)

  const fixedIds = [...new Set([board.ownerId, userId ?? ''])]
  const candidates = users.filter((user) => !fixedIds.includes(user.id))

  function handleChange(ids: string[]) {
    dispatch(setBoardMembers({ boardId: board.id, memberIds: [...new Set([...fixedIds, ...ids])] }))
  }

  return (
    <Modal title={`Участники доски «${board.name}»`} onClose={onClose} width={480}>
      <div className={styles.owner}>
        <Avatar user={owner} size={40} />
        <div>
          <strong>
            {owner?.name}
            {owner?.id === userId && ' · вы'}
          </strong>
          <span>Создатель доски</span>
        </div>
      </div>

      <div className={form.field}>
        <span className={form.label}>Участники</span>
        <PeoplePicker
          users={candidates}
          selectedIds={board.memberIds}
          addLabel="Пригласить"
          onChange={handleChange}
        />
      </div>
    </Modal>
  )
}
