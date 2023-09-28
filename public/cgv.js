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





function getSelectedValue() {
    //오픈 마감 마감2
    const radioGroup = document.getElementsByName('part_time');
    let Part;
    for (const radio of radioGroup) {
        if (radio.checked) {
            Part = radio.value;
            break;
        }
    }

    //영화시간
    Time = document.getElementById('time').value;
    
    //근무시간
    const radioGroup2 = document.getElementsByName('work_time');
    let Work;
    for (const work of radioGroup2) {
        if (work.checked) {
            Work = work.value;
            break;
        }
    }

    
    //23:10
    let movie_hour, movie_min;
    let start_hour, start_min;
    let end_hour, end_min;
    movie_hour = Time.slice(0,2);
    movie_min = Time.slice(3);

    Work_hour = Work.slice(0,1);
    Work_minu = Work.slice(2);
/*     console.log(Type_hour);
    console.log(Type_minu); */
    Work_hour = Number(Work_hour);
    Work_minu = Number(Work_minu);
    
    //형 변환
    movie_hour = Number(movie_hour);
    movie_min = Number(movie_min);

    

    if (Part == 'open') {
        console.log('오픈');
        if (movie_min < 30) {
            start_hour = movie_hour- 1;
            start_min = movie_min + 30;
        } else {
            start_hour = movie_hour;
            start_min = movie_min - 30;
        }

        end_hour = start_hour + Work_hour;
        end_min = start_min + Work_minu+30;
        
        if (end_min >= 60) {
            end_min = end_min - 60;
            end_hour += 1;
        } 

        if (start_min < 0) {
            start_min = Math.abs(start_min);
        } 
        if (start_min == 0) {
            document.getElementById('myLabel').innerHTML = "출근시간 : " + start_hour + "시" + "00분";
            document.getElementById('output').innerHTML = '퇴근시간 : ' + end_hour + "시" + end_min + "분"; 
        }
        else {
            document.getElementById('myLabel').innerHTML = "출근시간 : " + start_hour + "시" + start_min + "분";
            document.getElementById('output').innerHTML = '퇴근시간 : ' + end_hour + "시" + end_min + "분"; 
        }

        
        
    } else if (Part == 'close') {
        console.log('마감1');
        
        movie_min+=10;

        //본영화시간 먼저 계산
        if (movie_min >= 60) {
            movie_hour += 1;
            movie_min -= 60;
        }
        /* console.log("영화 시작 시간 : " + movie_hour + "시" + movie_min + "분") */
        //본영화 시간이 =movie_hour , movie_min
        //마지막 영화에서 work time을 뺌
        start_hour = movie_hour - Work_hour;
        start_min = movie_min - Work_minu;
        if (start_min < 0) {
            start_min = start_min+60;
            start_hour = start_hour - 1;
        }

        console.log(start_hour);
        console.log(start_min);
        end_hour = movie_hour;
        end_min = movie_min;
        
        
        document.getElementById('myLabel').innerHTML = "출근 시간 : " + start_hour + "시" + start_min + "분";
        document.getElementById('output').innerHTML = '퇴근시간 : ' + end_hour + "시" + end_min + "분"; 
            
        
    
            
    }
    else if (Part == 'close2') {
        console.log('마감2');
        console.log(movie_hour - Work_hour);
        console.log(movie_min - Work_minu);
        //hour, minu 는 입력받은 영화 시간

        if (Work_minu != 0) {
            start_hour = movie_hour - Work_hour;
            start_min = movie_min - Work_minu;
            if (start_min < 0) {
                start_hour = movie_hour - Work_hour -1;
                start_min = Math.abs(start_min);
            }
        } else {
            start_hour = movie_hour - Work_hour;
            start_min = movie_min - Work_minu;
        }

        end_hour = start_hour + Work_hour; 
        end_min = start_min + Work_minu + 30;
        
        if (end_min >= 60) {
            end_hour += 1;
            end_min = end_min - 60;
        }

       
        document.getElementById('myLabel').innerHTML = "출근 시간 : " + start_hour + "시" + start_min + "분";
        document.getElementById('output').innerHTML = '퇴근시간 : ' + end_hour + "시" + end_min + "분"; 
       
        
       
    }


}

