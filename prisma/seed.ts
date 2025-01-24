// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// initialize Prisma Client
const prisma = new PrismaClient();
const roundsOfHashing = 10;

async function main() {
    const passwordSabin = await bcrypt.hash('password-sabin', roundsOfHashing);
    const passwordAlex = await bcrypt.hash('password-alex', roundsOfHashing);

    const user1 = await prisma.user.upsert({
        where: { username: 'sabin@adams.com' },
        update: {
            mdpUser: passwordSabin,
        },
        create: {
            username: 'sabin@adams.com',
            nomUser: 'Sabin Adams',
            mdpUser: passwordSabin,
        },
    });

    const user2 = await prisma.user.upsert({
        where: { username: 'alex@ruheni.com' },
        update: {
            mdpUser: passwordAlex,
        },
        create: {
            username: 'alex@ruheni.com',
            nomUser: 'Alex Ruheni',
            mdpUser: passwordAlex,
        },
    });
    // create two dummy articles
    //   const post1 = await prisma.publication.upsert({
    //     where: { imagePub: '' },
    //     update: {},
    //     create: {
    //       libelePub: 'Prisma Adds Support for MongoDB',
    //     etat: false,
    //     },
    //   });

    //   const post2 = await prisma.publication.upsert({
    //     where: { title: "What's new in Prisma? (Q1/22)" },
    //     update: {},
    //     create: {
    //       title: "What's new in Prisma? (Q1/22)",
    //       body: 'Our engineers have been working hard, issuing new releases with many improvements...',
    //       description:
    //         'Learn about everything in the Prisma ecosystem and community from January to March 2022.',
    //       published: true,
    //     },
    //   });

    // console.log({ post1, post2 });
}

// execute the main function
main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        // close Prisma Client at the end
        await prisma.$disconnect();
    });

