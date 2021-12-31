function nasa(fastify, options) {
  fastify.get('/nasa', options, (ask, reply) => {
    reply
      .code(200)
      .header('Content-Type', 'application/json; charset=utf-8')
      .send({data: "Stuff from NASA"});
  });
}

module.exports = nasa;
