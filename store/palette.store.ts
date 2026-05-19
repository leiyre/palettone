import { defineStore } from "pinia";
import type { SavedPalette } from "~/domain/palette";

export const usePaletteStore = defineStore("palette", {
  state: () => ({
    savedPalettes: [] as SavedPalette[],
    hasLoadedSavedPalettes: false,
  }),
  actions: {
    loadSavedPalettes() {
      if (this.hasLoadedSavedPalettes) return;
      const { $loadPalettes } = useNuxtApp();
      this.savedPalettes = $loadPalettes.execute();
      this.hasLoadedSavedPalettes = true;
    },
    savePalette(colors: string[], description: string) {
      if (!colors.length) return;
      const { $savePalette } = useNuxtApp();
      const newItem: SavedPalette = {
        palette: [...colors],
        description,
        timestamp: new Date().toISOString(),
      };
      this.savedPalettes.unshift(newItem);
      $savePalette.execute(this.savedPalettes);
    },
    removePalette(index: number) {
      const { $removePalette } = useNuxtApp();
      this.savedPalettes = $removePalette.execute(this.savedPalettes, index);
    },
  },
});
