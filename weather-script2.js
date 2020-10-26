
var apiKey= "d1df40262553f5b11cee579a3c8ebffb"
var locationSearch= $("#locationSearch");
var currentCity= $("#currentCity");
var currentTemp= $("#currentTemp");
var currentWind= $("#windSpd");
var currentHumidty= $("#humidity");
var currentUV= $("#currentUV");
var arr;
var lastsearch;

$(document).ready(function(){
    
    getSearches();

    $(".btn").on("click", startSearch);

    $(".previous").on("click", "p", function() {
        lastsearch = this.textContent;
        localStorage.setItem("lastsearch", lastsearch);
        locationSearch.val(lastsearch);
        startSearch();
    })

    function startSearch() {
        var searchCity = locationSearch.val();
        lastsearch= searchCity;
        localStorage.setItem("lastsearch", lastsearch);
        var queryURL1= "https://api.openweathermap.org/data/2.5/weather?q=" +  searchCity + "&appid=" + apiKey + "&units=imperial";
        var queryFiveDay= "https://api.openweathermap.org/data/2.5/forecast?q=" + searchCity + "&appid=" + apiKey + "&units=imperial";
    
        $.ajax({
            url: queryURL1,
            method: "GET"
        }).then(function(oneDayData){
            var lat= oneDayData.coord.lat;
            var lon= oneDayData.coord.lon;
            var queryUV= "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
            $.ajax({
                url: queryUV,
                method: "GET"
            }).then(function(uvData){
                $.ajax({
                    url: queryFiveDay,
                    method: "GET"
                }).then(function(fiveDayData){
                        setCard(oneDayData);
                        setUV(uvData);
                        setFiveDay(fiveDayData);                   
                        saveSearch();
                })
            })
        })       
    }

    function setCard(input) {
        var icon= input.weather[0].icon;
        var iconURL= "http://openweathermap.org/img/w/" + icon + ".png";
        $(currentCity).text(input.name + " (" + moment().format('l') + ")");
        $("<img>", {
            src: iconURL,
            alt: "icon"
        }).appendTo(currentCity);
        $(currentTemp).text("Temperature: " + input.main.temp + " °F");
        $(currentHumidty).text("Humidity: " + input.main.humidity + "%");
        $(currentWind).text("Wind Speed: " + input.wind.speed + " MPH");
    }

    function setUV(input) {
        var uv= input.value;
        $(currentUV).html("UV Index: <span> " + uv + "</span>" );

        if (uv <= 3) {
            $("span").addClass("low");
        } else if (3 < uv && uv <= 7) {
            $("span").addClass("moderate");
        } else if (uv > 7) {
            $("span").addClass("high");
        }
    }

    function setFiveDay(input) {      

        for (var i= 1; i < 6; i++) {
            $("#day" + i).text(moment().add(i, 'day').format('l'));
        }

        for (var a= 1, b= 7; a < 6; a++, b += 8) {
            $("#currentTemp" + a).text("Current Temp: " + input.list[b].main.temp + "°F");
            $("#foreHumid" + a).text("Humidity: " + input.list[b].main.humidity + "%");

            var icon= input.list[b].weather[0].icon;
            var iconURL= "http://openweathermap.org/img/w/" + icon + ".png";
            $("<br>").appendTo("#day" + a);
            // $("col-lg-2").attr("style", "background-color: lightblue")
            $("<img>", {
                src: iconURL,
                alt: "icon" + a,
            }).appendTo("#day" + a);
        }
    }
    
    function saveSearch() {
        var name= locationSearch.val();
        if (arr.includes(name)) {
            return;
        } else {
            $("<p>", {
                text: name,
                class: "saves",
                value: name 
            }).appendTo(".previous");
            arr.push(name);
            localStorage.setItem("searches", JSON.stringify(arr));
        }       
    }

    function getSearches() {
        arr= JSON.parse(localStorage.getItem("searches"));
        var last= localStorage.getItem("lastsearch"); 
        locationSearch.val(last);       
        if (!arr) {
            arr = [];
        } else {
            /*var lastsearch= arr[arr.length - 1];*/
            for (var i= 0; i< arr.length; i ++) {
                    $("<p>", {
                        text: arr[i],
                        class: "saves",
                        value: arr[i] 
                    }).appendTo(".previous");            
            }          
            startSearch();
        }
    }
})