let main = function() {
    return {
        baseUrl: "https://api.coingecko.com/api/v3/coins/",
        mainDiv: $("#mainDiv")[0],
        navBar: $("#navbar")[0],
        currentInfo:{},
        fav:{},
        modalBody: $("#modalBody")[0],
        about:$("#about")[0],
        search:$("#coinToSearch")[0],
        livecharts:$("#chartContainer")[0],
        chartUrl:"https://min-api.cryptocompare.com/data/pricemulti?fsyms=",
        chartKey:"&tsyms=USD&api_key=3e2fa40fea59fa8eaf47d20d06e7ad4d367ee696fe67ee8d78bcd08255ff16ce",
        chartValue: [],
        chartIntervalLet:null,
        
    }
}();

//  GAL DONT BE MAD sticky navbar- has to be global 
window.onscroll = function() {stickyNavbar()};
let sticky = main.navBar.offsetTop;

//geting all the coins 
const getCoins =()=> {
    return new Promise((resolve, reject) => {
        $.ajax({
            method: "GET",
            url: main.baseUrl+"list",
            success: (res) => {
               resolve(res);
            },
            error: (err) => {
                console.log("somting went wrong with geting coins from api");
                reject(err);
            } 
        })
    })
}

// when all the coins came back draws them 
const  init =()=>
{
    getCoins().then((allCoins) => {
        // allCoins.map((coin)=>{
        //     draw(coin)
        for (let index = 0; index <20; index++) {
            draw(allCoins[index])   
        }
}, (error) => {
    console.error(error)
})
}
init();



// draws all the coins cards
const draw =(coin)=>{
let card =document.createElement("div");
card.classList.add("card");
card.id=coin.name;
card.short=coin.symbol;
let cardBody =document.createElement("div");
cardBody.classList.add("card-body");
let label = document.createElement("label");
label.classList.add("switch");
let input=document.createElement("input");
input.setAttribute("type", "checkbox");
input.id=coin.name+"checkbox";
input.name=coin.name+"name"
input.addEventListener("click",function(){
    favcontroller(coin.name,coin.symbol);
  
})

let span= document.createElement("span");
span.classList.add("slider");
span.classList.add("round");
let h5= document.createElement("h5");
h5.classList.add("card-title");
h5.innerText = coin.symbol;
let h6= document.createElement("h6");
h6.classList.add("card-subtitle");
h6.innerText = coin.name;
let button= document.createElement("button");
button.innerText = "More info"
button.classList.add("btn");
button.classList.add("btn-primary");
button.setAttribute("data-toggle", "collapse");
button.setAttribute("data-target", "#"+coin.name+"_collapser");
button.setAttribute("aria-expanded", "false");
button.setAttribute("type", "button");
button.setAttribute("aria-controls", coin.name+"_collapser");
let collapseDiv = document.createElement("div");
collapseDiv.classList.add("collapse");
collapseDiv.classList.add("coinInfo");
collapseDiv.setAttribute("id", coin.name+"_collapser");
button.addEventListener("click",function(){
    coinInfoController(coin.name)
})


label.appendChild(input)
label.appendChild(span)
cardBody.appendChild(label)
cardBody.appendChild(h5)
cardBody.appendChild(h6)
cardBody.appendChild(button)
cardBody.appendChild(collapseDiv)
card.appendChild(cardBody)
main.mainDiv.appendChild(card);

}

