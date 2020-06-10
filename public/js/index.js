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
	navigator.geolocation.getCurrentPosition(onGetPosition);
	function onGetPosition(p){
		var data = {};
		data.lat = p.coords.latitude;
		data.lon = p.coords.longitude;
		data.appid = API_KEY;
		data.units = API_UNIT;
		data.exclude = 'hourly, current';
		$.get(API_DAILY, data, onInfo);
		$.get(API_WEEKLY, data, onWeekInfo);
	}
}

function onCityChange() {
	// var data = { id: $(this).val(), appid: API_KEY, units: API_UNIT };
	var data = {};
	data.id = $(this).val();
	data.appid = API_KEY;
	data.units = API_UNIT;
	data.exclude = 'hourly, current';
	$.get(API_DAILY, data, onInfo);
	$.get(API_DAILY, data, onWeekInfo);
}

function onWeekInfo(r) {
	console.log(r);
	var html = '', d;
	for(var i in r.daily) {
		d = moment(r.daily[i].dt*1000);
		html += '<div class="week">';
		html += '	<div class="icon"><img src="'+ICON_URL+r.daily[i].weather[0].icon+ICON_EXT+'"></div>';
		html += '	<div class="desc">';
		html += '		<div class="time">'+d.format('YYYY-MM-DD, ddd')+'</div>';
		html += '		<div class="main"></div>';
		html += '		<div class="temp">';
		html += '			<span class="desc">33.5</span>';
		html += '			<span class="unit">℃</span>';
		html += '			<span class="title">최고온도: </span>';
		html += '			<span class="desc">35.5</span>';
		html += '			<span class="unit">℃</span>';
		html += '			<span class="title ml">최저온도: </span>';
		html += '			<span class="desc">31.5</span>';
		html += '			<span class="unit">℃</span>';
		html += '		</div>';
		html += '	</div>';
		html += '</div>';
	}
	$(".info-weekly").html(html);
}

function onInfo(r) {
	console.log(r);
	$(".home-wrap").css("display", "none");
	$(".info-wrap").css("display", "flex");
	$(".info-title").html(r.name + ', ' + r.sys.country);
	$(".info-wrap").find(".main").html(r.weather[0].main + '[' + r.weather[0].description + ']');
	$(".info-wrap .temp").find(".desc").html(r.main.temp);
	$(".info-wrap .temp-detail").find(".desc").eq(0).html(r.main.temp_max);
	$(".info-wrap .temp-detail").find(".desc").eq(1).html(r.main.temp_min);
	$(".info-wrap .pressure").find(".desc").eq(0).html(r.main.pressure);
	$(".info-wrap .pressure").find(".desc").eq(1).html(r.main.humidity);
	$(".info-wrap .wind").find(".desc").html(r.wind.speed);
	$(".info-wrap .wind").find(".fa-arrow-down").css("transform", "rotate("+r.wind.deg+"deg)");
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


