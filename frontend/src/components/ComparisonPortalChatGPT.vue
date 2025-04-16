<template>
  <div class="comparison-portal">
    <div class="comparison-options">
      <button @click="showAIFormFunc" :class="{ active: showAIForm }">
        KI-Empfehlung
      </button>
      <button @click="compareRandom" :class="{ active: showRandomComparison }">
        Zufällige Suche
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
      <i class="fas fa-exclamation-triangle"></i> {{ error.message || error }}
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
        v-if="showRandomComparison && manualRecommendations.length > 0"
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
      showRandomComparison: false,
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
      this.showRandomComparison = false;
    },
    async compareRandom() {
      this.showAIForm = false;
      this.showAIComparison = false;
      this.showRandomComparison = true;
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
        this.manualRecommendations =
          data.recommendations || data.fallback || [];
      } catch (error) {
        this.error = error;
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
  padding: 2rem 1rem;
  font-family: "Segoe UI", sans-serif;
  background-color: #f9f9f9;
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
  background-color: #eee;
  border: none;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-weight: 500;
  color: #333;
}

.comparison-options button:hover {
  background-color: #ddd;
}

.comparison-options button.active {
  background-color: #42b983;
  color: white;
}

.ai-form {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.2rem;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}

.submit-btn {
  background-color: #42b983;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background-color: #369c6b;
}

.loading {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #42b983;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 10px;
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
  padding: 12px;
  border-radius: 6px;
  margin-top: 20px;
  text-align: center;
}

.travel-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.travel-option {
  background-color: white;
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.travel-option:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.12);
}

.travel-option h3 {
  margin-top: 0;
  color: #333;
  font-size: 1.3rem;
}

.description {
  color: #555;
  margin-bottom: 1rem;
}

.details {
  font-size: 0.95rem;
  color: #666;
}

.details p {
  margin: 6px 0;
}

.details i {
  margin-right: 6px;
}

.select-btn {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 12px;
  font-size: 0.95rem;
}

.select-btn:hover {
  background-color: #369c6b;
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
