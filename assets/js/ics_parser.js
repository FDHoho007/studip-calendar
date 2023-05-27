function parseICS(ics_content) {
    let stack = [];
    let currentObject = {};
    let currentKey;
    for(let line of ics_content.split("\n")) 
        if(line.trim() != "") {
            if(line.startsWith(" ")) {
                line = line.substring(1).trim().replaceAll("\\,", ",")
                let currentData = currentObject[currentKey];
                if(Array.isArray(currentData))
                    currentData[currentData.length-1] += line;
                else
                    currentObject[currentKey] += line;
            }
            else {
                let data = line.split(":");
                let key = data[0].trim();
                let value = data.slice(1).join(":").trim().replaceAll("\\,", ",");
                if(key == "BEGIN") {
                    stack.push(currentObject);
                    currentObject = {};
                }
                else if(key == "END") {
                    let newCurrentObject = stack.pop();
                    if(value in newCurrentObject) {
                        let temp = newCurrentObject[value];
                        if(Array.isArray(temp))
                            temp.push(currentObject);
                        else
                            newCurrentObject[value] = [temp, currentObject];
                    }
                    else
                        newCurrentObject[value] = currentObject;
                    currentObject = newCurrentObject;
                }
                else {
                    if(key in currentObject) {
                        let currentData = currentObject[key];
                        if(Array.isArray(currentData))
                            currentData.push(value);
                        else
                            currentObject[key] = [currentData, value];
                    }
                    else {
                        currentObject[key] = value;
                        if(key == "SUMMARY")
                            console.log(value);
                    }
                    currentKey = key;
                }
            }
        }
    return currentObject;
}

function icsDate(icalStr)  {
    // icalStr = '20110914T184000Z'             
    let strYear = icalStr.substr(0,4);
    let strMonth = parseInt(icalStr.substr(4,2),10)-1; // For some odd reason the month parameter is zero-based
    let strDay = icalStr.substr(6,2);
    let strHour = icalStr.substr(9,2);
    let strMin = icalStr.substr(11,2);
    let strSec = icalStr.substr(13,2);

    return new Date(strYear, strMonth, strDay, strHour, strMin, strSec);
}