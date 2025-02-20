<template>
  <div class="comparison-portal">
    <h1>Reisevergleichsportal</h1>
    <div class="comparison-options">
      <button @click="showAIFormFunc" :class="{ active: showAIForm }">KI-Empfehlung</button>
      <button @click="compareManually" :class="{ active: showManualComparison }">Manuelle Suche</button>
    </div>

    <transition name="fade">
      <div v-if="showAIForm" class="ai-form">
        <h2>KI-Reiseempfehlung</h2>
        <form @submit.prevent="submitAIForm">
          <div class="form-group">
            <label for="destination">Reiseziel:</label>
            <input v-model="userPreferences.destination" id="destination" required>
          </div>

          <div class="form-group">
            <label for="budget">Budget (in Euro):</label>
            <input v-model="userPreferences.budget" id="budget" type="number" required>
          </div>

          <div class="form-group">
            <label for="duration">Reisedauer (in Tagen):</label>
            <input v-model="userPreferences.duration" id="duration" type="number" required>
          </div>

          <div class="form-group">
            <label for="interests">Interessen:</label>
            <input v-model="userPreferences.interests" id="interests" required>
          </div>

          <button type="submit" class="submit-btn">Empfehlung anfordern</button>
        </form>
      </div>
    </transition>

    <div v-if="isLoading" class="loading">
      <div class="spinner"></div>
      <p>Lade KI-Empfehlung...</p>
    </div>

    <div v-if="error" class="error">
      <i class="fas fa-exclamation-triangle"></i>
      {{ error }}
    </div>

    <transition name="fade">
      <div v-if="showAIComparison && aiRecommendation.length > 0" class="travel-options">
        <div v-for="(recommendation, index) in aiRecommendation" :key="index" class="travel-option">
          <h3>{{ recommendation.name }}</h3>
          <p class="description">{{ recommendation.description }}</p>
          <div class="details">
            <p><i class="fas fa-euro-sign"></i> Geschätzter Preis: {{ recommendation.estimatedPrice }} Euro</p>
            <p><i class="fas fa-calendar-alt"></i> Empfohlene Dauer: {{ recommendation.recommendedDuration }} Tage</p>
            <p v-if="recommendation.source"><i class="fas fa-link"></i> <a :href="recommendation.source" target="_blank" rel="noopener noreferrer">Quelle</a></p>
          </div>
          <button @click="selectOption(recommendation)" class="select-btn">Diese Option wählen</button>
        </div>
      </div>
    </transition>

    <div v-if="showManualComparison" class="travel-options">
      <!-- Manuelle Vergleichsoptionen hier -->
      <p>Hier können Sie manuelle Vergleichsoptionen implementieren.</p>
    </div>
  </div>
</template>

<script>
import { GoogleGenerativeAI } from "@google/generative-ai";

