const bcryptjs = require('bcryptjs');
const db = require('../database/models');
const { Op, Model } = require("sequelize");
const { use } = require('../routes/main');
const { validationResult } = require('express-validator');

const mainController = {

  home: (req, res) => {
    db.Book.findAll({
      where: { Borrado: false },
      include: [{ association: 'authors' }]
    })
      .then((books) => {
        res.render('home', { books });
      })
      .catch((error) => console.log(error));
  },

  bookDetail: (req, res) => {
    const bookId = req.params.id;

    db.Book.findByPk(bookId, {
      where: { Borrado: false, id: bookId },
      include: [{ association: 'authors' }]
    })
      .then((book) => {
        if (!book) {
          return res.status(404).render('error', { message: 'No encontrado' });
        }

        res.render('bookDetail', { book });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).render('error', { message: 'Error en el servidor' });
      });
  },

  bookSearch: (req, res) => {
    res.render('search', { books: [] });
  },

  bookSearchResult: async (req, res) => {
    try {
      const booksList = await db.Book.findAll({
        where: {
          title: {
            [Op.like]: "%" + req.body.title + "%"
          }
        }
      });
      return res.render('search', { books: booksList });
    } catch (error) {
      // Manejo de errores, si es necesario
      console.error(error);
      return res.redirect('/');
    }
  },

  deleteBook: async (req, res) => {
    await db.Book.update({Borrado: true},
      {
      where: {
          id: req.params.id,
      }
  });
      return res.redirect('/')
  },

  authors: (req, res) => {
    db.Author.findAll()
      .then((authors) => {
        res.render('authors', { authors });
      })
      .catch((error) => console.log(error));
  },

  authorBooks:async (req, res) => {
    try {
      await db.Author.findByPk(req.params.id, {
      include: [{ association: 'books' }]
      }).then((author) => {
      return res.render('authorBooks', { author: author });})
    } catch (error) {
      // Manejo de errores, si es necesario
      console.error(error);
      return res.redirect('/');
    }
  },

  register: (req, res) => {
    res.render('register');
  },

  processRegister: (req, res) => {
    db.User.create({
      name: req.body.name,
      email: req.body.email,
      country: req.body.country,
      pass: bcryptjs.hashSync(req.body.password, 10),
      CategoryId: req.body.category
    })
      .then(() => {
        res.redirect('/');
      })
      .catch((error) => console.log(error));
  },

  login: (req, res) => {
    // Implement login process
    res.render('login');
  },

  processLogin: (req, res) => {
    const errors = validationResult(req)
    console.log(errors)
    if (!errors.isEmpty()) {
      return res.render('login', { errors: errors.mapped() })
    }
    return res.redirect('/') 
  },

  logOut: async (req, res) =>  {
    req.session.destroy();
    res.clearCookie('recordame')
    return res.redirect('/')
  },

  edit: async(req, res) => {
    try {
      const bookId = req.params.id;
      const book = await db.Book.findByPk(bookId,{where: {Borrado: false}}, {
        include: [{ association: 'authors' }]
      });

      if (!book) {
        return res.status(404).render('error', { message: 'No encontrado' });
      }

      return res.render('editBook', { book });
    } catch (error) {
      console.error(error);
      return res.status(500).render('error', { message: 'Error en el servidor' });
    }
  },

  processEdit: async (req, res) => {
    try {
      const obj = {
        title: req.body.title,
        description: req.body.description,
        cover: req.body.cover
      };

      await db.Book.update(obj, {
        where: {
          id: req.params.id
        }
      });

      return res.redirect('/');
    } catch (error) {
      console.error(error);
      return res.status(500).render('error', { message: 'Error en el servidor' });
    }
  }
};

module.exports = mainController;