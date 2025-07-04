import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
    const hashedPassword = await bcrypt.hash('AdminValeantFasco', 10)

    const admin = await prisma.user.create({
        data: {
            email: 'okeokeoke@gmail.com',
            password: hashedPassword,
            role: 'ADMIN',
            username: 'admin',
            phoneNum: '081234567890',
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