export default {
  name: 'ComparisonPortalGemini',
  data() {
    return {
      showAIForm: false,
      showAIComparison: false,
      showManualComparison: false,
      userPreferences: {
        destination: '',
        budget: '',
        duration: '',
        interests: ''
      },
      aiRecommendation: [],
      isLoading: false,
      error: null,
      apiKey: null,
      genAI: null,
      model: null,
    }
  },
  created() {
    this.initializeAPI();
  },
  methods: {
    async initializeAPI() {
      this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!this.apiKey) {
        console.error('API Key ist nicht definiert. Bitte überprüfen Sie Ihre .env Datei.');
        this.error = 'API-Konfigurationsfehler. Bitte kontaktieren Sie den Administrator.';
      } else {
        this.genAI = new GoogleGenerativeAI(this.apiKey);
        await this.tryInitializeModel();
      }
    },

    async tryInitializeModel() {
      const models = ["gemini-1.5-pro", "gemini-pro", "gemini-1.0-pro"];
      for (const modelName of models) {
        try {
          this.model = this.genAI.getGenerativeModel({ model: modelName });
          // Testen Sie das Modell mit einer einfachen Anfrage
          await this.model.generateContent("Test");
          console.log(`Erfolgreich verbunden mit Modell: ${modelName}`);
          return; // Beenden Sie die Schleife, wenn ein Modell erfolgreich initialisiert wurde
        } catch (error) {
          console.warn(`Konnte nicht mit Modell ${modelName} verbinden: ${error.message}`);
        }
      }
      // Wenn kein Modell erfolgreich war
      this.error = 'Konnte keine Verbindung zu verfügbaren Modellen herstellen. Bitte versuchen Sie es später erneut.';
    },
    showAIFormFunc() {
      this.showAIForm = true;
      this.showAIComparison = false;
      this.showManualComparison = false;
    },
    compareManually() {
      this.showAIForm = false;
      this.showAIComparison = false;
      this.showManualComparison = true;
    },
    async submitAIForm() {
      if (!this.model) {
        this.error = 'API nicht initialisiert. Bitte versuchen Sie es später erneut.';
        return;
      }

      this.showAIForm = false;
      this.showAIComparison = true;
      this.isLoading = true;
      this.error = null;

      try {
        const prompt = this.generatePrompt();
        const result = await this.model.generateContent(prompt);
        const aiSuggestion = result.response.text();
        this.processAIResponse(aiSuggestion);
      } catch (error) {
        this.handleError(error);
      } finally {
        this.isLoading = false;
      }
    },
    generatePrompt() {
      return `Du bist ein KI-Reiseberater. Empfehle 3 bis 5 Reiseoptionen basierend auf den folgenden Präferenzen des Nutzers:
        Ziel: ${this.userPreferences.destination}
        Budget: ${this.userPreferences.budget} Euro
        Dauer: ${this.userPreferences.duration} Tage
        Interessen: ${this.userPreferences.interests}

        Suche bitte mithilfe des Internets nach echten Reiseangeboten und gebe echte Quellen/ Links an. Berücksichtige dabei bitte die angegebenen Werte und im Bereich Preis kannst du einen Spielraum von +/- 10 % annehmen.

        Bitte gib deine Empfehlungen in folgendem JSON-Format zurück:
        [
          {
            "name": "Name der Reise",
            "description": "Detaillierte Beschreibung der Reise",
            "estimatedPrice": "Geschätzter Preis in Euro",
            "recommendedDuration": "Empfohlene Dauer in Tagen",
            "source": "URL zur Quelle des Angebots"
          },
          ...
        ]`;
    },
    processAIResponse(aiSuggestion) {
      console.log("Rohe AI-Antwort:", aiSuggestion);
      const cleanedResponse = this.cleanJsonResponse(aiSuggestion);
      console.log("Bereinigte Antwort:", cleanedResponse);

      try {
        const parsedResponse = JSON.parse(cleanedResponse);
        if (Array.isArray(parsedResponse)) {
          this.aiRecommendation = parsedResponse;
        } else {
          throw new Error('Die KI-Antwort ist kein Array.');
        }
      } catch (parseError) {
        console.error('Fehler beim Parsen der bereinigten Antwort:', parseError);
        this.handleError(new Error('Die KI-Antwort konnte nicht korrekt verarbeitet werden.'));
      }
    },
    cleanJsonResponse(response) {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        let jsonString = jsonMatch[0];
        jsonString = jsonString.replace(/\s+/g, ' ').trim();
        jsonString = jsonString.replace(/(?<=:)\s*"(.+?)"\s*(?=,|$)/g, function(match, p1) {
          return JSON.stringify(p1.replace(/"/g, '\\"'));
        });
        return jsonString;
      }
      throw new Error('Kein gültiges JSON in der Antwort gefunden');
    },
    handleError(error) {
      console.error('Fehler beim Abrufen oder Verarbeiten der KI-Empfehlung:', error);
      this.error = `Ein Fehler ist aufgetreten: ${error.message}`;
      this.aiRecommendation = this.getFallbackRecommendations();
    },
    getFallbackRecommendations() {
      return [
        {
          name: 'Strandurlaub an der Costa del Sol',
          description: 'Genießen Sie einen wunderbaren Strandurlaub an der spanischen Costa del Sol. Mit herrlichem Wetter, kilometerlangen Stränden und einer Vielzahl von Aktivitäten ist dies der perfekte Ort für einen entspannenden Urlaub.',
          estimatedPrice: '950',
          recommendedDuration: '7',
          source: 'https://www.example-travel.com/costa-del-sol'
        },
        {
          name: 'Städtereise nach Paris',
          description: 'Entdecken Sie die Stadt der Liebe mit ihren weltberühmten Sehenswürdigkeiten wie dem Eiffelturm, dem Louvre und Notre-Dame. Genießen Sie die französische Küche und die einzigartige Atmosphäre der Pariser Straßencafés.',
          estimatedPrice: '800',
          recommendedDuration: '5',
          source: 'https://www.example-travel.com/paris-city-break'
        }
      ];
    },
    selectOption(option) {
      alert(`Sie haben "${option.name}" ausgewählt. Vielen Dank für Ihre Buchung!`);
    }
  }
}
</script>

<style scoped>
.comparison-portal {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  color: #333;
}

.comparison-options {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
}

.comparison-options button {
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
  background-color: #f0f0f0;
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.comparison-options button.active {
  background-color: #4CAF50;
  color: white;
}

.ai-form {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.submit-btn {
  background-color: #4CAF50;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: #45a049;
}

.loading {
  text-align: center;
  margin-top: 20px;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  color: #d32f2f;
  background-color: #ffebee;
  padding: 10px;
  border-radius: 4px;
  margin-top: 20px;
}

.travel-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.travel-option {
  background-color: #fff;
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.travel-option:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.travel-option h3 {
  margin-top: 0;
  color: #2c3e50;
}

.description {
  color: #34495e;
  margin-bottom: 15px;
}

.details {
  font-size: 14px;
  color: #7f8c8d;
}

.details p {
  margin: 5px 0;
}

.details i {
  margin-right: 5px;
}

.select-btn {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 10px;
}

.select-btn:hover {
  background-color: #2980b9;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>