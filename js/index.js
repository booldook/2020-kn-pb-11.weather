/**************** 전역 설정 ****************/
var API_CITY = "../json/city.json";
var API_DAILY = "https://api.openweathermap.org/data/2.5/weather";
var API_WEEKLY = "https://api.openweathermap.org/data/2.5/onecall";
var API_KEY = "02efdd64bdc14b279bc91d9247db4722";
var API_UNIT = "metric";
var ICON_URL = 'http://openweathermap.org/img/wn/';
var ICON_EXT = '@2x.png';

var DAILY_DATA = {
	appid: API_KEY,
	units: API_UNIT
}

var html;

/**************** 사용자 함수 ****************/



/**************** 이벤트 콜백 ****************/
function onCity(r) {
	for(var i in r.cities) {
		html = '<option value="'+r.cities[i].id+'">'+r.cities[i].name+'</option>';
		$("#city").append(html);
	}
}

function onPosition(pos) {
	DAILY_DATA.lat = pos.coords.latitude;
	DAILY_DATA.lon = pos.coords.longitude;
	$.get(API_DAILY, DAILY_DATA, onDaily);
}

function onDaily(r) {
	console.log(r);
	$(".daily-icon").attr("src", ICON_URL + r.weather[0].icon + ICON_EXT);
	$(".daily-city").html(r.name + ', ' + r.sys.country);
	$(".daily-temp").html(r.main.temp);
	$(".daily-desc").html(r.weather[0].main);
	$(".daily-desc2").html(r.weather[0].description);
}

/**************** 이벤트 설정 ****************/
$.get(API_CITY, onCity);
navigator.geolocation.getCurrentPosition(onPosition);