export async function seed(knex) {
  // Elimina tutti gli utenti esistenti
  await knex('utenti').del();

  // Inserisce nuovi utenti
  await knex('utenti').insert([
    {
      id: 1,
      nome: 'Mario Rossi',
      email: 'mario.rossi@example.com',
      password_hash: 'hashed_password1', // Sostituisci con una password hash reale
    },
    {
      id: 2,
      nome: 'Luigi Bianchi',
      email: 'luigi.bianchi@example.com',
      password_hash: 'hashed_password2',
    },
  ]);
}

