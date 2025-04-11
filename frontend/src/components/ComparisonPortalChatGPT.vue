<template>
  <div class="comparison-portal">
    <div class="comparison-options">
      <button @click="showAIFormFunc" :class="{ active: showAIForm }">
        KI-Empfehlung
      </button>
      <button
        @click="compareManually"
        :class="{ active: showManualComparison }"
      >
        Manuelle Suche
      </button>
    </div>

    <transition name="fade">
      <div v-if="showAIForm" class="ai-form">
        <h2>KI-Reiseempfehlung</h2>
        <form @submit.prevent="submitAIForm">
          <div class="form-group">
            <label for="destination">Reiseziel:</label>
            <input
              v-model="userPreferences.destination"
              id="destination"
              required
            />
          </div>

          <div class="form-group">
            <label for="budget">Budget (in Euro):</label>
            <input
              v-model="userPreferences.budget"
              id="budget"
              type="number"
              required
            />
          </div>

          <div class="form-group">
            <label for="duration">Reisedauer (in Tagen):</label>
            <input
              v-model="userPreferences.duration"
              id="duration"
              type="number"
              required
            />
          </div>

          <div class="form-group">
            <label for="interests">Interessen:</label>
            <input
              v-model="userPreferences.interests"
              id="interests"
              required
            />
          </div>

          <button type="submit" class="submit-btn">Empfehlung anfordern</button>
        </form>
      </div>
    </transition>

    <div v-if="isLoading" class="loading">
      <div class="spinner"></div>
      <p>Lade Empfehlungen...</p>
    </div>

    <div v-if="error" class="error">
      <i class="fas fa-exclamation-triangle"></i> {{ error }}
    </div>

    <transition name="fade">
      <div
        v-if="showAIComparison && aiRecommendation.length > 0"
        class="travel-options"
      >
        <div
          v-for="(recommendation, index) in aiRecommendation"
          :key="index"
          class="travel-option"
        >
          <h3>{{ recommendation.name }}</h3>
          <p class="description">{{ recommendation.description }}</p>
          <div class="details">
            <p>
              <i class="fas fa-euro-sign"></i> Geschätzter Preis:
              {{ recommendation.estimatedPrice }} €
            </p>
            <p>
              <i class="fas fa-calendar-alt"></i> Empfohlene Dauer:
              {{ recommendation.recommendedDuration }} Tage
            </p>
            <p v-if="recommendation.source">
              <i class="fas fa-link"></i>
              <a
                :href="recommendation.source"
                target="_blank"
                rel="noopener noreferrer"
                >Quelle</a
              >
            </p>
          </div>
          <button @click="selectOption(recommendation)" class="select-btn">
            Diese Option wählen
          </button>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div
        v-if="showManualComparison && manualRecommendations.length > 0"
        class="travel-options"
      >
        <div
          v-for="(recommendation, index) in manualRecommendations"
          :key="index"
          class="travel-option"
        >
          <h3>{{ recommendation.name }}</h3>
          <p class="description">{{ recommendation.description }}</p>
          <div class="details">
            <p>
              <i class="fas fa-euro-sign"></i> Geschätzter Preis:
              {{ recommendation.estimatedPrice }} €
            </p>
            <p>
              <i class="fas fa-calendar-alt"></i> Empfohlene Dauer:
              {{ recommendation.recommendedDuration }} Tage
            </p>
            <p v-if="recommendation.source">
              <i class="fas fa-link"></i>
              <a
                :href="recommendation.source"
                target="_blank"
                rel="noopener noreferrer"
                >Quelle</a
              >
            </p>
          </div>
          <button @click="selectOption(recommendation)" class="select-btn">
            Diese Option wählen
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "ComparisonPortalChatGPT",
  data() {
    return {
      showAIForm: false,
      showAIComparison: false,
      showManualComparison: false,
      isLoading: false,
      error: null,
      aiRecommendation: [],
      manualRecommendations: [],
      userPreferences: {
        destination: "",
        budget: "",
        duration: "",
        interests: "",
      },
    };
  },
  methods: {
    showAIFormFunc() {
      this.showAIForm = true;
      this.showAIComparison = false;
      this.showManualComparison = false;
    },
    async compareManually() {
      this.showAIForm = false;
      this.showAIComparison = false;
      this.showManualComparison = true;
      this.error = null;
      this.isLoading = true;

      try {
        const response = await fetch(
          import.meta.env.VITE_BACKEND_URL + "/api/recommendations/openai",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              destination: "Europa",
              budget: 500,
              duration: 5,
              interests: "Kultur, Natur, Erholung",
            }),
          }
        );

        const data = await response.json();

        if (!data.success) {
          throw new Error(
            data.message || "Unbekannter Fehler bei der manuellen Suche"
          );
        }

        this.manualRecommendations =
          data.recommendations || data.fallback || [];
      } catch (error) {
        this.error = `Fehler bei der manuellen Anfrage: ${error.message}`;
        this.manualRecommendations = [];
      } finally {
        this.isLoading = false;
      }
    },
    async submitAIForm() {
      this.error = null;
      this.isLoading = true;
      this.showAIComparison = false;

      try {
        const response = await fetch(
          import.meta.env.VITE_BACKEND_URL + "/api/recommendations/openai",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(this.userPreferences),
          }
        );

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || "Unbekannter Fehler");
        }

        this.aiRecommendation = data.recommendations || data.fallback;
        this.showAIForm = false;
        this.showAIComparison = true;
      } catch (error) {
        this.error = `Fehler bei der Anfrage: ${error.message}`;
      } finally {
        this.isLoading = false;
      }
    },
    selectOption(option) {
      alert(
        `Sie haben "${option.name}" ausgewählt. Vielen Dank für Ihre Buchung!`
      );
    },
  },
};
</script>

<style scoped>
.comparison-portal {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
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
  background-color: #4caf50;
  color: white;
}

.ai-form {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  background-color: #4caf50;
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
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.travel-option:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
