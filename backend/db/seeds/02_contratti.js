export async function seed(knex) {
  // Elimina tutti i contratti esistenti
  await knex('contratti').del();

  // Inserisce nuovi contratti
  await knex('contratti').insert([
    {
      id: 1,
      utente_id: 1,
      nome: 'Giuseppe',
      cognome: 'Verdi',
      data_scadenza: '2025-12-31',
    },
    {
      id: 2,
      utente_id: 2,
      nome: 'Francesca',
      cognome: 'Neri',
      data_scadenza: '2026-06-30',
    },
  ]);
}
