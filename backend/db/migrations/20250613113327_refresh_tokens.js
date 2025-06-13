export async function up(knex) {
  await knex.schema.createTable('refresh_tokens', table => {
    table.increments('id').primary();
    table.integer('utente_id')
      .notNullable()
      .references('id')
      .inTable('utenti')
      .onDelete('CASCADE'); // Se l'utente è eliminato, anche i refresh_token collegati vanno eliminati

    table.text('token').notNullable();

    table.timestamp('created_at').defaultTo(knex.fn.now()); // Quando è stato rilasciato
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('refresh_tokens');
}

