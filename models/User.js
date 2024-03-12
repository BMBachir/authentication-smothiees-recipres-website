const mongoose = require('mongoose')
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({

    email: {
        type: String,
        required: [true, 'Please entre the email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please entre a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please entre the email'],
        minlength: [6, 'Minimum password length is 6 characters']
    },

});

/* We going to use this fire function befor doc saved
 on Data Base to hash password befor saved */

userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt)
    next();
});

// static method to login user
userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
};


//This fire function after doc saved on Data Base 

/* userSchema.post('save', function (doc, next) {
    console.log('New user was creates and saved ', doc);
    next();
}); */

//This fire function befor doc saved on Data Base 

/* userSchema.pre('save', function (next) {
    console.log('User about to be created and saved ', this);
    next();
}); */

const User = mongoose.model('user', userSchema);
module.exports = User;