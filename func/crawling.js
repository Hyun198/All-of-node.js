const puppeteer = require('puppeteer')
const fs = require('fs/promises')
const path = require('path')
require('dotenv').config()


async function performCrawling() {
    try{
        const browser = await puppeteer.launch({headless:true})
        const page = await browser.newPage()
        await page.goto(process.env.cgv)

        const times = await page.evaluate(() =>{
            return Array.from(document.querySelectorAll(".movie_content._wrap_time_table  span.time_info a")).map(x => x.textContent)
        });
        //await fs.writeFile(path.join('cgv','times.txt'),times.join("\r\n"));
        
        await browser.close() ;

        const data = {times};

        //const cachedFilePath = path.join('cgv','cached_data.txt');
        await fs.writeFile(path.join('cgv','cached_data.txt'),times.join("\r\n"));

        console.log('crawling and caching completed');
    }catch(err){
        console.error('크롤링 중 에러:',err);
    }
}



module.exports = {performCrawling};