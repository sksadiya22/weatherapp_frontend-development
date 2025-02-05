const cityinput=document.querySelector("#city")
const search=document.querySelector("#search")
const notfound=document.querySelector(".searchcity")
const weatherinfo=document.querySelector(".weather")
const cityname=document.querySelector("#country")
const tempt=document.querySelector(".temp")
const cond=document.querySelector(".condition")
const humid=document.querySelector(".humidvalue")
const wind=document.querySelector(".windvalue")
const cloud=document.querySelector("#cloud")
const currdate=document.querySelector(".curr-date")
const forecast=document.querySelector(".foreitem")
const apikey='5c46fc8e289e3c657fbcdb83a6afc9e1'
function getweather(id){
    console.log(id)
    if(id<=232)return 'strom.png'
    if(id<=321)return 'cloudy.png'
    if(id<=531)return 'rainy-day.png'
    if(id<=622)return 'snow.png'
    if(id<=781)return 'wind.png'
    if(id<=800)return 'sunny.png'
    else return 'sun.png'
}
function getdate(){
    const date=new Date()
   // console.log(date)
    const opt={
        weekday:'short',
        day:'2-digit',
        month:'short'
    }
    return date.toLocaleDateString('en-GB',opt)
}
search.addEventListener("click",()=>{
    if(cityinput.value.trim()!='')
    {
        update(cityinput.value)
        cityinput.value=''
        cityinput.blur();
    }
})
cityinput.addEventListener('keydown',(event)=>{
    if ( event.key == 'Enter' && cityinput.value.trim()!='' )
   {
    update(cityinput.value)
    cityinput.value=''
    cityinput.blur();
   }
})
async function updateforecast(city){
    const foredata=await getfetch('forecast',city)
    const time='12:00:00'
     forecast.innerHTML=''
    const todaydate=new Date().toISOString().split('T')[0]
    foredata.list.forEach(fore=>{
        if(fore.dt_txt.includes(time)&&!fore.dt_txt.includes(todaydate)){
            console.log(fore)
           
            updateitems(fore)
        }
        
    })
    console.log(todaydate)
    
}
function updateitems(weatherd){
    console.log(weatherd)
    const {
        dt_txt: date,
        weather:[{id}],
        main:{temp}
    }=weatherd
    const datetaken=new Date(date)
    const  dateopt={
        day:'2-digit',
        month:'short'
    }
    const dateresult= datetaken.toLocaleDateString('en-US',dateopt)
    const  forecastitem=`
                    <div class="block">
                        <h5 class="dateday">${dateresult}</h5>
                        <img src="${getweather(id)}" alt="" height="45px" width="45px" class="foreimg">
                        <h3 class="foretemp">${Math.round(temp)}°C</h3>
                    </div>`
    forecast.insertAdjacentHTML('beforeend',forecastitem)
}
 async function getfetch(endpoint,city){
     const upiurl="https://api.openweathermap.org/data/2.5/"
     const response  = await fetch(upiurl+endpoint+`?units=metric&q=`+city+`&appid=${apikey}`)
     return response.json()
}
async function update(city){
    const weatherdata= await getfetch('weather',city);
    if(weatherdata.cod!=200){
        Showdisplay(notfound)
        return
    }
    const{
        name:country,
        main:{temp,humidity},
        weather:[{id,main}],
        wind:{speed}
    }=weatherdata
    cloud.src=getweather(id)
    cityname.textContent=country
    tempt.textContent=Math.round(temp)+'°C'
    cond.textContent=main
    humid.textContent=humidity+'%'
    wind.textContent=speed+'M/s'
     currdate.textContent=getdate()
   // cloud.src=`${getweather(id)}`
   await updateforecast(city)


    Showdisplay(weatherinfo)
}
function Showdisplay(sec)
{
    [weatherinfo,notfound].forEach(sec => sec.style.display='none')
    sec.style.display='flex'
}