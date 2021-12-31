const fastify = require('fastify')({ logger: true });
const nasaRoute = require('./routes/nasa');
const PORT = 3000;

fastify.register(nasaRoute);
fastify.get('/', function (ask, reply) {
  reply
    .code(200)
    .send({ data: "Hello there! '/' Works just fine!" });
});

function start() {
    fastify.listen(PORT, (err, address) => {
      if (err) {
        fastify.log.error(err);
        process.exit(1);
      }
    });
}

start();
