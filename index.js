const db = require('./db');

function generarApiKey74() {
  const caracteres = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let apiKey = '';
  
  for (let i = 0; i < 74; i++) {
    const indice = Math.floor(Math.random() * caracteres.length);
    apiKey += caracteres[indice];
  }
  
  return apiKey;
}

async function inicializarBaseDeDatos() {
  try {
    const queryTabla = `
      CREATE TABLE IF NOT EXISTS bots (
        id INT AUTO_INCREMENT PRIMARY KEY,
        bot_name VARCHAR(100) NOT NULL UNIQUE,
        api_key CHAR(74) NOT NULL UNIQUE,
        url_bot TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `;

    await db.execute(queryTabla);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function createBot(bot_name) {
  await inicializarBaseDeDatos();

  if (!bot_name || typeof bot_name !== 'string') {
    throw new Error('bot_name es obligatorio');
  }

  const nombreLimpio = bot_name.trim();

  const [rows] = await db.execute(
    'SELECT id FROM bots WHERE bot_name = ? LIMIT 1',
    [nombreLimpio]
  );

  if (rows.length > 0) {
    return {
      created: false,
      exists: true,
      message: 'El bot ya existe'
    };
  }

  const api_key = generarApiKey74();

  await db.execute(
    'INSERT INTO bots (bot_name, api_key, url_bot) VALUES (?, ?, ?)',
    [nombreLimpio, api_key, null]
  );

  return {
    created: true,
    exists: false,
    bot_name: nombreLimpio,
    api_key,
    length: api_key.length
  };
}

async function setUrlByApiKey(api_key, url_bot) {
  if (!api_key || !url_bot) {
    throw new Error('api_key y url_bot son obligatorios');
  }

  if (typeof api_key !== 'string' || api_key.length !== 74 || !/^[0-9a-z]+$/.test(api_key)) {
    return {
      updated: false,
      exists: false,
      error: 'apikey es incorrecta',
      message: 'El formato de la api_key no es válido (debe ser 74 caracteres alfanuméricos en minúscula)'
    };
  }

  const [checkRows] = await db.execute(
    'SELECT id FROM bots WHERE api_key = ? LIMIT 1',
    [api_key]
  );

  if (checkRows.length === 0) {
    return {
      updated: false,
      exists: false,
      error: 'apikey no existe',
      message: 'No se encontró ningún bot con esta api_key'
    };
  }

  const [result] = await db.execute(
    'UPDATE bots SET url_bot = ? WHERE api_key = ?',
    [url_bot, api_key]
  );

  return {
    updated: result.affectedRows > 0,
    exists: true,
    affectedRows: result.affectedRows
  };
}

async function getBotPublicDataByName(bot_name) {
  try {
    if (!bot_name || typeof bot_name !== 'string') return null;

    const [rows] = await db.execute(
      'SELECT bot_name, url_bot FROM bots WHERE bot_name = ? LIMIT 1',
      [bot_name.trim()]
    );

    if (!rows[0]) {
      return null;
    }

    return rows[0];
  } catch (err) {
    console.log(err);
    return null;
  }
}



module.exports = {
  createBot,
  setUrlByApiKey,
  getBotPublicDataByName
};
