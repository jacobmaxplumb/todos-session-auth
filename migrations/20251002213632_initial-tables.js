exports.up = function(knex) {
    return knex.schema
      .createTable('users', function(table) {
        table.increments('id').primary();
        table.string('username').notNullable().unique();
        table.string('password').notNullable();
      })
      .createTable('todos', function(table) {
        table.increments('id').primary();
        table
          .integer('user_id')
          .unsigned()
          .notNullable()
          .references('id')
          .inTable('users')
          .onDelete('CASCADE');
        table.text('text').notNullable();
        table.boolean('completed').notNullable().defaultTo(false);
      });
  };
  
  exports.down = function(knex) {
    return knex.schema
      .dropTableIfExists('todos')
      .dropTableIfExists('users');
  };
  