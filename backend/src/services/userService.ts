import prisma from '../prisma';

export async function findUserByPhone(phone: string) {
  return prisma.user.findUnique({ where: { phone } });
}

export async function createUserWithWallet(phone: string, name?: string) {
  const user = await prisma.user.create({
    data: {
      phone,
      name: name || null,
    },
  });

  // create wallet
  await prisma.wallet.create({ data: { userId: user.id, balance: 0 } }).catch(() => {});

  return user;
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}
