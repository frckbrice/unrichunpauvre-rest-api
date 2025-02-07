"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
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
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map