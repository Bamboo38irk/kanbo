import { createContext, useContext } from 'react'

export const SidePanelContext = createContext<() => void>(() => {})

export function useCloseSidePanel() {
  return useContext(SidePanelContext)
}
