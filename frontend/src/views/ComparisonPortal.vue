<template>
  <div class="comparison-title">
    <h1>Reisevergleichsportal</h1>
    <div class="toggle-container">
      <label class="switch">
        <input type="checkbox" v-model="isChatGPTActive" />
        <span class="slider round"></span>
      </label>
      <span>{{ isChatGPTActive ? "ChatGPT" : "Gemini" }}</span>
    </div>
    <div v-if="isChatGPTActive">
      <ComparisonPortalChatGPT />
    </div>
    <div v-else>
      <ComparisonPortalGemini />
    </div>
  </div>
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

<style>
.comparison-title {
  text-align: center;
  position: relative;
}

.toggle-container {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 25px;
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
  border-radius: 25px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 4px;
  bottom: 3.5px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #2196f3;
}

input:checked + .slider:before {
  transform: translateX(24px);
}
</style>
