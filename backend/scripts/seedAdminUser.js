import "dotenv/config";
import db from "../src/models/index.js";
import bcrypt from "bcrypt";

const createAdminUser = async () => {
    try {
        await db.sequelize.sync({ force: false });
        console.log("Database synchronized.");

        const adminUser = {
            fullName: "Administrator",
            email: "admin@example.com",
            password: "admin123456",
            role: "admin"
        };

        const existingUser = await db.users.findOne({ 
            where: { email: adminUser.email } 
        });

        if (existingUser) {
            console.log("Admin user already exists with this email.");
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(adminUser.password, 10);

        const newAdmin = await db.users.create({
            fullName: adminUser.fullName,
            email: adminUser.email,
            password: hashedPassword,
            role: adminUser.role
        });

        console.log("✓ Admin user created successfully!");
        console.log("Email:", adminUser.email);
        console.log("Password:", adminUser.password);
        console.log("Role:", adminUser.role);

        process.exit(0);
    } catch (error) {
        console.error("Error creating admin user:", error.message);
        process.exit(1);
    }
};

createAdminUser();
