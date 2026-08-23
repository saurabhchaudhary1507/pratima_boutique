// store/selectionList.ts (placeholder — full implementation in task 10.1)
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SelectionListState, SelectionListItem } from '@/types';

export const useSelectionList = create<SelectionListState>()(
  persist(
    (set, get) => ({
      items: [] as SelectionListItem[],
      addItem: (newItem: SelectionListItem) => {
        if (get().hasItem(newItem.productId, newItem.selectedSize, newItem.selectedColour)) return;
        set((state) => ({ items: [...state.items, newItem] }));
      },
      removeItem: (productId: string, size?: string, colour?: string) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.selectedSize === size && i.selectedColour === colour)
          ),
        })),
      clearAll: () => set({ items: [] }),
      hasItem: (productId: string, size?: string, colour?: string) =>
        get().items.some(
          (i) => i.productId === productId && i.selectedSize === size && i.selectedColour === colour
        ),
    }),
    { name: 'pratima-selection-list' }
  )
);
