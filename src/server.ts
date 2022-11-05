import Fastify from "fastify";
import { PrismaClient } from "@prisma/client";
import cors from "@fastify/cors"
import { z } from 'zod';
import ShortUniqueId from "short-unique-id"

const prisma = new PrismaClient({
  log: ['query'],
})

async function bootstrap() {


  const fastify = Fastify({
    logger: true,

  })

  await fastify.register(cors, {
    origin: true,
  })

  fastify.get('/pools/count', async () => {
    const count = await prisma.pool.count();

    return { count }
  })

  fastify.get('/users/count', async () => {
    const count = await prisma.user.count();

    return { count }
  })

  fastify.get('/guesses/count', async () => {
    const count = await prisma.guess.count();

    return { count }
  })

  fastify.post('/pools', async (request, reply) => {
    const creatPoolObject = z.object({
      title: z.string(),
    })
    const generateUniqueId = new ShortUniqueId({ length: 6 })

    const { title } = creatPoolObject.parse(request.body)
    const code = String(generateUniqueId()).toUpperCase()

    if (!title) return Error('teste')

    await prisma.pool.create({
      data: {
        title,
        code,
      }
    })

    return reply.status(201).send({
      code
    })

  })

  fastify.listen({ port: 3333 }, (err, address) => {

    if (err) {
      fastify.log.error(err)
      process.exit(1)

    }
    // Server is now listening on ${address}
  })
}

// paramos em 35:23
bootstrap()