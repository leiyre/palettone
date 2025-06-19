<template>
  <div class="container">
    <header class="header">
      <h1 class="title">Palettone</h1>
      <h2>Generador de Paletas de Colores</h2>
      <p class="subtitle">Describe un escenario y obtén una paleta armónica</p>
    </header>

    <main class="main-content">
      <div class="input-section">
        <textarea
          v-model="inputText"
          placeholder="Ej: Atardecer en la playa con tonos dorados y violetas"
          class="text-input"
        ></textarea>
        <button
          @click="generatePalette"
          :disabled="isLoading"
          class="generate-btn"
        >
          {{ isLoading ? "Generando..." : "Generar Paleta" }}
        </button>
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div v-if="palette.length > 0" class="palette-section">
        <h2>Tu paleta generada:</h2>
        <p class="description">{{ currentDescription }}</p>

        <div class="palette-container">
          <div
            v-for="(color, index) in palette"
            :key="index"
            class="color-box"
            :style="{ backgroundColor: color }"
            @click="copyToClipboard(color)"
          >
            <span class="color-value">{{ color }}</span>
            <span class="copy-hint">Click para copiar</span>
          </div>
        </div>

        <div class="palette-actions">
          <button @click="refreshPalette" class="action-btn">
            🔄 Variar colores
          </button>
          <button @click="savePalette" class="action-btn" v-if="!saved">
            💾 Guardar paleta
          </button>
          <span v-else class="saved-message">✔️ Paleta guardada</span>
        </div>
      </div>

      <div v-if="savedPalettes.length > 0" class="saved-palettes">
        <h3>Tus paletas guardadas:</h3>
        <div
          class="saved-palette"
          v-for="(item, idx) in savedPalettes"
          :key="idx"
        >
          <div class="saved-colors">
            <div
              v-for="(color, colorIdx) in item.palette"
              :key="colorIdx"
              class="small-color-box"
              :style="{ backgroundColor: color }"
              @click="applyPalette(item.palette)"
            ></div>
          </div>
          <span class="saved-description">{{ item.description }}</span>
          <button @click="removePalette(idx)" class="delete-btn">×</button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";

const inputText = ref("");
const palette = ref([]);
const isLoading = ref(false);
const error = ref(null);
const currentDescription = ref("");
const saved = ref(false);
const savedPalettes = ref([]);

const generatePalette = async () => {
  if (!inputText.value.trim()) {
    error.value = "Por favor ingresa una descripción";
    return;
  }

  isLoading.value = true;
  error.value = null;
  palette.value = [];

  try {
    const startTime = Date.now();
    const response = await $fetch("/api/palette", {
      method: "POST",
      body: { text: inputText.value },
      headers: { "Content-Type": "application/json" },
      timeout: 20000,
    });

    console.log(`Solicitud completada en ${Date.now() - startTime}ms`);

    if (response?.palette?.length >= 3) {
      palette.value = response.palette;
      currentDescription.value = inputText.value;
    } else {
      throw new Error("Respuesta inesperada del servidor");
    }
  } catch (err) {
    console.error("Error completo:", {
      error: err,
      input: inputText.value,
      time: new Date().toISOString(),
    });

    error.value = "Error al generar la paleta. ";

    if (err.data?.details) {
      error.value += process.dev ? err.data.details : "Detalles en consola";
    }

    // Paleta de emergencia basada en hash del texto
    const hash = inputText.value
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    palette.value = [
      `hsl(${hash % 360}, 75%, 60%)`,
      `hsl(${(hash + 120) % 360}, 75%, 60%)`,
      `hsl(${(hash + 240) % 360}, 75%, 60%)`,
    ];
  } finally {
    isLoading.value = false;
  }
};

const refreshPalette = () => {
  if (inputText.value) {
    generatePalette();
  }
};

const copyToClipboard = (color) => {
  navigator.clipboard.writeText(color);
  alert(`Color copiado: ${color}`);
};

const savePalette = () => {
  if (palette.value.length > 0) {
    savedPalettes.value.unshift({
      palette: [...palette.value],
      description: currentDescription.value,
      timestamp: new Date().toISOString(),
    });
    saved.value = true;

    // Guardar en localStorage
    localStorage.setItem("savedPalettes", JSON.stringify(savedPalettes.value));
  }
};

const applyPalette = (colors) => {
  palette.value = [...colors];
  saved.value = false;
};

const removePalette = (index) => {
  savedPalettes.value.splice(index, 1);
  localStorage.setItem("savedPalettes", JSON.stringify(savedPalettes.value));
};

// Cargar paletas guardadas al iniciar
onMounted(() => {
  const stored = localStorage.getItem("savedPalettes");
  if (stored) {
    savedPalettes.value = JSON.parse(stored);
  }
});
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.title {
  font-family: "Agbalumo";
}

.subtitle {
  color: #666;
  margin-top: 0.5rem;
}

.text-input {
  width: 100%;
  min-height: 100px;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
}

.generate-btn {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.generate-btn:hover {
  background-color: #45a049;
}

.generate-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.palette-section {
  margin-top: 2rem;
  text-align: center;
}

.description {
  font-style: italic;
  color: #555;
  margin-bottom: 1.5rem;
}

.palette-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 2rem 0;
  flex-wrap: wrap;
}

.color-box {
  width: 120px;
  height: 180px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding: 1rem;
  cursor: pointer;
  transition: transform 0.2s;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.color-box:hover {
  transform: translateY(-5px);
}

.color-value {
  background-color: rgba(255, 255, 255, 0.8);
  padding: 0.3rem 0.6rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-family: monospace;
}

.copy-hint {
  position: absolute;
  bottom: -20px;
  opacity: 0;
  transition: all 0.3s;
  font-size: 0.8rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
}

.color-box:hover .copy-hint {
  bottom: 10px;
  opacity: 1;
}

.palette-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.action-btn {
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.action-btn:hover {
  background-color: #e0e0e0;
}

.saved-message {
  color: #4caf50;
  display: flex;
  align-items: center;
}

.error-message {
  color: #f44336;
  text-align: center;
  margin: 1rem 0;
}

.saved-palettes {
  margin-top: 3rem;
  border-top: 1px solid #eee;
  padding-top: 2rem;
}

.saved-palette {
  display: flex;
  align-items: center;
  margin: 0.5rem 0;
  padding: 0.5rem;
  border-radius: 6px;
  background-color: #f9f9f9;
}

.saved-colors {
  display: flex;
  margin-right: 1rem;
}

.small-color-box {
  width: 30px;
  height: 30px;
  border-radius: 4px;
  margin-right: 5px;
  cursor: pointer;
  border: 1px solid #ddd;
}

.saved-description {
  flex-grow: 1;
  font-size: 0.9rem;
  color: #555;
}

.delete-btn {
  background: none;
  border: none;
  color: #f44336;
  cursor: pointer;
  font-size: 1.2rem;
  margin-left: 0.5rem;
}

@media (max-width: 600px) {
  .container {
    padding: 1rem;
  }

  .palette-container {
    flex-direction: column;
    align-items: center;
  }

  .color-box {
    width: 100%;
    max-width: 200px;
  }
}
</style>