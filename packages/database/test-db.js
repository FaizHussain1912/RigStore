const { Client } = require('pg');

const testConn = async (name, uri) => {
  const client = new Client({ connectionString: uri, connectionTimeoutMillis: 5000 });
  try {
    await client.connect();
    const res = await client.query('SELECT NOW()');
    console.log(`[SUCCESS] ${name}: connected! Time:`, res.rows[0]);
    await client.end();
  } catch (e) {
    console.error(`[FAIL] ${name}:`, e.message);
  }
};

(async () => {
  const uri = 'postgresql://postgres.eebqqdiyryqqwjpesiol:FaizMuddassir@eebqqdiyryqqwjpesiol.pooler.supabase.com:6543/postgres?pgbouncer=true';
  await testConn(`Custom Pooler`, uri);
})();
