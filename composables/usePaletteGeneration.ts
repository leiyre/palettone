export function usePaletteGeneration() {
  const { $generatePalette } = useNuxtApp();

  const execute = (rawText: string, harmony?: string) => {
    return $generatePalette.execute({ rawText, harmony });
  };

  return { execute };
}
