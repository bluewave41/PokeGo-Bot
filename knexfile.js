// Update with your config settings.

module.exports = {

  development: {
    client: 'mysql2',
    connection: {
      database: 'pokegobot',
      user:     'root',
      password: '',
	  supportBigNumbers: true,
	  bigNumberStrings: true,
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
	  directory: 'knex/migrations',
      tableName: 'knex_migrations'
    }
  },

  staging: {
    client: 'mysql2',
    connection: {
      database: 'pokegobot',
      user:     'root',
      password: '',
	  supportBigNumbers: true,
	  bigNumberStrings: true,
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
	  directory: 'knex/migrations',
      tableName: 'knex_migrations'
    },
  },

  development: {
    client: 'mysql2',
    connection: {
      database: 'pokegobot',
      user:     'root',
      password: '',
	  supportBigNumbers: true,
	  bigNumberStrings: true,
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
	  directory: 'knex/migrations',
      tableName: 'knex_migrations'
    },
  },
};
