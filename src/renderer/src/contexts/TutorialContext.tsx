import { createContext, useContext, ReactNode, useCallback, useMemo } from 'react'
import { useTutorial, TutorialPage } from '../hooks/tutorial/useTutorial'

interface TutorialContextType {
  startTutorial: (page: TutorialPage) => void
  startFullTutorial: (currentPage?: TutorialPage) => void
  hasSeenTutorial: (page?: TutorialPage) => boolean
  resetTutorial: () => void
}

const TutorialContext = createContext<TutorialContextType | null>(null)

interface TutorialProviderProps {
  children: ReactNode
}

export const TutorialProvider = ({ children }: TutorialProviderProps) => {
  const { startTutorial, startFullTutorial, hasSeenTutorial, resetTutorial } = useTutorial()

  const contextValue = useMemo(
    () => ({
      startTutorial,
      startFullTutorial,
      hasSeenTutorial,
      resetTutorial
    }),
    [startTutorial, startFullTutorial, hasSeenTutorial, resetTutorial]
  )

  return <TutorialContext.Provider value={contextValue}>{children}</TutorialContext.Provider>
}

export const useTutorialContext = (): TutorialContextType => {
  const context = useContext(TutorialContext)
  if (!context) {
    throw new Error('useTutorialContext must be used within a TutorialProvider')
  }
  return context
}

export type { TutorialPage }
