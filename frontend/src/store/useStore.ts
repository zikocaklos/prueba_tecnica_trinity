import create from 'zustand'

type State = {
  loading: boolean
  setLoading: (v: boolean) => void
}

export const useStore = create<State>((set) => ({
  loading: false,
  setLoading: (v) => set({ loading: v }),
}))
