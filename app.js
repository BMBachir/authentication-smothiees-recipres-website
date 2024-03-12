const express = require('express');
const app = express();
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes')
const cookieParser = require('cookie-parser')
const { requireAuth, checkuser } = require('./middleware/authMiddleware')


// middleware
app.use(express.static('public'));
app.use(express.json())
app.use(cookieParser())
// view engine
app.set('view engine', 'ejs');

// database connection

const dbURI = 'mongodb+srv://boubaidjabachir3:bachir123@cluster0.saufdqq.mongodb.net/node-auth';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then((result) => {
    app.listen(3000, () => {
      console.log('******************************************************');
      console.log('Server is running on http://localhost:3000');
      console.log('******************************************************');
    });
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err.message);
  });

// routes
app.get('*', checkuser);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes);

//Cookies
app.get('/set-cookies', (req, res) => {

  res.cookie('newUser', false);
  res.cookie('isEmployee', true, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true });

  res.send('you got the cookies!');

});

app.get('/read-cookies', (req, res) => {

  const cookies = req.cookies;
  console.log(cookies.newUser);

  res.json(cookies);
});

