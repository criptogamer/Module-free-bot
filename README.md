# Module-free-bot
Crear bot, procesar url via API KEY y con nombre de bot transmitir url de forma similar a Telegram bot y botfather.



<h2>Crear bot</h2>

```nodejs








const nuevo_modulo = require('./index.js');

(async () => {
  try {
    const resultado = await nuevo_modulo.createBot('nombre_de_bot_sin_simbolos');

    const creado = resultado.created;
    const existe = resultado.exists;
    const nombreBot = resultado.bot_name;
    const apiKey = resultado.api_key;
    const longitudApiKey = resultado.length;

    console.log('creado:', creado);
    console.log('existe:', existe);
    console.log('nombreBot:', nombreBot);
    console.log('apiKey:', apiKey);
    console.log('longitudApiKey:', longitudApiKey);


process.exit(0);
  } catch (error) {
    console.error('ERROR:', error.message);


process.exit(1);
  }
})();


```



```bash

nano create_bot.js

```

```bash
node create_bot.js

```




<h2>Cargar bot</h2>


```nodejs

const nuevo_modulo = require('./index.js');

(async () => {

const apiKey = "API_KEY_BOT";

const urlBot = 'http://url.com';

  console.log('Enviando URL para api_key:', apiKey);
  console.log('URL:', urlBot);
  console.log('---');

  const res = await nuevo_modulo.setUrlByApiKey(apiKey, urlBot);

  console.log('RESULTADO:', res);

  if (res.error) {
    console.log('ERROR:', res.error);
    console.log('MENSAJE:', res.message);
process.exit(0);



  } else if (res.updated) {
    console.log('✓ URL guardada exitosamente');


process.exit(1);
  } else {
    console.log('✗ No se pudo guardar la URL');



process.exit(1);
  }
})();


```


```bash

nano send_url_bot.js

```


```bash
node send_url_bot.js

```


