import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {

  const roles = [
    { id: 0, name: 'user',    discription: 'Regular user'    },
    { id: 1, name: 'moderator', discription: 'Content moderator' },
    { id: 2, name: 'admin',   discription: 'Administrator'  },
  ];
  for (const r of roles) {
    await prisma.role.upsert({
      where: { id: r.id },
      update: {},
      create: r,
    });
  }


  const categories = [
    { name: 'General', description: 'General discussion' },
    { name: 'Tech',    description: 'Tech talk'          },
    { name: 'News',    description: 'Site news'          },
  ];
  for (const c of categories) {
    await prisma.category.upsert({
      where: { name: c.name },
      update: {},
      create: c,
    });
  }


  const hashedPassword = '…'; 
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email:        'admin@example.com',
      name:         'Site Admin',
      password:     hashedPassword,
      role:         { connect: { id: 2 } }, 
      profilePhoto: null,
    },
  });

  console.log('✅ Seeding finished');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
