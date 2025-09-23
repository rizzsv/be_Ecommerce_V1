import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
    const hashedPassword = await bcrypt.hash('user123#oke', 10)

    const admin = await prisma.user.create({
        data: {
            email: 'valeant45',
            password: hashedPassword,
            role: 'USER',
            username: 'valen22',
            StatusAccount: 'Active',
            phoneNum: '0238409294892',
        }
    })
    console.log('✅ Admin created:', admin);
}

main()
.catch((e) => {
    console.error('❌ Error seeding admin:', e);
    process.exit(1);
})
.finally(() => {
     prisma.$disconnect();
})