// getting spesific coin data 
const getCoinInfo=(coinName)=>{
    return new Promise((resolve, reject) => {
        $.ajax({
            method: "GET",
            url: main.baseUrl+coinName,
            success: (res) => {
               resolve(res);
            },
            error: (err) => {
                console.log("somting went wrong with geting spesific coin info");
                reject(err);
            } 
        })
    })


}
// rresponsible for "more info btn"- shows data of spesific coin 
const coinInfoController= async (coinName)=>{
    let collapser= document.getElementById(coinName+"_collapser")
    collapser.innerHTML=" ";
    let loader=document.createElement("div");
    loader.classList.add("loader")
    collapser.append(loader);
    let res=[]
    if(coinName in main.currentInfo){
        let res= await drawCoinInfo(main.currentInfo[coinName]);
        loader.appendChild(res[0]);
        loader.appendChild(res[1]);
        loader.appendChild(res[2]);
        loader.appendChild(res[3]);
        collapser.appendChild(loader);
        loader.classList.remove("loader");
    }
    else{
     let coinInfoData= await getCoinInfo(coinName.toLowerCase());
     let res= await drawCoinInfo(coinInfoData);
     main.currentInfo[coinName]=coinInfoData;
     coinInfoTimer(coinName);
     loader.appendChild(res[0]);
     loader.appendChild(res[1]);
     loader.appendChild(res[2]);
     loader.appendChild(res[3]);
     collapser.appendChild(loader);
     loader.classList.remove("loader");
        
    }
}
// makes sure that coins value is saved fo only 2 minets
const coinInfoTimer =(_coin)=>{
    
    setTimeout(function(){ 
         delete main.currentInfo[_coin];
         console.log(main.currentInfo);
    }, 120000);

}


// draws the spesific coin info into the card colapser
const drawCoinInfo=(coin)=>{

let usd = document.createElement("div");
usd.innerText= "usd : "+coin.market_data.current_price.usd.toString().substring(0,10)+"$";
let eur = document.createElement("div");
eur.innerText= "eur : "+coin.market_data.current_price.eur.toString().substring(0,10)+"€";
let ils = document.createElement("div");
ils.innerText= "ils : "+coin.market_data.current_price.ils.toString().substring(0,10)+"₪";
let img = document.createElement("img");

img.src= coin.image.small;
return [img,usd,eur,ils]

}
// responsible for all the favorit system
const favcontroller =(_name,_short)=>{
    let currentCoin= document.getElementById(_name+"checkbox");
    if(_name in main.fav){
        delete main.fav[_name]; 
    }
    else{
        main.modalBody.innerText=""
        if( Object.keys(main.fav).length>=5){
            currentCoin.setAttribute("type","text");
            currentCoin.setAttribute("checked",false);
            let p=document.createElement("p");
            p.innerText="sorry max fav is 5, you must delete one of those to add "+_name;
            main.modalBody.appendChild(p);
            for (var k in main.fav){
                let button =document.createElement("button")
                button.innerText=k;
                button.classList.add("btn");
                button.classList.add("btn-primary");
                button.addEventListener("click",function(){
                    let coin=this.innerText
                    let buttoncoin= document.getElementById(coin+"checkbox");
                    buttoncoin.setAttribute("type","text");
                    delete main.fav[coin];
                    $('#myModal').modal('hide')
                    main.fav[_name]=_short.toUpperCase()
                    currentCoin.setAttribute("type","checkbox");
                    currentCoin.setAttribute("checked",true);
                })
                main.modalBody.appendChild(button);
            }
            $('#myModal').modal()
        }
        else{
            main.fav[_name]=_short.toUpperCase()
            currentCoin.setAttribute("type","checkbox");
            currentCoin.setAttribute("checked",true);
        }   
    }
}
// sticky navbar 
const stickyNavbar= ()=> {
  if (window.pageYOffset >= sticky) {
    main.navBar.classList.add("sticky")
  } else {
    main.navBar.classList.remove("sticky");
  }
}
// responsible for changing cotect on the main div
const changeContent= (_att) => {
    main.mainDiv.setAttribute("hidden","");
    main.about.setAttribute("hidden","");
    main.livecharts.setAttribute("hidden","");
    switch (_att) {
        case "mainDiv":
           main.mainDiv.removeAttribute("hidden");
           main.search.innerText="";
           main.search.value="";
           searchCoin();
            
            break; 
        case "about":
           main.about.removeAttribute("hidden");
            break; 
        case "livecharts":
            if(isEmpty(main.fav)){
                alert("cant show you charts if you didnt chose a coin");
                main.mainDiv.removeAttribute("hidden");
                
            }else{
                main.livecharts.classList.add("loader")
                main.livecharts.innerHTML="";
                main.livecharts.removeAttribute("hidden");
                chartController(); 
                
            }
        
           
             break; 
            

    }
}


