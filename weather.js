var WeatherFinder ={
  getWeather: function(timeMillis, zone) {
    return this.weatherChances[zone](this.calculateForecastTarget(timeMillis));
  },
    
  calculateForecastTarget: function(timeMillis) { 
    // Thanks to Rogueadyn's SaintCoinach library for this calculation.
    // lDate is the current local time.

    var unixSeconds = parseInt(timeMillis / 1000);
    // Get Eorzea hour for weather start
    var bell = unixSeconds / 175;

    // Do the magic 'cause for calculations 16:00 is 0, 00:00 is 8 and 08:00 is 16
    var increment = (bell + 8 - (bell % 8)) % 24;

    // Take Eorzea days since unix epoch
    var totalDays = unixSeconds / 4200;
    totalDays = (totalDays << 32) >>> 0; // Convert to uint

    // 0x64 = 100
    var calcBase = totalDays * 100 + increment;

    // 0xB = 11
    var step1 = ((calcBase << 11) ^ calcBase) >>> 0;
    var step2 = ((step1 >>> 8) ^ step1) >>> 0;

    // 0x64 = 100
    return step2 % 100;
  },

  getEorzeaHour: function(timeMillis) {
    var unixSeconds = parseInt(timeMillis / 1000);
    // Get Eorzea hour
    var bell = (unixSeconds / 175) % 24;
    return Math.floor(bell);
  },

  getWeatherTimeFloor: function(date) {
    var unixSeconds = parseInt(date.getTime() / 1000);
    // Get Eorzea hour for weather start
    var bell = (unixSeconds / 175) % 24;
    var startBell = bell - (bell % 8);
    var startUnixSeconds = unixSeconds - (175 * (bell - startBell));
    return new Date(startUnixSeconds * 1000);
  },
  
  getTargetHourArray: function(start, end){
    var retVal = []
    
    if (start > end){
      // 日付またぎ
      for (var i = start; i<24; i++){
        retVal.push(i);
      }
      for(var j=0; j<end; j++){
        retVal.push(j);
      }
    }
    else{
      for (var i = start; i<end; i++){
        retVal.push(i);
      }
    }
    return retVal;
  },
  
  isDuplicate: function(array1, array2){
    for(var i = 0; i < array1.length; i++){
      for (var j = 0; j < array2.length; j++){
        if (array1[i] == array2[j]){ return true; }
      }
    }
    return false;
  },

  weatherJp:{
    "晴れ":"Clear Skies",
    "快晴":"Fair Skies",
    "曇り":"Clouds",
    "霧":"Fog",
    "雨":"Rain",
    "風":"Wind",
    "雷":"Thunder",
    "雷雨":"Thunderstorms",
    "暴雨":"Showers",
    "砂塵":"Dust Storms",
    "灼熱波":"Heat Waves",
    "雪":"Snow",
    "吹雪":"Blizzards",
    "妖霧":"Gloom",
    "暴風":"Gales",
    "霊風":"Umbral Wind",
    "放電":"Umbral Static",
    "なし":"",
  },
  
  zoneJp:{
    "リムサ":"Limsa Lominsa",
    "中央ラノ":"Middle La Noscea",
    "低地ラノ":"Lower La Noscea",
    "東ラノ":"Eastern La Noscea",
    "西ラノ":"Western La Noscea",
    "高地ラノ":"Upper La Noscea",
    "外地ラノ":"Outer La Noscea",
    "ミスト":"Mist",
    "グリダニア":"Gridania",
    "中央森林":"Central Shroud",
    "東部森林":"East Shroud",
    "南部森林":"South Shroud",
    "北部森林":"North Shroud",
    "ラベンダー":"The Lavender Beds",
    "ウルダハ":"Ul'dah",
    "西ザナ":"Western Thanalan",
    "中央ザナ":"Central Thanalan",
    "東ザナ":"Eastern Thanalan",
    "南ザナ":"Southern Thanalan",
    "北ザナ":"Northern Thanalan",
    "ゴブレット":"The Goblet",
    "モドゥナ":"Mor Dhona",
    "イシュガルド":"Ishgard",
    "クルザス中央":"Coerthas Central Highlands",
    "クルザス西部":"Coerthas Western Highlands",
    "アバ雲海":"The Sea of Clouds",
    "アジスラ":"Azys Lla",
    "高地ドラ":"The Dravanian Forelands",
    "低地ドラ":"The Dravanian Hinterlands",
    "ドラ雲海":"The Churning Mists",
    "イディル":"Idyllshire",
    "ラルガ":"Rhalgr's Reach",
    "ギラ辺境":"The Fringes",
    "ギラ山岳":"The Peaks",
    "ギラ湖畔":"The Lochs",
    "クガネ":"Kugane",
    "紅玉海":"The Ruby Sea",
    "ヤンサ":"Yanxia",
    "アジステ":"The Azim Steppe",
  },
  
  weatherChances: {
    "Limsa Lominsa": function(chance){if (chance < 20) { return "Clouds"; } else if (chance < 50) { return "Clear Skies"; } else if (chance < 80) { return "Fair Skies"; } else if (chance < 90) { return "Fog"; } else { return "Rain"; }},
    "Middle La Noscea": function(chance) { if (chance < 20) { return "Clouds"; } else if (chance < 50) { return "Clear Skies"; } else if (chance < 70) { return "Fair Skies"; } else if (chance < 80) { return "Wind"; } else if (chance < 90) { return "Fog"; } else { return "Rain"; } },
    "Lower La Noscea": function(chance) { if (chance < 20) { return "Clouds"; } else if (chance < 50) { return "Clear Skies"; } else if (chance < 70) { return "Fair Skies"; } else if (chance < 80) { return "Wind"; } else if (chance < 90) { return "Fog"; } else { return "Rain"; } },
    "Eastern La Noscea": function(chance) { if (chance < 5) { return "Fog"; } else if (chance < 50) { return "Clear Skies"; } else if (chance < 80) { return "Fair Skies"; } else if (chance < 90) { return "Clouds"; } else if (chance < 95) { return "Rain"; } else { return "Showers"; } },
    "Western La Noscea": function(chance) { if (chance < 10) { return "Fog"; } else if (chance < 40) { return "Clear Skies"; } else if (chance < 60) { return "Fair Skies"; } else if (chance < 80) { return "Clouds"; } else if (chance < 90) { return "Wind"; } else { return "Gales"; } },
    "Upper La Noscea": function(chance) { if (chance < 30) { return "Clear Skies"; } else if (chance < 50) { return "Fair Skies"; } else if (chance < 70) { return "Clouds"; } else if (chance < 80) { return "Fog"; } else if (chance < 90) { return "Thunder"; } else { return "Thunderstorms"; } },
    "Outer La Noscea": function(chance) { if (chance < 30) { return "Clear Skies"; } else if (chance < 50) { return "Fair Skies"; } else if (chance < 70) { return "Clouds"; } else if (chance < 85) { return "Fog"; } else { return "Rain"; } },
    "Mist": function(chance) { if (chance < 20) { return "Clouds"; } else if (chance < 50) { return "Clear Skies"; } else if (chance < 70) { return "Fair Skies"; } else if (chance < 80) { return "Fair Skies"; } else if (chance < 90) { return "Fog"; } else { return "Rain"; } },
    "Gridania": function(chance) { if (chance < 5) { return "Rain"; } else if (chance < 20) { return "Rain"; } else if (chance < 30) { return "Fog"; } else if (chance < 40) { return "Clouds"; } else if (chance < 55) { return "Fair Skies"; } else if (chance < 85) { return "Clear Skies"; } else { return "Fair Skies"; } },
    "Central Shroud": function(chance) { if (chance < 5) { return "Thunder"; } else if (chance < 20) { return "Rain"; } else if (chance < 30) { return "Fog"; } else if (chance < 40) { return "Clouds"; } else if (chance < 55) { return "Fair Skies"; } else if (chance < 85) { return "Clear Skies"; } else { return "Fair Skies"; } },
    "East Shroud": function(chance) { if (chance < 5) { return "Thunder"; } else if (chance < 20) { return "Rain"; } else if (chance < 30) { return "Fog"; } else if (chance < 40) { return "Clouds"; } else if (chance < 55) { return "Fair Skies"; } else if (chance < 85) { return "Clear Skies"; } else { return "Fair Skies"; } },
    "South Shroud": function(chance) { if (chance < 5) { return "Fog"; } else if (chance < 10) { return "Thunderstorms"; } else if (chance < 25) { return "Thunder"; } else if (chance < 30) { return "Fog"; } else if (chance < 40) { return "Clouds"; } else if (chance < 70) { return "Fair Skies"; } else { return "Clear Skies"; } },
    "North Shroud": function(chance) { if (chance < 5) { return "Fog"; } else if (chance < 10) { return "Showers"; } else if (chance < 25) { return "Rain"; } else if (chance < 30) { return "Fog"; } else if (chance < 40) { return "Clouds"; } else if (chance < 70) { return "Fair Skies"; } else { return "Clear Skies"; } },
    "The Lavender Beds": function(chance) { if (chance < 5) { return "Clouds"; } else if (chance < 20) { return "Rain"; } else if (chance < 30) { return "Fog"; } else if (chance < 40) { return "Clouds"; } else if (chance < 55) { return "Fair Skies"; } else if (chance < 85) { return "Clear Skies"; } else { return "Fair Skies"; } },
    "Ul'dah": function(chance) { if (chance < 40) { return "Clear Skies"; } else if (chance < 60) { return "Fair Skies"; } else if (chance < 85) { return "Clouds"; } else if (chance < 95) { return "Fog"; } else { return "Rain"; } },
    "Western Thanalan": function(chance) { if (chance < 40) { return "Clear Skies"; } else if (chance < 60) { return "Fair Skies"; } else if (chance < 85) { return "Clouds"; } else if (chance < 95) { return "Fog"; } else { return "Rain"; } },
    "Central Thanalan": function(chance) { if (chance < 15) { return "Dust Storms"; } else if (chance < 55) { return "Clear Skies"; } else if (chance < 75) { return "Fair Skies"; } else if (chance < 85) { return "Clouds"; } else if (chance < 95) { return "Fog"; } else { return "Rain"; } },
    "Eastern Thanalan": function(chance) { if (chance < 40) { return "Clear Skies"; } else if (chance < 60) { return "Fair Skies"; } else if (chance < 70) { return "Clouds"; } else if (chance < 80) { return "Fog"; } else if (chance < 85) { return "Rain"; } else { return "Showers"; } },
    "Southern Thanalan": function(chance) { if (chance < 20) { return "Heat Waves"; } else if (chance < 60) { return "Clear Skies"; } else if (chance < 80) { return "Fair Skies"; } else if (chance < 90) { return "Clouds"; } else { return "Fog"; } },
    "Northern Thanalan": function(chance) { if (chance < 5) { return "Clear Skies"; } else if (chance < 20) { return "Fair Skies"; } else if (chance < 50) { return "Clouds"; } else { return "Fog"; } },
    "The Goblet": function(chance) { if (chance < 40) { return "Clear Skies"; } else if (chance < 60) { return "Fair Skies"; } else if (chance < 85) { return "Clouds"; } else if (chance < 95) { return "Fog"; } else { return "Rain"; } },
    "Mor Dhona": function(chance) {if (chance < 15) {return "Clouds";}  else if (chance < 30) {return "Fog";}  else if (chance < 60) {return "Gloom";}  else if (chance < 75) {return "Clear Skies";}  else {return "Fair Skies";}},
    "Ishgard": function(chance) {if (chance < 60) {return "Snow";}  else if (chance < 70) {return "Fair Skies";}  else if (chance < 75) {return "Clear Skies";}  else if (chance < 90) {return "Clouds";}  else {return "Fog";}},
    "Coerthas Central Highlands": function(chance) {if (chance < 20) {return "Blizzards";}  else if (chance < 60) {return "Snow";}  else if (chance < 70) {return "Fair Skies";}  else if (chance < 75) {return "Clear Skies";}  else if (chance < 90) {return "Clouds";}  else {return "Fog";}},
    "Coerthas Western Highlands": function(chance) {if (chance < 20) {return "Blizzards";}  else if (chance < 60) {return "Snow";}  else if (chance < 70) {return "Fair Skies";}  else if (chance < 75) {return "Clear Skies";}  else if (chance < 90) {return "Clouds";}  else {return "Fog";}},
    "The Sea of Clouds": function(chance) {if (chance < 30) {return "Clear Skies";}  else if (chance < 60) {return "Fair Skies";}  else if (chance < 70) {return "Clouds";}  else if (chance < 80) {return "Fog";}  else if (chance < 90) {return "Wind";}  else {return "Umbral Wind";}},
    "Azys Lla": function(chance) {if (chance < 35) {return "Fair Skies";}  else if (chance < 70) {return "Clouds";}  else {return "Thunder";}},
    "The Dravanian Forelands": function(chance) {if (chance < 10) {return "Clouds";}  else if (chance < 20) {return "Fog";}  else if (chance < 30) {return "Thunder";}  else if (chance < 40) {return "Dust Storms";}  else if (chance < 70) {return "Clear Skies";}  else {return "Fair Skies";}},
    "The Dravanian Hinterlands": function(chance) {if (chance < 10) {return "Clouds";}  else if (chance < 20) {return "Fog";}  else if (chance < 30) {return "Rain";}  else if (chance < 40) {return "Showers";}  else if (chance < 70) {return "Clear Skies";}  else {return "Fair Skies";}},
    "The Churning Mists": function(chance) {if (chance < 10) {return "Clouds";}  else if (chance < 20) {return "Gales";}  else if (chance < 40) {return "Umbral Static";}  else if (chance < 70) {return "Clear Skies";}  else {return "Fair Skies";}},
    "Idyllshire": function(chance) {if (chance < 10) {return "Clouds";}  else if (chance < 20) {return "Fog";}  else if (chance < 30) {return "Rain";}  else if (chance < 40) {return "Showers";}  else if (chance < 70) {return "Clear Skies";}  else {return "Fair Skies";}},
    // Data format changed from aggregate to marginal breakpoints
    "Rhalgr's Reach": function(chance) { if ((chance -= 15) < 0) { return "Clear Skies"; } else if ((chance -= 45) < 0) { return "Fair Skies"; } else if ((chance -= 20) < 0) { return "Clouds"; } else if ((chance -= 10) < 0) { return "Fog"; } else { return "Thunder"; } },
    "The Fringes": function(chance) { if ((chance -= 15) < 0) { return "Clear Skies"; } else if ((chance -= 45) < 0) { return "Fair Skies"; } else if ((chance -= 20) < 0) { return "Clouds"; } else if ((chance -= 10) < 0) { return "Fog"; } else { return "Thunder"; } },
    "The Peaks": function(chance) { if ((chance -= 10) < 0) { return "Clear Skies"; } else if ((chance -= 50) < 0) { return "Fair Skies"; } else if ((chance -= 15) < 0) { return "Clouds"; } else if ((chance -= 10) < 0) { return "Fog"; } else if ((chance -= 10) < 0) { return "Wind"; } else { return "Dust Storms"; } },
    "The Lochs": function(chance) { if ((chance -= 20) < 0) { return "Clear Skies"; } else if ((chance -= 40) < 0) { return "Fair Skies"; } else if ((chance -= 20) < 0) { return "Clouds"; } else if ((chance -= 10) < 0) { return "Fog"; } else { return "Thunderstorms"; } },
    "Kugane": function(chance) { if ((chance -= 10) < 0) { return "Rain"; } else if ((chance -= 10) < 0) { return "Fog"; } else if ((chance -= 20) < 0) { return "Clouds"; } else if ((chance -= 40) < 0) { return "Fair Skies"; } else { return "Clear Skies"; } },
    "The Ruby Sea": function(chance) { if ((chance -= 10) < 0) { return "Thunder"; } else if ((chance -= 10) < 0) { return "Wind"; } else if ((chance -= 15) < 0) { return "Clouds"; } else if ((chance -= 40) < 0) { return "Fair Skies"; } else { return "Clear Skies"; } },
    "Yanxia": function(chance) { if ((chance -= 5) < 0) { return "Showers"; } else if ((chance -= 10) < 0) { return "Rain"; } else if ((chance -= 10) < 0) { return "Fog"; } else if ((chance -= 15) < 0) { return "Clouds"; } else if ((chance -= 40) < 0) { return "Fair Skies"; } else { return "Clear Skies"; } },
    "The Azim Steppe": function(chance) { if ((chance -= 5) < 0) { return "Gales"; } else if ((chance -= 5) < 0) { return "Wind"; } else if ((chance -= 7) < 0) { return "Rain"; } else if ((chance -= 8) < 0) { return "Fog"; } else if ((chance -= 10) < 0) { return "Clouds"; } else if ((chance -= 40) < 0) { return "Fair Skies"; } else { return "Clear Skies"; } },
    "Eureka Anemos": function(chance) { if ((chance -= 30) < 0) { return "Fair Skies"; } else if ((chance -= 30) < 0) { return "Gales"; } else if ((chance -= 30) < 0) { return "Showers"; } else { return "Snow"; } },
    "Eureka Pagos": function(chance) { if ((chance -= 10) < 0) { return "Clear Skies"; } else if ((chance -= 18) < 0) { return "Fog"; } else if ((chance -= 18) < 0) { return "Heat Waves"; } else if ((chance -= 18) < 0) { return "Snow"; } else if ((chance -= 18) < 0) { return "Thunder"; } else { return "Brizzards"; } },
    "Eureka Pyros": function(chance) { if ((chance -= 10) < 0) { return "Fair Skies"; } else if ((chance -= 18) < 0) { return "Heat Waves"; } else if ((chance -= 18) < 0) { return "Thunder"; } else if ((chance -= 18) < 0) { return "Blizzards"; } else if ((chance -= 18) < 0) { return "Umbral Wind"; } else { return "Snow"; } },
    "Eureka Hydatos": function(chance) { if ((chance -= 12) < 0) { return "Fair Skies"; } else if ((chance -= 22) < 0) { return "Showers"; } else if ((chance -= 22) < 0) { return "Gloom"; } else if ((chance -= 22) < 0) { return "Thunderstorms"; } else { return "Snow"; } }
  }  
};

