import { Sequelize } from "sequelize-typescript";
import { User } from "src/user/user.model";

const sequelize = new Sequelize({
    dialect: "mysql",
    host: "localhost",
    port:3306,
    username:"root",
    password:"197508",
    database:"blood_bank_system",
    models:[User]
})
