<template>
  <footer>
    <div class="footer-content">
      <p>&copy; 2023 KI-gestützter Reiseplaner. Alle Rechte vorbehalten.</p>
      <div class="footer-links">
        <a href="#">Datenschutz</a>
        <a href="#">Impressum</a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
footer {
  background-color: #333;
  color: white;
  text-align: center;
  padding: 1.5rem 1rem;
  width: 100%;
  margin-top: 3rem;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.footer-links {
  display: flex;
  gap: 1.5rem;
  font-size: 0.9rem;
}

.footer-links a {
  color: #42b983;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: white;
}

@media (max-width: 600px) {
  .footer-links {
    flex-direction: column;
    gap: 0.3rem;
  }
}
</style>
