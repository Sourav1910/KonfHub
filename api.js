const fetch = require("node-fetch");


fetch("https://o136z8hk40.execute-api.us-east-1.amazonaws.com/dev/get-list-of-conferences").then(async (response)=>{
    var data;
    var dataPaid=[]
    var dataFree=[]
    data=await response.json()
   
    dataPaid = duplicateRemover(data.paid)
    dataFree = duplicateRemover(data.free)
    finalPaid = readable(dataPaid)
    finalFree = readable(dataFree)
    console.log(finalPaid)
    console.log(finalFree)

    dupsPaid = semanticDuplicates(dataPaid)
    dupsFree = semanticDuplicates(dataFree)
    // console.log(dupsPaid)
    // console.log(dupsFree)
    

})

//Removes the duplicate objects in the json data
function duplicateRemover(jsondata) {
    let jsonObject = jsondata.map(JSON.stringify); 
    let uniqueSet = new Set(jsonObject); 
    let uniqueArray = Array.from(uniqueSet).map(JSON.parse); 
    return uniqueArray;
}

//Gives the correct format for the date
function dateFormat(dateText){
    var monthFull = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];
    var dateParts = dateText.split(",")
    var dateMon = dateParts[0].split(" ")
    var date = parseInt(dateMon[0])
    var mon = dateMon[1]
    if(month.includes(mon)){
        var ind = month.indexOf(mon);
        mon=monthFull[ind]
    }
    var annotation="th"
    if(date<=3 || date>20){
        var digit=date%10;
        if(digit==1)
            annotation="st"
        else if(digit==2)
            annotation="nd"
        else if(digit==3)
            annotation="rd"
    }
    return mon + " " + date + annotation + "," + dateParts[1]
}

//Converts the JSON data to readable format
function readable(data){
    var arrFinal=[]
    for(var i=0;i<data.length;i++){
        var str=""
        str=data[i].confName +" , "+
            dateFormat(data[i].confStartDate) +" , "+  
            data[i].city+" , "+
            data[i].state+" , "+
            data[i].country+" , "+
            data[i].entryType+" , "+
            data[i].confUrl+ ".";
        
        arrFinal.push(str.trim())
    }
    return arrFinal
}

//Gives the indexes of the Semantic Duplicate objects in the data
function semanticDuplicates(data){
    var arr=[]
    for(var i=0;i<data.length;i++){
        for(var j=i+1;j<data.length;j++){
            var c=0
            if(data[i].confStartDate == data[j].confStartDate &&
                data[i].city == data[j].city &&
                data[i].state == data[j].state &&
                data[i].country == data[j].country &&
                data[i].entryType == data[j].entryType
                ){
                    var ilength = data[i].confName.length
                    var jlength = data[j].confName.length
                    
                        var iparts = data[i].confName.split(" ")
                        var jparts = data[j].confName.split(" ")
                        for(var x=0;x<iparts.length;x++){
                            for(var y=0;y<jparts.length;j++){
                                if(iparts[x].includes(jparts[y]) || jparts[y].includes(iparts[x]) ){
                                    arr.push({i,j})
                                    c=1
                                    break
                                }
                            }
                            if(c==1)
                                break
                        }

                    
                }
        }
    }
    return arr
}