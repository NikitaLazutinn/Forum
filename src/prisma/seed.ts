import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  // -------------------------------------------------
  // 1. Seed reference data (ROLES & CATEGORIES)
  // -------------------------------------------------

  const rolesData = [
    { id: 0, name: 'user', discription: '' },
    { id: 1, name: 'moderator', discription: '' },
    { id: 2, name: 'admin', discription: '' },
  ];

  for (const role of rolesData) {
    await prisma.role.upsert({
      where: { id: role.id },
      update: { name: role.name, discription: role.discription },
      create: role,
    });
  }

  const categoriesData = [
    { name: 'Technology', description: 'Posts about tech' },
    { name: 'Lifestyle', description: 'Lifestyle content' },
    { name: 'Travel', description: 'Travel diaries' },
    { name: 'Food', description: 'Recipes & reviews' },
    { name: 'Science', description: 'Research & discoveries' },
  ];

  for (const category of categoriesData) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  // -------------------------------------------------
  // 2. Seed USERS
  // -------------------------------------------------
  const PASSWORD_HASH = await bcrypt.hash('password', 10);
  const RANDOM_USER_COUNT = 25; // +1 admin → 26 total

  // Admin user (roleId = 2)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin',
      roleId: 2,
      password: PASSWORD_HASH,
    },
  });

  const users = [admin];

  for (let i = 0; i < RANDOM_USER_COUNT; i++) {
    const user = await prisma.user.create({
      data: {
        email: `user${i}@example.com`,
        name: faker.person.fullName(),
        roleId: 0,
        password: PASSWORD_HASH,
      },
    });
    users.push(user);
  }

  // -------------------------------------------------
  // 3. Seed POSTS, COMMENTS & LIKES
  // -------------------------------------------------
  const categories = await prisma.category.findMany();

  for (const author of users) {
    const postsPerAuthor = faker.number.int({ min: 1, max: 5 });

    for (let i = 0; i < postsPerAuthor; i++) {
      const postCategories = faker.helpers.arrayElements(
        categories,
        faker.number.int({ min: 1, max: 3 }),
      );

      const post = await prisma.post.create({
        data: {
          title: faker.lorem.sentence(),
          content: faker.lorem.paragraphs(2),
          published: Math.random() < 0.8,
          userId: author.id,
          categories: {
            create: postCategories.map((c) => ({ categoryId: c.id })),
          },
        },
      });

      // Comments
      const commentsPerPost = faker.number.int({ min: 0, max: 5 });
      for (let j = 0; j < commentsPerPost; j++) {
        const commenter = faker.helpers.arrayElement(
          users.filter((u) => u.id !== author.id),
        );
        await prisma.comment.create({
          data: {
            content: faker.lorem.sentences(2),
            userId: commenter.id,
            userName: commenter.name,
            postId: post.id,
          },
        });
      }

      // Likes (avoid duplicate liker per post)
      const maxPossibleLikers = users.length - 1; // exclude author
      const likesPerPost = faker.number.int({ min: 0, max: Math.min(10, maxPossibleLikers) });
      const likers = faker.helpers.arrayElements(
        users.filter((u) => u.id !== author.id),
        likesPerPost,
      );
      for (const liker of likers) {
        await prisma.like.create({
          data: {
            userId: liker.id,
            postId: post.id,
          },
        });
      }
    }
  }

  console.log(
    `✅ Seed complete — ${users.length} users with posts, comments & likes.`,
  );
}

seed()
  .catch((e) => {
    console.error('Seed failed:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
