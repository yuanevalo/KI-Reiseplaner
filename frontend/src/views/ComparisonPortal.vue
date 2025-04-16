<template>
  <section class="comparison-page">
    <div class="header">
      <h1>Reisevergleichsportal</h1>
      <div class="toggle-container">
        <label class="switch">
          <input type="checkbox" v-model="isChatGPTActive" />
          <span class="slider round"></span>
        </label>
        <span class="toggle-label">{{
          isChatGPTActive ? "ChatGPT" : "Gemini"
        }}</span>
      </div>
    </div>

    <div class="comparison-content">
      <component
        :is="
          isChatGPTActive ? 'ComparisonPortalChatGPT' : 'ComparisonPortalGemini'
        "
      />
    </div>
  </section>
</template>

<script>
import ComparisonPortalChatGPT from "@/components/ComparisonPortalChatGPT.vue";
import ComparisonPortalGemini from "@/components/ComparisonPortalGemini.vue";

export default {
  name: "ComparisonPortal",
  components: {
    ComparisonPortalChatGPT,
    ComparisonPortalGemini,
  },
  data() {
    return {
      isChatGPTActive: false,
    };
  },
};
</script>

<style scoped>
.comparison-page {
  padding: 2rem 1rem;
  max-width: 1000px;
  margin: 0 auto;
  font-family: "Segoe UI", sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.header h1 {
  font-size: 2rem;
  color: #333;
  margin: 0;
}

.toggle-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.toggle-label {
  font-size: 1rem;
  font-weight: 600;
  color: #42b983;
}

.switch {
  position: relative;
  display: inline-block;
  width: 52px;
  height: 28px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 22px;
  width: 22px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #42b983;
}

input:checked + .slider:before {
  transform: translateX(24px);
}

.comparison-content {
  background: #f9f9f9;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
