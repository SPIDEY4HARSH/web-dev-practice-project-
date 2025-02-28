const userTab = document.querySelector("[data-yourWeather]");
const searchTab = document.querySelector("[data-SearchWeather]");
const grantContainer = document.querySelector(".grantLocationContainer");

const searchForm = document.querySelector("[data-formContainer]");

const loadingContainer = document.querySelector(".loading-container");
const weatherData = document.querySelector("[data-weatherContainer]")

//setting initial attributes s

var oldTab = userTab;
const API_KEY =  "d1845658f92b31c64bd94f06f7188c9c";
getSessionStorageValue()

oldTab.classList.add('current-tab');

function switchTab(newTab){
     if (newTab != oldTab){
        oldTab.classList.remove('current-tab');
        oldTab = newTab;
        oldTab.classList.add('current-tab');

        //CHECK FOR THE ACTIVE CLASS PPRECENSE AND HANDLE THAT 
        if (!searchForm.classList.contains('active')){
        // agar search form k andar active class nhi h to isme active class dal kar isko visible karo 
        // uske liye phle baki sari ko invisible karo 
        grantContainer.classList.remove('active');
        loadingContainer.classList.remove('active');
        weatherData.classList.remove('active');
        searchForm.classList.add('active');

        }

        else {
            searchForm.classList.remove('active');
            weatherData.classList.remove('active');
            //cal the fuction that stores the local variable then call the function that fetch the tha data as per local varible
            //lastly store all the data into variables and rennder them 
            getSessionStorageValue();
        }


     }
}

userTab.addEventListener("click",()=>{
    switchTab(userTab);
});

searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
});

function  getSessionStorageValue(){
    const localvar = sessionStorage.getItem('userCoordinates');
    if (!localvar){
        //agar varible nhi  h to gratn access wala coonatiner ko activarte kar do permissin lene k liye 
        grantContainer.classList.add('active');
    }
    else 
    {
        // class the function that fecth the data 
        const coordinates = JSON.parse(localvar);
        fetchUserWeatherdata(coordinates);
    }
}

async function fetchUserWeatherdata(coordinates){
    const {lat , lon } = coordinates;
    try{
        loadingContainer.classList.add('active');
    
        setTimeout(()=>{loadingContainer.classList.remove('active');},500) 
        // here we will fetch the data 
         const response = await fetch(   `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
// loading data display show karke hta di 

       
        // jo data mila h usko ui par dikhan h 
        grantContainer.classList.remove('active');
        renderData(data);
        weatherData.classList.add('active');
    }
    catch(err){
        console.log(err.message + "fetching the data problem")
       alert('please grant the loaction permisson ');
      
    }
}
function renderData(data){
    //plhle sare ui elemnts ka access lelo 
    const cityName = document.querySelector('[data-cityName]');
    const flag  = document.querySelector('[data-cityImage]');
    const weatherDesc = document.querySelector('[data-weatherDesc]');
    const weatherIcon= document.querySelector("[data-weathericon]")
    const temp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudes = document.querySelector("[data-Clouds]");

    // add the values in the ui element 
    cityName.innerText = data?.name;
    flag.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    weatherDesc.innerText = `${data?.weather?.[0]?.description}`;
    weatherIcon.src =  `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    temp.innerText = `${data?.main?.temp} °C`;
    console.log(weatherDesc.innerHTML);
    windSpeed.innerText = `${data?.wind?.speed} km/h`;
    humidity.innerText = `${data?.main?.humidity}%`;
    cloudes.innerText = `${data?.clouds?.all}%`;



}

//getloaction fubction

function getlocation(){
    if (navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showlocation);

    }
    else{
        console.log("error in getting location ");
    }
}

function showlocation(position)
{
   const userCoordinates = { 
   lat : position.coords.latitude,
    lon : position.coords.longitude}

    //setting the user cordinates in the localstorage
    sessionStorage.setItem('userCoordinates',JSON.stringify(userCoordinates));
    console.log(userCoordinates);
    fetchUserWeatherdata(userCoordinates);

}

//grantbutton 
const grantBtn = document.querySelector("[data-grantButton]");
grantBtn.addEventListener('click',getlocation);

// searh form handle karna 
const searchcity = document.querySelector('[data-searchInput]');

searchForm.addEventListener('submit',(e)=>{
    e.preventDefault();

    let  input = searchcity.value ; 
    if (input == ""){
        return;
    }
    else
    {
        fetchSearchCityData(input);
    }
});

async function fetchSearchCityData(city)
{
    try{
    var response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    var data = await response.json();    

    //rendering the data
    loadingContainer.classList.add('active');
    loadingContainer.classList.remove('active');
    weatherData.classList.add("active");

    renderData(data);
}
catch(err){
    alert(err.message);
}

}


