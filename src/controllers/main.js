const bcryptjs = require('bcryptjs');
const db = require('../database/models');
const { Op, Model } = require("sequelize");
const { use } = require('../routes/main');

const mainController = {

  home: (req, res) => {
    db.Book.findAll({
      where: { state: false },
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
      where: { state: false, id: bookId },
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
    try {
      await db.Book.update(
        { erased: true },
        { where: { id: req.params.id } }
      );
      return res.redirect('/');
    } catch (error) {
      // Manejo de errores, si es necesario
      console.error(error);
      return res.redirect('/');
    }
  },

  authors: (req, res) => {
    db.Author.findAll()
      .then((authors) => {
        res.render('authors', { authors });
      })
      .catch((error) => console.log(error));
  },

  authorBooks: (req, res) => {
    // Implement books by author
    res.render('authorBooks');
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
    // Implement login process
    res.render('home');
  },

  edit: async (req, res) => {
    try {
      const bookId = req.params.id;
      const book = await db.Book.findByPk(bookId, {
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