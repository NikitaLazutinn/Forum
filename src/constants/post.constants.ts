export const select = {
  title: true,
  content: true,
  createdAt: true,
  updatedAt: true,
  author: {
    select: {
      id: true,
      name: true,
    },
  },
  comments: {
    select: {
      id: true,
      content: true,
      userId: true,
    },
  },
  categories: {
    select: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
  likes: {
    select: {
      id: true,
      userId: true,
    },
  },
};