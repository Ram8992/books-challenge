const express = require('express');
const mainController = require('../controllers/main');
const loginValidation = require('../middlewares/loginValidation');
const admMiddleware = require('../middlewares/admMiddleware');
const logMiddleware = require('../middlewares/logMiddleware');

const router = express.Router();

router.get('/', mainController.home);
router.get('/books/detail/:id', mainController.bookDetail);
router.get('/books/search', mainController.bookSearch);
router.post('/books/search', mainController.bookSearchResult);
router.get('/authors', mainController.authors);
router.get('/authors/:id/books', mainController.authorBooks);
router.get('/users/register', mainController.register);
router.post('/users/register', mainController.processRegister);
router.get('/users/login', mainController.login);
router.post('/users/login', loginValidation, mainController.processLogin);
router.get('/users/logout', logMiddleware, mainController.logOut);
router.delete('/books/:id', admMiddleware, mainController.deleteBook);
router.get('/books/edit/:id', admMiddleware, mainController.edit);
router.put('/books/edit/:id', admMiddleware, mainController.processEdit);

module.exports = router;
