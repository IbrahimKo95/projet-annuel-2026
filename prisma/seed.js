import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
    const admin = await prisma.user.create({
        data: {
            name: "Mathurin",
            email: "mathurin@test.com",
            password: "password", // à sécuriser pour prod
            role: "ADMIN",
            image: faker.image.avatar(),
        },
    });

    const users = [admin]; // inclure l'admin dans la liste
    for (let i = 0; i < 10; i++) {
        const user = await prisma.user.create({
            data: {
                name: faker.person.fullName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
                role: faker.helpers.arrayElement(["ADMIN", "INSTRUCTOR", "LEARNER"]),
                image: faker.image.avatar(),
            },
        });
        users.push(user);
    }

    // --- 2. Cours ---
    const courses = [];
    for (let i = 0; i < 5; i++) {
        const instructor = faker.helpers.arrayElement(users.filter(u => u.role === "INSTRUCTOR"));
        const course = await prisma.course.create({
            data: {
                title: faker.lorem.words(3),
                description: faker.lorem.paragraph(),
                category: faker.lorem.word(),
                thumbnail: faker.image.url({ width: 640, height: 480 }),
                instructorId: instructor.id,
                published: faker.datatype.boolean(),
                prerequisites: faker.lorem.sentence(),
            },
        });
        courses.push(course);
    }

    // --- 3. Modules & Lessons ---
    for (const course of courses) {
        for (let i = 0; i < 3; i++) {
            const module = await prisma.module.create({
                data: {
                    title: faker.lorem.words(2),
                    description: faker.lorem.sentence(),
                    order: i + 1,
                    courseId: course.id,
                },
            });

            for (let j = 0; j < 3; j++) {
                await prisma.lesson.create({
                    data: {
                        title: faker.lorem.words(3),
                        content: faker.lorem.paragraph(),
                        order: j + 1,
                        moduleId: module.id,
                        videoUrl: faker.internet.url(),
                    },
                });
            }
        }
    }

    // --- 4. Enrollments ---
    for (const user of users.filter(u => u.role === "LEARNER")) {
        for (const course of courses) {
            if (faker.datatype.boolean()) {
                await prisma.enrollment.create({
                    data: {
                        userId: user.id,
                        courseId: course.id,
                        progress: faker.number.float({ min: 0, max: 100, precision: 0.01 })
                    },
                });
            }
        }
    }

    console.log("Fixtures générées avec succès !");
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });