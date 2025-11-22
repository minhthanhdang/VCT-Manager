import { fetchProfiles } from "@/app/utils";
import { create } from "zustand";

interface IStatusSidebarStore {
  isOpen: boolean;
  teams: string[][];
  profiles: any[];
  addTeam: (team: any) => void;
  removeTeam: (team: any) => void;
  onOpen: () => void;
  onClose: () => void;
}

const useStatusSidebarStore = create<IStatusSidebarStore>((set) => ({
  isOpen: true,
  teams: [],
  profiles: [],
  addTeam: async (ids: string[]) => {
    const response = await fetchProfiles(ids);
    if (response) {
      set((state) => ({ profiles: [...state.profiles, response] }));
      set((state) => ({ teams: [...state.teams, ids] }));
    }
  },
  removeTeam: (index: number) =>
    set((state) => ({
      teams: state.teams.filter((_, i) => i !== index),
    })),
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useStatusSidebarStore;
