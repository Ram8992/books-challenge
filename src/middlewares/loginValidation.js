const { body } = require('express-validator');
const db = require("../database/models");
const bcrypt = require('bcryptjs');
const {  Op } = require("sequelize");
const sequelize = require("sequelize");

module.exports = [

    body('contrasenia').exists().notEmpty().withMessage('La contraseña no debe ser vacía'),
    body('email')
      .exists()
      .notEmpty()
      .withMessage('El correo no puede estar vacío')
      .isEmail()
      .withMessage('Debe ser una dirección de correo válida')
      .custom(async (value, { req }) => {
        const user = await db.User.findAll({ where: { email: value, erased: false }, raw: true })
          .then(usuarios => usuarios[0]);
        if (!user) {
          throw new Error('Email y/o clave incorrectos');
        }
        if (await bcrypt.compare(req.body.contrasenia, user.password)) {
          delete user.password;
          req.session.userLog = user;
          if (req.body.cookie) {
            // Utiliza el middleware de cookies para configurar la cookie.
            res.cookie("recordame", user.email, { maxAge: 1000 * 60 * 60 });
          }
        } else {
          throw new Error('Email y/o clave incorrectos');
        }
      })

];