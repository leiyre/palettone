import { describe, expect, it } from "vitest";
import type { SavedPalettesPort } from "~/application/ports/saved-palettes.port";
import { RemovePaletteUseCase } from "~/application/use-cases/remove-palette";
import type { SavedPalette } from "~/domain/palette";

class InMemorySavedPalettesPort implements SavedPalettesPort {
  public savedSnapshots: SavedPalette[][] = [];

  load(): SavedPalette[] {
    return [];
  }

  save(items: SavedPalette[]): void {
    this.savedSnapshots.push(items);
  }
}

function buildPalettes(): SavedPalette[] {
  return [
    {
      palette: ["#111111", "#222222", "#333333"],
      description: "night city",
      timestamp: "2026-01-01T00:00:00.000Z",
    },
    {
      palette: ["#AAAAAA", "#BBBBBB", "#CCCCCC"],
      description: "fog morning",
      timestamp: "2026-01-02T00:00:00.000Z",
    },
  ];
}

describe("RemovePaletteUseCase", () => {
  it("removes a valid index and persists updated list", () => {
    const repo = new InMemorySavedPalettesPort();
    const useCase = new RemovePaletteUseCase(repo);
    const initial = buildPalettes();

    const next = useCase.execute(initial, 0);

    expect(next).toHaveLength(1);
    expect(next[0].description).toBe("fog morning");
    expect(repo.savedSnapshots).toHaveLength(1);
    expect(repo.savedSnapshots[0]).toEqual(next);
  });

  it("returns original array when index is invalid and does not persist", () => {
    const repo = new InMemorySavedPalettesPort();
    const useCase = new RemovePaletteUseCase(repo);
    const initial = buildPalettes();

    const next = useCase.execute(initial, 99);

    expect(next).toBe(initial);
    expect(repo.savedSnapshots).toHaveLength(0);
  });
});