// search 
const searchCoin=()=>{
    let allCards=document.getElementsByClassName("card");
    if(main.search.value==""){

        for (let i = 0; i < allCards.length; i++) {
            allCards[i].removeAttribute("hidden"); 
        }
    }
    else{
        for (let i = 0; i < allCards.length; i++) {

            if(allCards[i].id.toLocaleLowerCase().includes(main.search.value.toLocaleLowerCase())){
                allCards[i].removeAttribute("hidden");
            }
            else{
                if(allCards[i].short.toLocaleLowerCase().includes(main.search.value.toLocaleLowerCase())){
                    allCards[i].removeAttribute("hidden");
                }
                else{
                    allCards[i].setAttribute("hidden","");
                }
                
            }
            
        }

    }
   
}

// makes the search wark without clicking
const searchCoin2=()=>{
    setTimeout(() => {
        searchCoin();
        
    }, 1000);
}
// get coin info for favorites 
const getChartInfo=(coins)=>{

    return new Promise((resolve, reject) => {
        $.ajax({
            method: "GET",
            url: main.chartUrl+coins+main.chartKey,
            success: (res) => {
               resolve(res);
            },
            error: (err) => {
                console.log("somting went wrong with geting spesific coin info");
                reject(err);
            } 
        })
    })
}
//responsible for geting chart data and draw it 
const chartController= ()=>{
    clearInterval( main.chartIntervalLet);
    main.chartValue=[];
    let dollarWorthArr= Object.values(main.fav).toString();
    chartInterval(dollarWorthArr)    
}

// responsible for showing new data every 2 sec 
const chartInterval=(dollarWorthArr)=>{
    main.chartIntervalLet = setInterval(function(){ 
        getChartInfo(dollarWorthArr).then(function(values) {
            main.livecharts.classList.remove("loader")
          
        
         drawCharts(values);
       });
         
     }, 2000);
     
}

// draws the chart 
const drawCharts =(coins)=> {
    
    let timeNeeded= getTime()
    
    
    if(isEmpty(main.chartValue)){
        for(key in coins){
            let current = new ChartData(key,coins[key].USD,timeNeeded)
            main.chartValue.push(current.chartData);
        }
        addChartToDom()
    }else{
        Object.keys(coins).forEach(function(key,i) 
        {
            main.chartValue[i].dataPoints.push({
                x:timeNeeded,
                y:coins[key].USD,
            })  
            addChartToDom()
        }) 
        
    }
   

}
// adding the new chart to the dom 
const addChartToDom=()=>{

    let lines = [];
    main.chartValue.forEach((h)=>{
        lines.push(h)
    })
    
   
    var options = {
        exportEnabled: true,
        animationEnabled: false,
        title: {
            text:" fav to USD"
        },
        subtitles: [{
            text: "Click Legend to Hide or Unhide Data Series"
        }],
        axisX: {
            title: "Time"
        },
        axisY: {
            title: "Coin Value",
            titleFontColor: "#4F81BC",
            lineColor: "#4F81BC",
            labelFontColor: "#4F81BC",
            tickColor: "#4F81BC",
            includeZero: false
        },

        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            itemclick: toggleDataSeries
        },
        data: lines
    };
   
    $("#chartContainer").CanvasJSChart(options);

    function toggleDataSeries(e) {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }
        e.chart.render();
    }

}

//check if obj is empty 
const  isEmpty=(obj)=> {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

// time generator 
const getTime = () => {
    let currTime;
    let date = new Date;
    currTime = date;
    return currTime;
}
