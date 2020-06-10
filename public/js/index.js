/**************** 전역 설정 ****************/
var API_CITY = "../json/city.json";
var API_WORLD = "../json/world.json";
var API_DAILY = "https://api.openweathermap.org/data/2.5/weather";
var API_WEEKLY = "https://api.openweathermap.org/data/2.5/onecall";
var API_KEY = "02efdd64bdc14b279bc91d9247db4722";
var API_UNIT = "metric";
var ICON_URL = 'https://openweathermap.org/img/wn/';
var ICON_EXT = '@2x.png';

var DAILY_DATA = { appid: API_KEY, units: API_UNIT }

/**************** 사용자 함수 ****************/
function isMobile() {
	return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};


/**************** 이벤트 콜백 ****************/
function onCity(r) {
	var html;
	for(var i in r.cities) {
		html = '<option value="'+r.cities[i].id+'">'+r.cities[i].name+'</option>';
		$("#city").append(html);
	}
}
// https://api.openweathermap.org/data/2.5/weather
function onWorld(r) {
	r.cities.forEach(function(v, i){
		var data = {};
		data.appid = API_KEY;
		data.units = API_UNIT;
		data.id = v.id;
		$.get(API_DAILY, data, onWorldWeather);
	});
}

function onWorldWeather(r) {
	console.log(r);
	var html  = '<div class="city">';
			html += '	<div class="title title-pc">'+r.name+', '+r.sys.country+'</div>';
			html += '	<div class="icon">';
			html += '		<img src="'+ICON_URL+r.weather[0].icon+ICON_EXT+'">';
			html += '	</div>';
			html += '	<div class="desc-wrap">';
			html += '		<div class="title title-mobile">'+r.name+', '+r.sys.country+'</div>';
			html += '		<div class="desc-mobile">';
			html += '			<div class="temp">';
			html += '				<span>'+r.main.temp+'</span> ℃';
			html += '			</div>';
			html += '			<div class="desc">';
			html += '				<span>'+r.weather[0].main+'</span> / ';
			html += '				<span>'+r.weather[0].description+'</span>';
			html += '			</div>';
			html += '		</div>';
			html += '	</div>';
			html += '</div>';
	$(".world-wrap").append(html);
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

function onDailyClick() {

}

function onCityChange() {
	// var data = { id: $(this).val(), appid: API_KEY, units: API_UNIT };
	var data = {};
	data.id = $(this).val();
	data.appid = API_KEY;
	data.units = API_UNIT;
	$.get(API_DAILY, data, onInfo);
}

function onInfo(r) {
	console.log(r);
	$(".home-wrap").css("display", "none");
	$(".info-wrap").css("display", "flex");
	$(".info-title").html(r.name + ', ' + r.sys.country);
}

function onBack() {
	$(".home-wrap").css("display", "flex");
	$(".info-wrap").css("display", "none");
}

/**************** 이벤트 설정 ****************/
$.get(API_CITY, onCity);
$.get(API_WORLD, onWorld);
navigator.geolocation.getCurrentPosition(onPosition);

$(".daily-wrap").click(onDailyClick);
$("#city").change(onCityChange);
$(".bt-back").click(onBack);



/*
if(isMobile()) {
	$("head").append('<meta name="viewport" content="width=device-width, initial-scale=0.8">');
}
else {
	$("head").append('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
}
*/


