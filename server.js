require('dotenv').config();
const multer = require('multer');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const puppeteer = require('puppeteer');
const fs = require('fs/promises')
const path = require('path')
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const schedule = require('node-schedule');

const getTime = require('./index');
const crawling = require('./crawling');


const User = require('./model/User');
const Post = require('./model/Post');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));
app.use(methodOverride('_method'));


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


app.get('/', async (req, res) => {
    
    try {
        const users = await User.find();
        const loggedInUser = await req.session.user;
        const posts = await Post.find();
        res.render('home', { users,posts,loggedInUser });
    } catch (err) {
        console.error('유저 정보 가져오기 오류:', err);
        res.status(500).send('유저 정보를 가져오는데 오류가 생겼습니다.');    
    }
});

app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.render('users', {users});
    } catch (err) {
        console.error('유저 정보 불러오기 오류', err);
        res.status(500).send('유저 정보 불러오기 오류');
    }
    
    
})

app.get('/signup', (req, res) => {
    res.render('signup');
})

app.post('/signup',  upload.single("profileImage"), async (req, res) => {
    const { username, password, birthdate } = req.body;
    try {
        const existingUser = await User.findOne( {username});
        if (existingUser) {
            return res.render('signup', {errorMessage: "이미 사용중인 아이디입니다."})
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        

        const newUser = new User({
            username,
            password: hashedPassword,
            birthdate: new Date(birthdate),
            profileImage: {
                data: req.file.buffer,
                contentType: req.file.mimetype,
            },
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
        const loggedInUser = {
            id: user._id,
            username: user.username,
            birthdate: new Date(user.birthdate),
        }
        
        req.session.user = loggedInUser;

        res.redirect('/');
    } catch (err) {
        console.error('로그인 오류:', err);
        res.redirect('/login');

    }
});

app.get('/profile', (req, res) => {
    const loggedInUser = req.session.user;
    
    if (!req.session.user) {
        return res.redirect('/login');
    }
   

    res.render('profile',{ user: loggedInUser})
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
        res.redirect('/');
    })
})

app.get('/profile-image/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user || !user.profileImage) {
            return res.status(404).send('이미지를 찾을 수 없습니다.');
        }

        res.set('Content-Type', user.profileImage.contentType);
        res.send(user.profileImage.data);
    } catch (error) {
        console.error('이미지 불러오기 오류:', error);
        res.status(500).send('이미지 불러오기에 오류가 발생했습니다.');
    }
});


app.get('/profile/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);

        if (!user) {
            return res.status(404).send('유저를 찾을 수 없습니다.');
        }
        const loggedInUser = req.session.user;
       /*  console.log(user)
        console.log(loggedInUser);
 */
        // 로그인된 유저와 프로필 페이지의 유저를 비교하여 같으면 true, 다르면 false
        const isSameUser = loggedInUser && user._id.toString() === loggedInUser.id.toString();
        
        
        res.render('profile', { user,loggedInUser, isSameUser });
    } catch (err) {
        console.error('프로필 페이지 오류:', err);
        return res.status(500).send('프로필 페이지 로등 중 오류가 발생했습니다.');
    }
});

app.get('/edit-profile/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send('유저를 찾을 수 없습니다.');
        }
        
        res.render('profile-edit', { user });

    } catch (err) {
        console.error('프로필 수정 페이지 오류:', err);
        res.status
    }
})

app.put('/update-profile/:userId', upload.single('profileImage'), async (req, res) => {
    try {
        const userId = req.params.userId;
        const { username, birthdate } = req.body;
        const updateUser = await User.findByIdAndUpdate(
            userId,
            { username, birthdate },
            { new: true }
        ).catch(error => {
            console.error('데이터베이스 업데이트 오류:', error);
            return null;
        });

        if (!updateUser) {
            return res.status(404).send('유저를 찾을 수 없습니다.');
        }

        if (req.file) {
            updateUser.profileImage.data = req.file.buffer;
            updateUser.profileImage.contentType = req.file.mimetype;
            await updateUser.save();
        }
        return res.redirect('/profile/' + userId);
    } catch (err) {
        console.error('프로필 수정 오류', err);
    }
})

app.delete('/delete-profile/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const deletedUser = await User.findByIdAndDelete(userId);
        
        if (!deletedUser) {
            return res.status(404).send('유저를 찾을 수 없습니다.');
        }
        req.session.destroy(); //세션을 삭제하여 로그아웃 처리
        return res.redirect('/');

    } catch (err) {
        console.error('회원 탈퇴 오류:', err);
        return res.status(500).send('회원 탈퇴 중 오류 발생');
    }
});

app.get('/createPost', async (req, res) => {
    res.render('createPost');
});

app.post('/create-post', upload.array('images', 3), async (req, res) => {
    try {
        const { title, desc } = req.body;
        const images = req.files.map(file => ({
            data: file.buffer,
            contentType: file.mimetype
        }));
        const author = req.session.user.username;

        const newPost = await Post.create({
            title,
            desc,
            images,
            author,
        });

        console.log('게시글 생성 완료');

        res.redirect('/');
    } catch (err) {
        console.error('게시글 작성 오류:', err);
        res.status(500).send('게시글 생성 중 오류가 발생했습니다.');
    }
});

