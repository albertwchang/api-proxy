const rdis = require('redis');
const Fetch = require('node-fetch');
const API_KEY = process.env.API_KEY_WEATHER;

module.exports = function(fastify, options, done) {
  const cache = rdis.createClient();
  cache.on('error', e => console.log(`Problem w/ Redis: ${e}`));
  ['exit', 'SIGINT'].forEach(code => process.on(code, e => cache.quit()));
  cache.connect();

  fastify.get('/weather', function(ask, reply) {
    reply
      .code(200)
      .header('Content-Type', 'application/json; charset=utf-8')
      .send({data: "Get reql-time weather data from OpenWeatherMap API"});
  });

  fastify.get('/weather/:zip', async function(ask, reply) {
    const {zip} = ask.params;
    let code;
    let results = await cache.get(zip);

    console.log("Keys for process.env...");
    for (const key in process.env) {
	console.log(`*** ${key}`);
    }

    if (results) {
      code = 200;
      console.log(`*** Fetched ${zip} weather data from cache`);
    } else {
      const queryParams = new URLSearchParams({zip: zip +',us', appid: API_KEY});
      const askUrl = `https://api.openweathermap.org/data/2.5/weather?${queryParams}`;

      try {
        const response = await Fetch(askUrl);
        results = await response.text();
        const cacheTTL = 60 * 10; // 10min
        await cache.setEx(zip, cacheTTL, results);
        console.log(`*** Cached weather data for ${zip}`);
        code = 200;
      } catch (e) {
        code = 404;
        results = e;
        console.log("Couldn't fetch weather data: ", e);
      }
    }

    reply
      .code(code)
      .header('Content-Type', 'application/json; charset=utf-8')
      .send({data: JSON.parse(results)});
  });

  done();
};