function getFishChance(zone_, targetWeather_, targetPrevWeather_, startTime_, endTime_) {  
  var weatherStartTime = WeatherFinder.getWeatherTimeFloor(new Date()).getTime();
  var weatherStartHour = WeatherFinder.getEorzeaHour(weatherStartTime);
  var weatherEndHour = weatherStartHour + 8 // エオルゼア仕様
  var zone = WeatherFinder.zoneJp[zone_]
  var targetWeather = WeatherFinder.weatherJp[targetWeather_]
  var targetPrevWeather = WeatherFinder.weatherJp[targetPrevWeather_]
  var startTime = (startTime_ === "なし") ? 0 : startTime_;
  var endTime = (endTime_ === "なし") ? 24 : endTime_;
  var tries = 0;
  var matches = 0;
  var weather = WeatherFinder.getWeather(weatherStartTime, zone);
  var prevWeather = WeatherFinder.getWeather(weatherStartTime-1, zone);
  var targetFishHours = WeatherFinder.getTargetHourArray(startTime, endTime)

  var result = [];
  
  while (tries < 1000 && matches < 5) {    
    var weatherMatch = targetWeather == null;
    var prevWeatherMatch = targetPrevWeather == null;
    var timeMatch = null;
    if (targetWeather == "" || targetWeather == weather) {
      weatherMatch = true;  
    }
    if (targetPrevWeather == "" || targetPrevWeather == prevWeather) {
      prevWeatherMatch = true;
    }
    
    var weatherHours = WeatherFinder.getTargetHourArray(weatherStartHour, weatherEndHour)
    if (WeatherFinder.isDuplicate(targetFishHours, weatherHours)){
      timeMatch = true;
    }
    
    if (weatherMatch && prevWeatherMatch && timeMatch) {
      Logger.log(matches);
      var weatherDate = new Date(weatherStartTime);
      var month = weatherDate.getMonth() + 1
      var day = weatherDate.getDate()
      var hour = ("0"+(weatherDate.getHours())).slice(-2)
      var minutes = ("0"+(weatherDate.getMinutes())).slice(-2)
      var EorzeaHour = weatherStartHour+':00'

      //var tmp = [matches, prevWeather, weather, month+'/'+day+' '+hour + ':' + minutes, 'ET'+EorzeaHour ].join('_')
      var tmp = [month+'/'+day+' '+hour + ':' + minutes, 'ET'+EorzeaHour ].join('_')
      result.push(tmp)
      matches++;
    }
    weatherStartTime += 8 * 175 * 1000; // Increment by 8 Eorzean hours
    weatherStartHour = WeatherFinder.getEorzeaHour(weatherStartTime);
    weatherEndHour = weatherStartHour + 8
    prevWeather = weather;
    weather = WeatherFinder.getWeather(weatherStartTime, zone);
    tries++;  
  }
  
  return result
};

// Todo: リファクタリング
function getFish(){
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('シート1');
  //Logger.log(sheet.getName());
  var lastRow = sheet.getRange(1, 1).getNextDataCell(SpreadsheetApp.Direction.DOWN).getRow();
  //Logger.log(lastRow);
  
  // ヘッダ行は飛ばして全行見る
  for (var i = 2; i <= lastRow; i++){
    var zone = sheet.getRange(i, 2).getValue();
    var start = sheet.getRange(i, 3).getValue();
    var end = sheet.getRange(i, 4).getValue();
    var preWeather = sheet.getRange(i, 5).getValue();
    var Weather = sheet.getRange(i, 6).getValue();
    
    Logger.log(zone);
    chances = getFishChance(zone, Weather, preWeather, start, end);
    
    // 次回候補日をべたに出す
    sheet.getRange(i, 7).setValue(chances[0]);
    sheet.getRange(i, 8).setValue(chances[1]);
    sheet.getRange(i, 9).setValue(chances[2]);
  }
};