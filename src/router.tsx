import { createBrowserRouter } from 'react-router'
import AppLayout from '@/components/layout/AppLayout'
import LoginPage from '@/features/auth/LoginPage'
import BoardsPage from '@/features/boards/BoardsPage'
import NotFoundPage from '@/pages/NotFoundPage'

export const router = createBrowserRouter(
  [
    { path: '/login', element: <LoginPage /> },
    {
      path: '/',
      element: <AppLayout />,
      children: [
        { index: true, element: <BoardsPage /> },
        { path: '*', element: <NotFoundPage /> },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL },
)
