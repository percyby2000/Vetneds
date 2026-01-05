const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv/config');

async function runSchema() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: Faltan las variables de entorno');
    console.log('Necesitas crear un archivo .env.local con:');
    console.log('- NEXT_PUBLIC_SUPABASE_URL');
    console.log('- SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Leer el archivo SQL
  const sqlPath = path.join(__dirname, '01-create-pet-store-schema.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  console.log('📝 Ejecutando schema SQL en Supabase...');

  try {
    // Ejecutar el SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      // Si no existe la función exec_sql, usar el editor SQL del dashboard
      console.log('\n⚠️  No se puede ejecutar directamente.');
      console.log('\n✅ Pasos para ejecutar el schema:');
      console.log('1. Ve a tu proyecto en Supabase: https://supabase.com/dashboard');
      console.log('2. Ve a SQL Editor');
      console.log('3. Copia y pega el contenido de scripts/01-create-pet-store-schema.sql');
      console.log('4. Presiona "Run" para ejecutar el schema');
      console.log('\nO usa la CLI de Supabase:');
      console.log('  npx supabase db push --db-url="postgresql://..."');
    } else {
      console.log('✅ Schema ejecutado exitosamente!');
      console.log(data);
    }
  } catch (err) {
    console.error('❌ Error ejecutando el schema:', err.message);
    console.log('\n✅ Solución: Ejecuta el SQL manualmente en el Dashboard de Supabase');
    console.log('1. Ve a https://supabase.com/dashboard/project/[tu-proyecto]/sql/new');
    console.log('2. Copia el contenido de scripts/01-create-pet-store-schema.sql');
    console.log('3. Haz clic en "Run"');
  }
}

runSchema();
