# 🌍 KI-Reiseplaner

Dies ist das **KI-Reiseplaner**-Projekt, das das **Frontend** und das **Backend** als separate Workspaces enthält. Es ermöglicht, beide Teile der Anwendung gleichzeitig zu entwickeln und zu starten. Es beinhaltet ein Vergleichsportal sowie Überraschungsreisen. Darüber hinaus können exklusive und luxuriöse Reisen angeboten werden.

## 📁 Struktur

ki-reiseplaner/\
├── frontend/ # Frontend-Projekt (Vue, Vite)\
└── backend/ # Backend-Projekt (Node.js, Express)

## 📑 .env Beispiel

Sowohl im **Frontend** als auch im **Backend** benötigst du eine `.env`-Datei für Umgebungsvariablen. Beispiel:

**Frontend**:

```
VITE_BACKEND_URL=http://localhost:3000
```

**Backend**:

```
FRONTEND_URL=http://localhost:5173

GEMINI_API_KEY=YOUR_GEMINI_KEY
OPENAI_API_KEY=YOUR_OPENAI_KEY
```

## 🚀 Entwicklung starten

Um sowohl das **Frontend** als auch das **Backend** gleichzeitig zu starten, verwende den folgenden Befehl:

```bash
npm dev
```

Dies wird sowohl den Vite-Entwicklungsserver für das Frontend als auch den Express-Server für das Backend gleichzeitig starten.

### Einzelne Teile starten

Falls du nur das **Frontend** oder nur das **Backend** starten möchtest, kannst du auch diese spezifischen Befehle verwenden:

- **Frontend**:

  ```bash
  npm run dev:frontend
  ```

- **Backend**:

  ```bash
  npm run dev:backend
  ```
