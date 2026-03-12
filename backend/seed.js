// seed.js
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding the database...')

    // Clean existing data
    await prisma.comment.deleteMany()
    await prisma.reaction.deleteMany()
    await prisma.post.deleteMany()
    await prisma.distractionEvent.deleteMany()
    await prisma.focusSession.deleteMany()
    await prisma.focusRoom.deleteMany()
    await prisma.companyMember.deleteMany()
    await prisma.company.deleteMany()
    await prisma.user.deleteMany()

    // Create users
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash('testpassword', salt)

    const adminUser = await prisma.user.create({
        data: {
            email: 'admin@nazarapp.com',
            name: 'Admin User',
            passwordHash,
            role: 'admin',
        },
    })

    console.log('Created admin test user: admin@nazarapp.com / testpassword')

    const testUser = await prisma.user.create({
        data: {
            email: 'test@example.com',
            name: 'Test Employee',
            passwordHash,
            role: 'employee',
            sessions: {
                create: [
                    {
                        plannedDuration: 60,
                        distractionCount: 2,
                        focusScore: 85.5,
                        startedAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
                        endedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
                        distractions: {
                            create: [
                                { durationMs: 5000 },
                                { durationMs: 12000 }
                            ]
                        }
                    },
                    {
                        plannedDuration: 120,
                        distractionCount: 5,
                        focusScore: 70.0,
                        startedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday
                        endedAt: new Date(Date.now() - 22 * 60 * 60 * 1000),
                    }
                ]
            }
        },
    })

    console.log('Created standard test user: test@example.com / testpassword')

    // Create a company
    const company = await prisma.company.create({
        data: {
            name: 'Acme Corp Focus Team',
            adminId: adminUser.id,
            members: {
                create: [
                    { userId: adminUser.id },
                    { userId: testUser.id }
                ]
            },
            rooms: {
                create: [
                    {
                        name: 'Deep Work Silence',
                        isActive: true,
                        timerEnd: new Date(Date.now() + 45 * 60 * 1000), // 45 mins left
                    },
                    {
                        name: 'QA Session',
                        isActive: false,
                    }
                ]
            },
            posts: {
                create: [
                    {
                        userId: adminUser.id,
                        content: 'Great focus week everyone! Let\'s keep it up 👍',
                        type: 'post',
                        comments: {
                            create: [
                                {
                                    userId: testUser.id,
                                    content: 'Thanks, trying my best!'
                                }
                            ]
                        }
                    }
                ]
            }
        }
    })

    console.log('Created test company: Acme Corp Focus Team with rooms and posts.')

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
