const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));

const users = [];

app.get('/', (req, res) => {
    const signupSuccess = req.cookies.signupSuccess === 'true';

    res.render('index', {signupSuccess});
});

app.get('/signup', (req, res) => {
    res.render('signup');
})

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = users.find((user) => user.username
            === username || user.password === password);
        if (existingUser) {
            return res.status(409).send('이미 존재하는 유저');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        users.push({ username, password: hashedPassword });

        res.cookie('signupSuccess', 'true', {maxAge: 5000})
        res.redirect('/');
    } catch (err) {
        console.error('회원가입 오류:', err);
        res.status(500).send('회원가입에 오류가 발생');

    }
});

console.log(users);

app.listen(3000, () => {
    console.log('server is running on 3000')
})
