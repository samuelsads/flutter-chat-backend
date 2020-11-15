/**
 * path: api/login
 */

const { Router } = require('express');
const { check } = require('express-validator');
const { crearUsuario, login, renewToken } = require('../controllers/auth');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validateInputs } = require('../middlewares/validate-inputs');

const router  = Router();

router.post('/',[
    check('email','El email es obligatorio').not().isEmpty(),
    check('password','El password es obligatorio').not().isEmpty(),
    validateInputs
] , login);

router.post('/new', [
    check('name','El nombre es obligatorio').not().isEmpty(),
    check('email','El email es obligatorio').not().isEmpty(),
    check('password','El password es obligatorio').not().isEmpty(),
    validateInputs
] ,crearUsuario);

router.get('/renew',validarJWT,renewToken);

module.exports = router;
