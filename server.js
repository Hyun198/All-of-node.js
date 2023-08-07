require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const User = require('./model/User');


const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,

    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24,
    }
}));

//database
const connectDB = async ()=>{
    try{
        mongoose.set('strictQuery', false);
        const conn = await mongoose.connect(process.env.DATABASE_URI)
        console.log(`database connected: ${conn.connection.host}`)
    }catch (err){
        console.log(err);
    }
}

connectDB();

app.get('/', (req, res) => {
    const loggedInUser = req.session.user;
    
    res.render('index', { loggedInUser});
});

app.get('/signup', (req, res) => {
    res.render('signup');
})

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne( {username});
        if (existingUser) {
            return res.render('signup', {errorMessage: "이미 사용중인 아이디입니다."})
        }

        const hashedPassword = await bcrypt.hash(password, 10);
       /*  users.push({ username, password: hashedPassword });
        */
        const newUser = new User({
            username,
            password: hashedPassword
        });
        await newUser.save();
        
        return res.render('signup', {successMessage: '회원가입이 완료되었습니다!'})
    } catch (err) {
        console.error('회원가입 오류:', err);
        return res.render('signup', { errorMessage: '회원가입 중 오류가 발생했습니다.'})

    }
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).render('login', {errorMessage:'사용자를 찾을 수 없습니다.' });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).render('login', {errorMessage:'비밀번호가 일치하지 않습니다.' })
        }
        req.session.user = user;

        res.redirect('/');
    } catch (err) {
        console.error('로그인 오류:', err);
        res.status(500).send('로그인에 오류가 발생했습니다.');

    }
});

app.get('/protected', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    const loginUser = req.session.user;

    res.render('protected')
})

app.post('/logout', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/');
    }
    
    req.session.destroy((err) => {
        if (err) {
            console.error("세션 제거 오류:", err);
            return res.status(500).send('로그아웃에 문제 발생');
        }
        res.redirect('/login');
    })
})

app.get('/cgv', (req,res) => {
    res.render('cgv');
})


console.log()
app.listen(process.env.PORT, () => {
    console.log(`server is running on ${process.env.PORT}`)
})
