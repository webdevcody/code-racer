const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestingUser() {
  try {
    await prisma.user.create({
      data: {
        name: 'testinguser',
        // email: 'test@example.com',
        // password: 'securepassword',
      },
    });
  } catch (error) {
    console.error('Error creating testing user: ', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestingUser();
