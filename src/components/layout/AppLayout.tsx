import { Navigate, Outlet, useLocation } from 'react-router'
import { useAppSelector } from '@/app/hooks'
import BoardPanel from '@/features/boards/BoardPanel'
import TaskPanel from '@/features/tasks/TaskPanel'
import Topbar from './Topbar'
import styles from './AppLayout.module.scss'

export default function AppLayout() {
  const location = useLocation()
  const userId = useAppSelector((state) => state.auth.userId)
  const isTaskPanelOpen = useAppSelector((state) => Boolean(state.ui.editingTaskId || state.ui.newTask))
  const isBoardPanelOpen = useAppSelector((state) => state.ui.isBoardPanelOpen)

  if (!userId) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
  }

  return (
    <div className={styles.layout}>
      <Topbar />
      <main className={styles.main}>
        <div className={styles.content}>
          <Outlet />
        </div>
      </main>
      {isTaskPanelOpen && <TaskPanel />}
      {isBoardPanelOpen && <BoardPanel />}
    </div>
  )
}
