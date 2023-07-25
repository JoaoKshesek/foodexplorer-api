const knex = require('../database/knex');
const {compare} = require('bcryptjs');
const authJwtConfig = require('../configs/auth');
const { sign } = require('jsonwebtoken');
const AppError = require("../utils/AppError.js");

class SessionsController{
    async create(request, response){
        const { email, password } = request.body;
        const user = await knex("users").where({ email }).first();

        if(!user){
            throw new AppError ("E-mail e/ou senha incorreta", 401);
        }

        const passwordMatched = await compare(password, user.password);
        
        if(!passwordMatched){
            throw new AppError ("E-mail e/ou senha incorreta", 401);
        }

        const { secret, expiresIn } = authJwtConfig.jwt;

        const token = sign({}, secret, {
            subject: String(user.id),
            expiresIn
        })

        return response.json({user, token});
    }
};

module.exports = SessionsController;