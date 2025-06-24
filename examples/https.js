'use strict'

const fs = require('node:fs')
const path = require('node:path')
const fastify = require('../fastify')({
  https: {
    key: fs.readFileSync(path.join(__dirname, '../test/https/fastify.key')),
    cert: fs.readFileSync(path.join(__dirname, '../test/https/fastify.cert'))
  },
  logger: true
})

const opts = {
  schema: {
    response: {
      '2xx': {
        type: 'object',
        properties: {
          hello: {
            type: 'string'
          }
        }
      }
    }
  }
}

fastify
  .get('/', opts, function (req, reply) {
    reply.header('Content-Type', 'application/json').code(200)
    reply.send({ hello: 'world' })
  })

fastify.post('/insecure-route', {
  handler: (req, reply) => {
    const body = req.query.body
    if (body.name.length > 50) {
      reply.send(400)
      return
    }
    reply.send(200)
  }
})

fastify.listen({ port: 3000 }, err => {
  if (err) {
    throw err
  }
})
