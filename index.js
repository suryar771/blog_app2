const express = require('express');
const path = require('path');
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');

const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');

const app = express();
const PORT = 8000;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/blogify')
    .then(() => console.log(`MongoDB connected`))
    .catch(err => console.error("MongoDB connection error:", err));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.resolve("./views"));

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); // ❗ CALL this function
app.use(checkForAuthenticationCookie("token")); // ❗ You fixed this earlier

// Routes
app.get('/', (req, res) => {
    res.render("home", {
        user: req.user // ❗ Use comma `,` not semicolon `;`
    });
});

app.use('/user', userRoute);
app.use('/blog',blogRoute);

// Start server
app.listen(PORT, () => {
    console.log(`Server started at PORT: ${PORT}`);
});