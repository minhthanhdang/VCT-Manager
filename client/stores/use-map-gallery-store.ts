import { create } from "zustand";

interface IMapGalleryStore {
  selected: number;
  setSelected: (newSelected: number) => void;
}

const useMapGalleryStore = create<IMapGalleryStore>((set) => ({
  selected: 0,

  setSelected: (newSelected: number) => set({ selected: newSelected }),
}));

export default useMapGalleryStore;
