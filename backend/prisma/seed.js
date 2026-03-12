import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding NazarApp database...')

    // Create User
    const passwordHash = await bcrypt.hash('nazar123', 10)
    const user = await prisma.user.upsert({
        where: { email: 'demo@nazar.app' },
        update: {},
        create: {
            email: 'demo@nazar.app',
            name: 'Nazar Demo',
            passwordHash,
            role: 'employee',
        },
    })

    // Create Company
    const company = await prisma.company.create({
        data: {
            name: 'Nazar Startup',
            adminId: user.id,
        },
    })

    // Add Member
    await prisma.companyMember.create({
        data: { userId: user.id, companyId: company.id }
    })

    // Create dummy sessions
    const now = new Date()
    for (let i = 0; i < 7; i++) {
        const date = new Date()
        date.setDate(now.getDate() - i)
        await prisma.focusSession.create({
            data: {
                userId: user.id,
                plannedDuration: 50,
                startedAt: date,
                endedAt: new Date(date.getTime() + 45 * 60000),
                distractionCount: Math.floor(Math.random() * 5),
                focusScore: 85 + Math.random() * 15,
            }
        })
    }

    // Create posts
    await prisma.post.create({
        data: {
            userId: user.id,
            companyId: company.id,
            content: 'Just finished a 90min deep work session! Feel productive. 🚀',
            type: 'achievement'
        }
    })

    console.log('Seed finished successfully!')
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
