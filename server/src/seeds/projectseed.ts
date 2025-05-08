import { Pool } from 'pg';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});


async function seedDatabase(rows: number = 50) {
    const client = await pool.connect();
    try {
        console.log(`Seeding ${rows} users...`);
        for (let i = 0; i < rows; i++) {
            const projectname = faker.commerce.productName();
            const description = faker.commerce.productDescription();
            await client.query(
                'INSERT INTO projects (name, description) VALUES ($1, $2)',
                [projectname, description]
            );
        }
        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        client.release();
        await pool.end();
    }
}

const rows = process.argv[2] ? parseInt(process.argv[2]) : 50;
seedDatabase(rows).catch(console.error);