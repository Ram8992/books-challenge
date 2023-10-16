const { body } = require('express-validator');
const db = require("../database/models");
const bcrypt = require('bcryptjs')
const {  Op } = require("sequelize");
const sequelize = require("sequelize");

module.exports = [

    body('contrasenia').exists().notEmpty().withMessage('Debe haber contrasenia'),
    body('email').exists().notEmpty().withMessage('El correo no puede estar vacio').isEmail().withMessage('Debe ser una direccion de correo valida').custom(async (value, { req }) => {
        const user = await db.User.findAll({ where: { Email: value}, raw: true })
        .then(usuarios => usuarios[0]);
        if (!user) {
            throw new Error('Email y/o clave incorrectos')
        }
        if (await bcrypt.compare(req.body.password, user.Pass)) {
            delete user.Pass;
            req.session.userLog = user;
            if (req.body.cookie) {
                res.cookie("recordame", user.email, { maxAge: 1000 * 60 * 60 })
            }
        } else {
            throw new Error('Dato/s incorrecto/s')
        }
    })

]