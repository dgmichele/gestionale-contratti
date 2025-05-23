export async function up(knex) {
  await knex.schema.createTable('utenti', table => {
    table.increments('id').primary();
    table.string('nome').notNullable();
    table.string('email').notNullable().unique();
    table.string('password_hash').notNullable();
    table.timestamps(true, true); // created_at e updated_at con default now()
  });

  await knex.schema.createTable('contratti', table => {
    table.increments('id').primary();
    table.integer('utente_id').unsigned().references('id').inTable('utenti').onDelete('CASCADE');
    table.string('nome').notNullable(); // nome inquilino
    table.string('cognome').notNullable();
    table.date('data_scadenza').notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('contratti');
  await knex.schema.dropTableIfExists('utenti');
}

