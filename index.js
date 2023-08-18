const fs = require('fs').promises;
const path = require('path');


function convertTime(time){
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
}

async function calculateTime(timesFilePath) {
    try{
        
        const timesData = await fs.readFile(timesFilePath, 'utf-8');
        const timesArray = timesData.split('\n').map(time => time.trim()).filter(Boolean);
        
        let minTime = timesArray[0];
        let maxTime = timesArray[0];
        
        let minMinutes = convertTime(minTime);
        let maxMinutes = convertTime(maxTime);

        for(const time of timesArray) {
            const minutes = convertTime(time);
            if(minutes < minMinutes){
                minMinutes = minutes;
                minTime = time;
            }
            if(minutes > maxMinutes){
                maxMinutes = minutes;
                maxTime = time;
            }

        }


        return {minTime, maxTime};

    }catch(err){
        throw err;
    }
}







module.exports = {
    convertTime,
    calculateTime
}