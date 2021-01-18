
exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
	table.increments('userId');
	table.bigint('discordID').unique().notNullable();
	table.string('username').notNullable();
	table.string('discriminator').notNullable();
	table.integer('currency').notNullable();
	table.integer('stardust').notNullable();
	table.string('nextCommand');
	table.string('location').notNullable().defaultTo('S7');
	table.bigint('lastMessageId');
	table.smallint('secretId');
	table.integer('xp').notNullable().defaultsTo(0);
	table.integer('totalxp').notNullable().defaultsTo(0);
	table.smallint('level').notNullable().defaultsTo(1);
	table.smallint('storage').notNullable().defaultsTo(200);
	table.smallint('itemstorage').notNullable().defaultTo(100);
	table.boolean('gotstarter').notNullable().defaultsTo(false);
	table.timestamp('lastdaily').nullable().defaultsTo(null);
	table.smallint('streak').defaultTo(0);
	table.tinyint('team').defaultsTo(null);
	table.boolean('admin').defaultsTo(false);
	table.json('saved');
	table.timestamp('created_at').defaultTo(knex.fn.now());
	table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
