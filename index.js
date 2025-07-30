const express = require('express');
const path = require('path');
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');

const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');

const Blog = require('./models/blog');

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
app.use('/uploads', express.static(path.resolve('./public/uploads')));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); // ❗ CALL this function
app.use(checkForAuthenticationCookie("token")); // ❗ You fixed this earlier

// Routes
app.get('/', async (req, res) => {
    const allBlogs = await Blog.find({}).sort({ createdAt: -1 });
    res.render("home", {
        user: req.user,
        blogs: allBlogs,
    });
});

app.use('/user', userRoute);
app.use('/blog',blogRoute);

// Start server
app.listen(PORT, () => {
    console.log(`Server started at PORT: ${PORT}`);
});