<template>
  <div class="comparison-portal">
    <div class="comparison-options">
      <button @click="compareManually">Manuell vergleichen</button>
      <button @click="handleAIButtonClick">KI-Empfehlung nutzen</button>
    </div>

    <!-- Add a default message when no option is selected -->
    <div v-if="!showManualComparison && !showAIForm && !showAIComparison" class="default-message">
      <p>Bitte wählen Sie oben eine Option aus, um zu beginnen.</p>
    </div>

    <!-- Add these debug paragraphs just before the comparison-options div -->
    <p>Debug: showManualComparison = {{ showManualComparison }}</p>
    <p>Debug: showAIForm = {{ showAIForm }}</p>
    <p>Debug: showAIComparison = {{ showAIComparison }}</p>

    <div v-show="showManualComparison" class="manual-comparison">
      <h2>Manuelle Vergleiche</h2>
      <div class="travel-options">
        <div v-for="option in travelOptions" :key="option.id" class="travel-option">
          <img :src="option.image" :alt="option.name">
          <h3>{{ option.name }}</h3>
          <p>Preis: {{ option.price }} €</p>
          <p>Dauer: {{ option.duration }} Tage</p>
          <button @click="selectOption(option)">Auswählen</button>
        </div>
      </div>
    </div>

    <div v-if="showAIForm" class="ai-form">
      <p>AI Form sollte hier sichtbar sein</p>
      <h2>Ihre Reisepräferenzen</h2>
      <form @submit.prevent="submitAIForm">
        <div>
          <label for="destination">Wunschziel:</label>
          <input id="destination" v-model="userPreferences.destination" required>
        </div>
        <div>
          <label for="budget">Budget (in €):</label>
          <input id="budget" v-model.number="userPreferences.budget" type="number" required>
        </div>
        <div>
          <label for="duration">Reisedauer (in Tagen):</label>
          <input id="duration" v-model.number="userPreferences.duration" type="number" required>
        </div>
        <div>
          <label for="interests">Interessen (kommagetrennt):</label>
          <input id="interests" v-model="userPreferences.interests" required>
        </div>
        <button type="submit">KI-Empfehlung anfordern</button>
      </form>
    </div>

    <div v-show="showAIComparison" class="ai-comparison">
      <h2>KI-Empfehlung</h2>
      <div v-if="isLoading">Lade KI-Empfehlung...</div>
      <div v-else-if="aiRecommendation">
        <p>Basierend auf Ihren Präferenzen empfiehlt unsere KI:</p>
        <div class="travel-option">
          <h3>{{ aiRecommendation.name }}</h3>
          <p>{{ aiRecommendation.description }}</p>
          <p>Geschätzter Preis: {{ aiRecommendation.estimatedPrice }} €</p>
          <p>Empfohlene Dauer: {{ aiRecommendation.recommendedDuration }} Tage</p>
          <button @click="selectOption(aiRecommendation)">Auswählen</button>
        </div>
      </div>
      <div v-else-if="error">Ein Fehler ist aufgetreten: {{ error }}</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ComparisonPortal',
  data() {
    return {
      showManualComparison: false,
      showAIForm: false,
      showAIComparison: false,
      travelOptions: [
        { id: 1, name: 'Strandurlaub in Spanien', price: 799, duration: 7, image: '/images/spain-beach.jpg' },
        { id: 2, name: 'Städtereise nach Paris', price: 599, duration: 4, image: '/images/paris-city.jpg' },
        { id: 3, name: 'Wanderurlaub in den Alpen', price: 899, duration: 6, image: '/images/alps-hiking.jpg' },
      ],
      userPreferences: {
        destination: '',
        budget: null,
        duration: null,
        interests: ''
      },
      aiRecommendation: null,
      isLoading: false,
      error: null,
      apiKey: import.meta.env.VITE_OPENAI_API_KEY
    }
  },
  methods: {
    compareManually() {
      console.log('compareManually called');
      this.showManualComparison = true;
      this.showAIForm = false;
      this.showAIComparison = false;
    },
    handleAIButtonClick() {
      console.log('KI-Empfehlung Button wurde geklickt');
      this.showAIFormFunc();
    },
    showAIFormFunc() {
      console.log('showAIForm wurde aufgerufen');
      this.showManualComparison = false;
      this.showAIForm = true;
      this.showAIComparison = false;
      console.log('Nach Änderungen:', {
        showManualComparison: this.showManualComparison,
        showAIForm: this.showAIForm,
        showAIComparison: this.showAIComparison
      });
    },
    async submitAIForm() {
      console.log("Verwendeter API-Schlüssel:", this.apiKey);
      this.showAIForm = false;
      this.showAIComparison = true;
      this.isLoading = true;
      this.error = null;

      try {
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: "gpt-3.5-turbo",
            messages: [{
              role: "system",
              content: "Du bist ein KI-Reiseberater. Empfehle eine Reiseoption basierend auf den Präferenzen des Nutzers."
            }, {
              role: "user",
              content: `Ich suche nach einem Urlaub mit folgenden Präferenzen:
                Ziel: ${this.userPreferences.destination}
                Budget: ${this.userPreferences.budget} Euro
                Dauer: ${this.userPreferences.duration} Tage
                Interessen: ${this.userPreferences.interests}`
            }],
            temperature: 0.7
          },
          {
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json'
            }
          }
        );

        const aiSuggestion = response.data.choices[0].message.content;
        this.aiRecommendation = this.parseAISuggestion(aiSuggestion);
      } catch (error) {
        console.error('Fehler beim Abrufen der KI-Empfehlung:', error);
        if (error.response && error.response.status === 429) {
          console.log('API-Limit erreicht. Verwende Fallback-Empfehlung.');
          //this.aiRecommendation = this.getFallbackRecommendation();
        } else {
          if (error.response) {
            console.error('Fehler-Daten:', error.response.data);
            console.error('Fehler-Status:', error.response.status);
            console.error('Fehler-Header:', error.response.headers);
            this.error = `Fehler ${error.response.status}: ${error.response.data.error?.message || 'Unbekannter Fehler'}`;
          } else if (error.request) {
            console.error('Keine Antwort erhalten:', error.request);
            this.error = 'Keine Antwort vom Server erhalten. Bitte überprüfen Sie Ihre Internetverbindung.';
          } else {
            console.error('Fehler:', error.message);
            this.error = `Ein Fehler ist aufgetreten: ${error.message}`;
          }
        }
      } finally {
        this.isLoading = false;
      }
    },
    getFallbackRecommendation() {
      return {
        name: 'Empfohlene Strandreise',
        description: 'Genießen Sie einen wunderbaren Strandurlaub an der spanischen Costa del Sol. Mit herrlichem Wetter, kilometerlangen Stränden und einer Vielzahl von Aktivitäten ist dies der perfekte Ort für einen entspannenden Urlaub.',
        estimatedPrice: '950',
        recommendedDuration: '7'
      };
    },
    parseAISuggestion(suggestion) {
      return {
        name: 'Personalisierte KI-Empfehlung',
        description: suggestion,
        estimatedPrice: this.userPreferences.budget,
        recommendedDuration: this.userPreferences.duration
      };
    },
    selectOption(option) {
      alert(`Sie haben "${option.name}" ausgewählt. Vielen Dank für Ihre Buchung!`);
    }
  },
  mounted() {
    // Remove this line to prevent automatic display of manual comparison
    // this.compareManually();
    console.log('ComparisonPortal component mounted');
  },
  watch: {
    showAIForm(newValue) {
      console.log('showAIForm changed to:', newValue);
    }
  }
}
</script>

<style scoped>
.comparison-portal {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.comparison-options {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.comparison-options button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}

.travel-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.travel-option {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 5px;
}

.travel-option img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 5px;
}

.ai-form form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
  margin: 0 auto;
}

.ai-form label {
  font-weight: bold;
}

.ai-form input {
  width: 100%;
  padding: 0.5rem;
}

.ai-form button {
  align-self: flex-start;
  padding: 0.5rem 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}

.ai-form button:hover {
  background-color: #45a049;
}

.ai-form {
  border: 5px solid red !important;
  background-color: yellow !important;
  padding: 20px;
  margin-top: 20px;
}

/* Add this to your existing styles */
.default-message {
  text-align: center;
  margin-top: 20px;
  font-style: italic;
}

.manual-comparison, .ai-form, .ai-comparison {
  border: 1px solid #ccc;
  padding: 20px;
  margin-top: 20px;
}
</style>