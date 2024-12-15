import type { Config } from "drizzle-kit";

import * as dotenv from 'dotenv'

dotenv.config({path:'.env'})

if(!process.env.DATABASE_URL){
    console.log(`Cant find DB url`)
}

export default {
    schema: "./src/lib/supabase/schema.ts",
    out: "./migrations", // path to where migrations are stored
    driver: "pg", // or "mysql", "sqlite" depending on your database
    dbCredentials: {
        connectionString: process.env.DATABASE_URL || '', // or other database connection parameters
    }
} satisfies Config;