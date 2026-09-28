const EmbeddedPostgres = require('embedded-postgres').default;
const path = require('path');

async function test() {
  console.log('Initializing embedded postgres...');
  const pg = new EmbeddedPostgres({
    databaseDir: path.join(__dirname, '.pgdata'),
    port: 5432,
    user: 'postgres',
    password: 'password',
    initialDatabase: 'udyog_marg',
    persistent: true,
  });

  try {
    const fs = require('fs');
    if (!fs.existsSync(path.join(__dirname, '.pgdata', 'PG_VERSION'))) {
      await pg.initialise();
      console.log('Database initialized successfully!');
    }
    await pg.start();
    console.log('Postgres started on port 5432!');
  } catch (err) {
    console.error('Error starting embedded postgres:', err);
  }
}

test();
