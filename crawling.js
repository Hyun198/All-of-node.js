const puppeteer = require('puppeteer')
const fs = require('fs/promises')
const path = require('path')
require('dotenv').config()

async function start() {
    const browser = await puppeteer.launch({headless:true})
    const page = await browser.newPage()
    await page.goto(process.env.cgv)

    const times = await page.evaluate(() =>{
        return Array.from(document.querySelectorAll(".movie_content._wrap_time_table  span.time_info a")).map(x => x.textContent)
    })
    await fs.writeFile(path.join('cgv','times.txt'),times.join("\r\n"))

    const movies = await page.evaluate(()=>{
        return  Array.from(document.querySelectorAll(".movie_content._wrap_time_table th a")).map(x => x.textContent)
    })
    
    await fs.writeFile(path.join('cgv','movies.txt'),movies.join("\r\n"))


    await browser.close() 

}

start()