require('express-async-errors');
require("dotenv/config")

const AppError = require('./utils/AppError');
const uploadConfig = require('./configs/upload');
const initCors = require("cors");
const databaseMigrationsRun = require('./database/sqlite/migrations');
const express = require("express");
const routes = require('./routes');

databaseMigrationsRun();

const app = express();

app.use(initCors())
app.use(express.json());
app.use("/files/mealFiles", express.static(uploadConfig.UPLOADS_FOLDER))
app.use(routes)
app.use((error, request, response, next) => {
    if(error instanceof AppError) {
        return response.status(error.statusCode).json({
            status: 'error',
            message: error.message
        });
    }
    console.error(error);
    return response.status(500).json({
        status: 'error',
        message: "Internal server error"
    })
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
    console.log(`O servidor local com node está rodando na porta: ${PORT}`)
});