const User = require('../models/User')
const jwt = require('jsonwebtoken')


const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '' };

    //Dublicated Email
    if (err.code === 11000) {
        errors.email = 'That email is already registred';
        return errors;
    }

    //incorrect email
    if (err.message === 'incorrect email') {
        errors.email = 'That email is not registred !'
    }

    //incorrect password
    if (err.message === 'incorrect password') {
        errors.password = 'That password is incorrect !'
    }

    //validation errors
    if (err.message.includes('user validation failed')) {

        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }
    return errors;

}

////////////////////////////////////////////////////////////////
//Generate TOKEN

const maxAge = 3 * 24 * 60 * 60;
const creatToken = (id) => {
    return jwt.sign({ id }, 'bachir secret', { expiresIn: maxAge })
}

module.exports.signup_get = (req, res) => {
    res.render('signup');
}

module.exports.login_get = (req, res) => {
    res.render('login');
}

////////////////////////////////////////////////////////

module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.create({ email, password });
        const token = creatToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(201).json({ user: user._id });
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }

}

////////////////////////////////////////////////////////////

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        const token = creatToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(200).json({ user: user._id });
    }

    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }

}
module.exports.logout_get = (req, res) => {
    res.cookie('jwt', ' ', { maxAge: 1 });
    res.redirect('/')
}