app.delete('/delete-post/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const loggedInUser = req.session.user; //로그인 된 사용자 id가져오기
        
        
        const deletedPost = await Post.findByIdAndDelete({
            _id: postId,
            author: loggedInUser.username,
        });

        if (!deletedPost) {
            return res.status(404).send('게시글을 찾을 수 없습니다.');
        }
        return res.redirect('/posts');
    } catch (err) {
        console.error('게시글 삭제 오류:', err);
    }
});

app.get('/edit-post/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId);
        
        if (!req.session.user) {
            return res.redirect('/login');
        }


        if (!post) {
            return res.status(404).send('게시글을 찾을 수 없습니다.');
        }
        res.render('post-edit', {post});
    } catch (err) {
        console.error('게시글 수정 페이지 오류:', err);
        return res.status(500).send('게시글 수정 페이지 로딩 중 오류가 발생했습니다.');
    }
});

app.put('/update-post/:postId', upload.array('images', 3), async (req, res) => {
    try {
        const postId = req.params.postId;
        const { title, desc } = req.body;
        const images = req.files.map(file => ({
            data: file.buffer,
            contentType: file.mimetype
        }));
        const deleteImages = req.body.deleteImages;
        //삭제할 이미지 id들
        const imagesToDelete = deleteImages ? deleteImages : [];

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).send('게시글을 찾을 수 없습니다.');
        }

        //새 이미지 데이터 생성
        const newImages = req.files.map(file => ({
            data: file.buffer,
            contentType: file.mimetype
        }));
        

        const updatedImages = post.images.filter(img => !imagesToDelete.includes(img._id.toString()));

        req.files.forEach(file => {
            updatedImages.push({
                data: file.buffer,
                contentType: file.mimetype
            });
        });

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { title, desc, images:updatedImages },
            { new: true }
        );

        if (!updatedPost) {
            return res.status(404).send('게시글을 찾을 수 없습니다.');
        }
        return res.redirect('/posts/' + postId);
    } catch (err) {
        console.error('게시글 수정 오류:', err);
        return res.status(500).send('게시글 수정 중 오류가 발생했습니다.');
    }
    
});

app.get('/posts', async (req, res) => {
    try {
        const loggedInUser =  req.session.user;
        const posts = await Post.find();

        res.render('posts', { posts, loggedInUser });
    } catch (err) {
        console.error('게시글 정보 불러오기 오류', err);
        res.status(500).send('게시글 정보 불러오기 오류');
    }
    
});

app.get('/posts/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        
        const post = await Post.findById(postId);
        
        if (!post) {
            return res.status(404).send('게시글을 찾을 수 없습니다.');
        }

        const loggedInUser = await req.session.user;
        res.render('postDetail', { post,loggedInUser });
    
    } catch (err) {
        console.error('게시글 조회 오류:', err);
        return res.status(500).send('게시글 조회 중 오류가 발생했습니다.');
    }
});


app.get('/myPost', async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/login');
        }
    
        const username = req.session.user.username
        const userPosts = await Post.find({ author: username });


        res.render('myPost', { userPosts });
    } catch (err) {
        console.error('사용자 게시글 목록 오류:', err);
        return res.status(500).send('사용자 게시글 목록 로딩 중 오류가 발생했습니다.');
    }
})


const hourlyCrawling = schedule.scheduleJob('*/10 * * * *', ()=>{
    console.log('performing hourly crawling...');
    crawling.performCrawling();
});



app.get('/cgv', async (req, res) => {
    try{
        const cachedFilePath = path.join('cgv','cached_Data.txt');
        //파일 캐싱 : 데이터 저장
        let cachedData = await fs.readFile(cachedFilePath, 'utf-8').catch(() => null);

        if(!cachedData) {
            console.log('Cached data not found. performing inital crawling...');
            await crawling.performCrawling();
            cachedData = await fs.readFile(cachedFilePath, 'utf-8');
        }
            //파일캐싱 : 데이터 사용
            //const parsedData = JSON.parse(cachedData);

            const parsedData = cachedData.split("\n").filter(line => line.trim() !== '');
            const {times} = parsedData;
            
            const timesFilePath = path.join('cgv', 'cached_Data.txt');
            const {minTime, maxTime} = await getTime.calculateTime(timesFilePath); 
        

/*         
        await fs.writeFile(path.join('cgv','times.txt'),times.join("\r\n"))
    
        await fs.writeFile(path.join('cgv','movies.txt'),movies.join("\r\n")) 
        
        const timesFilePath = path.join(__dirname, 'cgv', 'times.txt');
*/

        res.render('cgv',{minTime, maxTime, times});
    }catch(err){
        console.error(err);
        res.status(500).send('에러발생');
    }
});


app.listen(process.env.PORT, () => {
    console.log(`server is running on ${process.env.PORT}`)
})
