export async function up(knex) {
  await knex.schema.createTable('blacklisted_tokens', table => {
    table.increments('id').primary();
    table.text('token').notNullable();
    table.timestamp('blacklisted_at').defaultTo(knex.fn.now()); // Quando è stato invalidato
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('blacklisted_tokens');
}
