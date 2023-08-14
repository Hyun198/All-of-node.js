const axios = require('axios');
const cheerio = require('cheerio');

async function getMovieTimes() {
    try {
        const response = await axios.get('http://www.cgv.co.kr/theaters/?areacode=02&theaterCode=0298&date=20230814');
        const html = response.data;

        const $ = cheerio.load(html);
        const movieTimes = [];

        $('.col-times').each((index, element) => {
            const movieTime = $(element).text().trim();
            movieTimes.push(movieTime);
        });

        console.log('영화 시간:', movieTimes);
    } catch (err) {
        console.err('에러 발생:', err);
    }
}

getMovieTimes();