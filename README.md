# Gestionale Contratti

## 📝 Descrizione

Si tratta di un **gestionale per contratti di affitto**, dove ogni utente può:

- Registrarsi e fare il login
- Aggiungere, modificare o eliminare contratti
- Visualizzare la propria lista di contratti
- Vedere immediatamente dalla UI:
  - contratti in scadenza (entro una settimana),
  - contratti che scadono il giorno stesso,
  - contratti scaduti.

L'app funziona grazie ad **un'API backend con Express + Postgres (Knex)** e **un frontend React** protetto da autenticazione JWT.

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

**Deploy**

- Server: Render (free)
- Database: Supabase (free)
- Client: Netlify (free)

---

## 🏹 Come lanciare il progetto

### 1. Clona la repository:

- Fai: `git clone https://github.com/dgmichele/gestionale-contratti.git`

- E poi: `cd gestionale-contratti`

Da qui puoi muoverti nella cartella `frontend` o `backend` in base alle tue esigenze di modifica o creazione di nuove logiche.

### 2. Configura le variabili d'ambiente:

#### Backend

- Per lavorare da locale, crea un file .env di sviluppo `.env.dev`:

  NODE_ENV=development

  DB_HOST=localhost

  DB_PORT=5432

  DB_NAME=gestionale-contratti

  DB_USER=postgres

  DB_PASSWORD=tuapassword

  JWT_SECRET=tuo_segreto

  JWT_SECRET_REFRESH=tuo_segreto

- per la modalità produzione crea invece un file `.env.production` (per collegarti al DB online come Supabase):

  NODE_ENV=production

  DATABASE_URL=il_tuo_link_supabase

  JWT_SECRET=tuo_segreto

  JWT_SECRET_REFRESH=tuo_segreto

È importante che imposti le variabili di produzione nella sezione dedicata all'interno del server online che sceglierai, come Render. In questo modo Render si collega a Supabase e permette di rendere il DB raggiungibile dal client.

#### Frontend

Crea un file `.env`:

    VITE_API_BASE_URL=il_tuo_link_Render

Inserisci l'url del server fornito da Render (o il tool che scegli) per sviluppare con il server di produzione, in alternativa inserisci http://localhost:5000 per sviluppare con il server locale. È fondamentale che includi questa variabile (quella di "produzione", quindi del link Render per esempio) nella sezione dedicata alle variabili d'ambiente del tool dove deployerai il client, come Netlify.

### 3. Migrazioni

- È importante fare le migrazioni per settare le tabelle del database, quindi fai così (le tabelle sono già pronte, devono solo essere migrate nel DB):

  `npx knex migrate:latest --knexfile db/knexfile.js`

  Questo comando ti permetterà di migrare le tabelle nel database online e in locale (ad esempio su PG Admin).

## 💻 Testa il progetto

Clicca qui: https://gestionale-contratti-base.netlify.app/
