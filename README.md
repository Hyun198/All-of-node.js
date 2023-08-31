# Node.js Start Project CRUD , Crawling , OpenWeather API

이 프로젝트는 Node.js를 사용하여 CRUD(Create, Read, Update, Delete) 기능을 구현하고, CGV 영화 시간표를 크롤링하며 시간을 계산하는 예제입니다.

## 기술 스택

- Node.js
- Express.js
- MongoDB (데이터베이스)
- Puppeteer (웹 크롤링 라이브러리)
- Multer (이미지 업로드)
- Sharp (이미지 크기조절)
- OpenWeather API (날씨 정보 불러오기)
- NodeEmailer (회원가입 시 가입한 이메일로 가입성공 이메일 보내기)
- NodeScheduler (일정 주기로 프로그램 실행)

## 설치 및 실행

1. 이 저장소를 클론합니다:

   ```bash
   git clone https://github.com/your-username/nodejs-cgv-crud-example.git
   cd nodejs-cgv-crud-example

   ```

2. 의존성을 설치합니다:

   ```bash
   npm install

   ```

3. env 파일을 설정합니다:

   DATABASEURL, PORT, SECRET_KEY, CGVURL, Node-emailer(Gmail 권장) 을 설정

4. 서버를 실행합니다:

   ```bash
   npm run dev
   ```

## 기능 설명

1. 생성(Create)

   새로운 데이터를 생성합니다.
   유저 회원가입(생성), 게시글 생성

2. 조회(Read)

   모든 데이터를 조회하거나, 특정 데이터를 ID를 이용하여 조회합니다.
   유저 로그인, 게시글 조회

3. 업데이트(Update)

   기존 데이터를 업데이트합니다.
   회원정보 및 게시글 수정

4. 삭제(Delete)

   특정 데이터를 삭제합니다.
   회원탈퇴 및 게시글 삭제

5. 크롤링(Crawling)

   지정한 url에서 원하는 정보를 크롤링. 해당 프로젝트에서는 CGV 영화시간 정보를 크롤링
   스케쥴러를 사용하여 일정 주기로 크롤링을 실행.

6. OpenWeatherAPI

   openweathermap API 오픈 소스를 활용하여 원하는 도시를 Default값으로 정해놓고 화씨,섭씨에 맞춰 설정 후
   서비스 이용

## 프로젝트 구조

      project-directory/
      ├── models/
      │ ├── Post.js
      │ └── User.js
      ├── public/
      │ ├── styles/
      │ │ └── style.css
      │ └── profile-images/
      │ └── default-profile.jpg
      │
      ├── views/
      │ ├── edit-profile.ejs
      │ ├── edit-post.ejs
      │ ├── home.ejs
      │ ├── login.ejs
      │ ├── my-posts.ejs
      │ ├── post.ejs
      │ ├── profile.ejs
      │ ├── signup.ejs
      │ └── create-post.ejs
      ├── server.js
      └── package.json

## 기여방법

    새로운 기능 추가나 버그 수정 등에 기여하려면, Fork하여 Pull Request를 보내주세요.

## 라이선스

    위의 예제에는 CGV 영화 시간표를 크롤링하고 시간을 계산하는 기능을 추가하여 작성된 README.md 파일의 일부 내용이 포함되어 있습니다.

    실제 프로젝트에 맞게 내용을 수정하고 필요한 정보를 추가하여 작성하실 수 있습니다.
