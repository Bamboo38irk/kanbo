import { createAction } from '@reduxjs/toolkit'
import { loadData } from '@/api/storage'
import type { WorkspaceData } from '@/types'

export const initialData = loadData()

export const dataReset = createAction<WorkspaceData>('app/dataReset')
