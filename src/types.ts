export type Status = 'todo' | 'progress' | 'waiting' | 'done'

export type Tone = 'red' | 'blue' | 'yellow' | 'green'

export interface User {
  id: string
  name: string
  email: string
  gender: 'male' | 'female'
  color: string
  avatarUrl?: string
}

export interface Board {
  id: string
  name: string
  ownerId: string
  memberIds: string[]
}

export interface Subtask {
  id: string
  text: string
  done: boolean
}

export interface Comment {
  id: string
  authorId: string
  text: string
  createdAt: string
  editedAt?: string
}

export interface Task {
  id: string
  boardId: string
  title: string
  description: string
  status: Status
  assigneeIds: string[]
  creatorId: string
  dueDate: string | null
  subtasks: Subtask[]
  comments: Comment[]
  createdAt: string
}

export interface AppNotification {
  id: string
  type: 'assigned' | 'comment'
  actorId: string
  taskId: string
  createdAt: string
  read: boolean
}

export interface WorkspaceData {
  users: User[]
  boards: Board[]
  tasks: Task[]
  notifications: AppNotification[]
}
