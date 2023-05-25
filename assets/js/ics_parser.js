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
                console.log(line);
            }
            else {
                let data = line.split(":");
                let key = data[0].trim();
                let value = data[1].trim().replaceAll("\\,", ",");
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
                    else
                        currentObject[key] = value;
                    currentKey = key;
                }
            }
        }
    return currentObject;
}