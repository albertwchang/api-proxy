require('dotenv').config();
const fastify = require('fastify')({ logger: true });
const weatherRoute = require('./routes/weather');
const PORT = 3000;

fastify.register(weatherRoute, {prefix: '/v1'});
fastify.get('/', function (ask, reply) {
  reply
    .code(200)
    .send({ data: "Hello there! '/' Works just fine!" });
});

fastify.listen(PORT, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
