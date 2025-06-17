# Gestionale Contratti

## 📝 Descrizione

Si tratta di un **gestionale per contratti di affitto**, dove ogni utente può:

- Registrarsi, autenticarsi e fare il login
- Aggiungere, modificare o eliminare contratti
- Visualizzare la propria lista di contratti
- Vedere immediatamente dalla UI:
  - contratti in scadenza (tra 3 giorni),
  - contratti che scadono il giorno stesso,
  - contratti scaduti.

È organizzato come **un'API backend con Express + Postgres (Knex)** e **un frontend React** protetto da autenticazione JWT.

---

## ⭐ Caratteristiche principali

✅ **Autenticazione JWT (con access, refresh, blacklist token)**

✅ **API CRUD per contratti**

✅ **Rotte protette dal login**

---

## 🛠 Tecnologie principali

**Backend:**

- Node.js
- Express
- Knex
- Postgres
- JWT
- Bcrypt
- CORS
- Dotenv

**Frontend:**

- React
- React Router
- React Query
- Axios
- Vite

---

## 🏹 Come lanciare il progetto

### 1. Clona la repository:

git clone <url-tuo-repo>

cd gestionale-contratti

### 2. Configura le variabili d'ambiente:

#### Backend

- Dovrai creare un file .env di sviluppo `.env.dev`:

  NODE_ENV=development
  DB_HOST=localhost
  DB_PORT=5432
  DB_NAME=gestionale-contratti
  DB_USER=postgres
  DB_PASSWORD=tuapassword
  JWT_SECRET=tuo_segreto
  JWT_SECRET_REFRESH=tuo_segreto

- e produzione `.env.production` (per collegarti al DB online come Supabase):

  NODE_ENV=production
  DATABASE_URL=il_tuo_link_supabase
  JWT_SECRET=tuo_segreto
  JWT_SECRET_REFRESH=tuo_segreto

È importante che imposti le variabili di produzione nella sezione dedicata all'interno del server online che sceglierai, come Render. In questo modo Render si collega a Supabase e permette di rendere il DB raggiungibile dal client.

#### Frontend

Crea un file `.env.dev`:

    VITE_API_BASE_URL=il_tuo_link_Render

Inserisci l'url del server fornito da Render (o il tool che scegli) per sviluppare in produzione, in alternativa inserisci http://localhost:5000 per sviluppare in locale. È fondamentale che includi questa variabile nella sezione dedicata alle variabili d'ambiente del tool dove deployerai il client, come Netlify.

### 3. Migrazioni

- È importante fare le migrazioni per settare le tabelle, quindi fai così:

  npx cross-env NODE_ENV=development knex migrate:latest --knexfile db/knexfile.js (modalità sviluppo)
  npx cross-env NODE_ENV=development knex migrate:latest --knexfile db/knexfile.js (modalità produzione)

## 💻 Testa il progetto

Clicca qui: https://gestionale-contratti-base.netlify.app/
