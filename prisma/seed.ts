import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

async function main() {

  const user = await prisma.user.create({
    data: {
      name: 'joe dohn',
      email: 'joedohn@gmail.com',
      avartarUrl: 'https://github.com/jonathannrocha.png',
    }
  })

  const pool = await prisma.pool.create({
    data: {
      title: 'Example Pool',
      code: 'BOL1234',
      ownerId: user.id,

      participants: {
        create: {
          userId: user.id
        }
      }

    }
  })

  await prisma.game.create({
    data: {
      date: '2022-11-07T00:54:25.092Z',
      firtTeamCountryCode: 'DE',
      secondTeamCountryCode: 'BR'
    }
  })

  await prisma.game.create({
    data: {
      date: '2022-11-20T00:54:25.092Z',
      firtTeamCountryCode: 'BR',
      secondTeamCountryCode: 'AR',

      guesses: {
        create: {
          firtTeamPoints: 2,
          secondTeamPoinst: 1,
          participant: {
            connect: {
              userId_poolId: {
                userId: user.id,
                poolId: pool.id
              }
            }
          }
        }
      }
    }
  })

}

main()
