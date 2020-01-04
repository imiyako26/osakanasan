var weatherJpToEn = {
  "晴れ": "Fair Skies",
  "快晴": "Clear Skies",
  "曇り": "Clouds",
  "霧": "Fog",
  "雨": "Rain",
  "風": "Wind",
  "雷": "Thunder",
  "雷雨": "Thunderstorms",
  "暴雨": "Showers",
  "砂塵": "Dust Storms",
  "灼熱波": "Heat Waves",
  "雪": "Snow",
  "吹雪": "Blizzards",
  "妖霧": "Gloom",
  "暴風": "Gales",
  "霊風": "Umbral Wind",
  "放電": "Umbral Static",
  "なし": "",
};
var weatherEnToJp = { };
for (var jp in weatherJpToEn) 
  weatherEnToJp[weatherJpToEn[jp]] = jp;

var WeatherFinder = {
  getWeather: function (timeMillis, zone) {
    return this.weatherChances[zone](this.calculateForecastTarget(timeMillis));
  },

  calculateForecastTarget: function (timeMillis) {
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

  getEorzeaHour: function (timeMillis) {
    var unixSeconds = parseInt(timeMillis / 1000);
    // Get Eorzea hour
    var bell = (unixSeconds / 175) % 24;
    return Math.floor(bell);
  },

  getEorzeaTime: function (timeMillis) {
    // https://www.reddit.com/r/ffxiv/comments/2pbl8p/eorzea_time_formula/?st=k4zlmbq1&sh=3a4de6d2
    var epoch = timeMillis * 20.571428571428573;
    /* floorだと1分遅れて見える？ */
    var minutes = Math.ceil((epoch / (1000 * 60)) % 60);
    var hours = Math.floor((epoch / (1000 * 60 * 60)) % 24);
    var date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    return date;
  },

  getWeatherTimeFloor: function (date) {
    var unixSeconds = parseInt(date.getTime() / 1000);
    // Get Eorzea hour for weather start
    var bell = Math.floor(unixSeconds / 175) % 24;
    var startBell = bell - (bell % 8);
    var startUnixSeconds = unixSeconds - (175 * (bell - startBell));
    return new Date(startUnixSeconds * 1000);
  },

  // getTargetHourArray: function (start, end) {
  //   var retVal = []

  //   if (start > end) {
  //     // 日付またぎ
  //     for (var i = start; i < 24; i++) {
  //       retVal.push(i);
  //     }
  //     for (var j = 0; j < end; j++) {
  //       retVal.push(j);
  //     }
  //   }
  //   else {
  //     for (var i = start; i < end; i++) {
  //       retVal.push(i);
  //     }
  //   }
  //   return retVal;
  // },

  // isDuplicate: function (array1, array2) {
  //   for (var i = 0; i < array1.length; i++) {
  //     for (var j = 0; j < array2.length; j++) {
  //       if (array1[i] == array2[j]) { return true; }
  //     }
  //   }
  //   return false;
  // },

  weatherJp: weatherJpToEn,

  zoneJp: {
    "リムサ・ロミンサ：下甲板層": "Limsa Lominsa",
    "リムサ・ロミンサ：上甲板層": "Limsa Lominsa",
    "リムサ・ロミンサ": "Limsa Lominsa",
    "中央ラノシア": "Middle La Noscea",
    "低地ラノシア": "Lower La Noscea",
    "東ラノシア": "Eastern La Noscea",
    "西ラノシア": "Western La Noscea",
    "高地ラノシア": "Upper La Noscea",
    "外地ラノシア": "Outer La Noscea",
    "ミスト": "Mist",
    "ミスト・ヴィレッジ": "Mist",
    "グリダニア：旧市街": "Gridania",
    "グリダニア：新市街": "Gridania",
    "グリダニア": "Gridania",
    "黒衣森：中央森林": "Central Shroud",
    "黒衣森：東部森林": "East Shroud",
    "黒衣森：南部森林": "South Shroud",
    "黒衣森：北部森林": "North Shroud",
    "ラベンダーベッド": "The Lavender Beds",
    "ウルダハ：ナル回廊": "Ul'dah",
    "西ザナラーン": "Western Thanalan",
    "中央ザナラーン": "Central Thanalan",
    "東ザナラーン": "Eastern Thanalan",
    "南ザナラーン": "Southern Thanalan",
    "北ザナラーン": "Northern Thanalan",
    "ゴブレットビュート": "The Goblet",
    "モードゥナ": "Mor Dhona",
    "イシュガルド：下層": "Ishgard",
    "イシュガルド：上層": "Ishgard",
    "クルザス中央高地": "Coerthas Central Highlands",
    "クルザス西部高地": "Coerthas Western Highlands",
    "アバラシア雲海": "The Sea of Clouds",
    "アジス・ラー": "Azys Lla",
    "高地ドラヴァニア": "The Dravanian Forelands",
    "低地ドラヴァニア": "The Dravanian Hinterlands",
    "ドラヴァニア雲海": "The Churning Mists",
    "イディルシャイア": "Idyllshire",
    "ラールガーズリーチ": "Rhalgr's Reach",
    "ギラバニア辺境地帯": "The Fringes",
    "ギラバニア山岳地帯": "The Peaks",
    "ギラバニア湖畔地帯": "The Lochs",
    "クガネ": "Kugane",
    "紅玉海": "The Ruby Sea",
    "ヤンサ": "Yanxia",
    "アジムステップ": "The Azim Steppe",
    "クガネ": "Kugane",
    "シロガネ": "Shirogane",
  },

  weatherChances: {
    "Limsa Lominsa": function (chance) { if (chance < 20) { return "Clouds"; } else if (chance < 50) { return "Clear Skies"; } else if (chance < 80) { return "Fair Skies"; } else if (chance < 90) { return "Fog"; } else { return "Rain"; } },
    "Middle La Noscea": function (chance) { if (chance < 20) { return "Clouds"; } else if (chance < 50) { return "Clear Skies"; } else if (chance < 70) { return "Fair Skies"; } else if (chance < 80) { return "Wind"; } else if (chance < 90) { return "Fog"; } else { return "Rain"; } },
    "Lower La Noscea": function (chance) { if (chance < 20) { return "Clouds"; } else if (chance < 50) { return "Clear Skies"; } else if (chance < 70) { return "Fair Skies"; } else if (chance < 80) { return "Wind"; } else if (chance < 90) { return "Fog"; } else { return "Rain"; } },
    "Eastern La Noscea": function (chance) { if (chance < 5) { return "Fog"; } else if (chance < 50) { return "Clear Skies"; } else if (chance < 80) { return "Fair Skies"; } else if (chance < 90) { return "Clouds"; } else if (chance < 95) { return "Rain"; } else { return "Showers"; } },
    "Western La Noscea": function (chance) { if (chance < 10) { return "Fog"; } else if (chance < 40) { return "Clear Skies"; } else if (chance < 60) { return "Fair Skies"; } else if (chance < 80) { return "Clouds"; } else if (chance < 90) { return "Wind"; } else { return "Gales"; } },
    "Upper La Noscea": function (chance) { if (chance < 30) { return "Clear Skies"; } else if (chance < 50) { return "Fair Skies"; } else if (chance < 70) { return "Clouds"; } else if (chance < 80) { return "Fog"; } else if (chance < 90) { return "Thunder"; } else { return "Thunderstorms"; } },
    "Outer La Noscea": function (chance) { if (chance < 30) { return "Clear Skies"; } else if (chance < 50) { return "Fair Skies"; } else if (chance < 70) { return "Clouds"; } else if (chance < 85) { return "Fog"; } else { return "Rain"; } },
    "Mist": function (chance) { if (chance < 20) { return "Clouds"; } else if (chance < 50) { return "Clear Skies"; } else if (chance < 70) { return "Fair Skies"; } else if (chance < 80) { return "Fair Skies"; } else if (chance < 90) { return "Fog"; } else { return "Rain"; } },
    "Gridania": function (chance) { if (chance < 5) { return "Rain"; } else if (chance < 20) { return "Rain"; } else if (chance < 30) { return "Fog"; } else if (chance < 40) { return "Clouds"; } else if (chance < 55) { return "Fair Skies"; } else if (chance < 85) { return "Clear Skies"; } else { return "Fair Skies"; } },
    "Central Shroud": function (chance) { if (chance < 5) { return "Thunder"; } else if (chance < 20) { return "Rain"; } else if (chance < 30) { return "Fog"; } else if (chance < 40) { return "Clouds"; } else if (chance < 55) { return "Fair Skies"; } else if (chance < 85) { return "Clear Skies"; } else { return "Fair Skies"; } },
    "East Shroud": function (chance) { if (chance < 5) { return "Thunder"; } else if (chance < 20) { return "Rain"; } else if (chance < 30) { return "Fog"; } else if (chance < 40) { return "Clouds"; } else if (chance < 55) { return "Fair Skies"; } else if (chance < 85) { return "Clear Skies"; } else { return "Fair Skies"; } },
    "South Shroud": function (chance) { if (chance < 5) { return "Fog"; } else if (chance < 10) { return "Thunderstorms"; } else if (chance < 25) { return "Thunder"; } else if (chance < 30) { return "Fog"; } else if (chance < 40) { return "Clouds"; } else if (chance < 70) { return "Fair Skies"; } else { return "Clear Skies"; } },
    "North Shroud": function (chance) { if (chance < 5) { return "Fog"; } else if (chance < 10) { return "Showers"; } else if (chance < 25) { return "Rain"; } else if (chance < 30) { return "Fog"; } else if (chance < 40) { return "Clouds"; } else if (chance < 70) { return "Fair Skies"; } else { return "Clear Skies"; } },
    "The Lavender Beds": function (chance) { if (chance < 5) { return "Clouds"; } else if (chance < 20) { return "Rain"; } else if (chance < 30) { return "Fog"; } else if (chance < 40) { return "Clouds"; } else if (chance < 55) { return "Fair Skies"; } else if (chance < 85) { return "Clear Skies"; } else { return "Fair Skies"; } },
    "Ul'dah": function (chance) { if (chance < 40) { return "Clear Skies"; } else if (chance < 60) { return "Fair Skies"; } else if (chance < 85) { return "Clouds"; } else if (chance < 95) { return "Fog"; } else { return "Rain"; } },
    "Western Thanalan": function (chance) { if (chance < 40) { return "Clear Skies"; } else if (chance < 60) { return "Fair Skies"; } else if (chance < 85) { return "Clouds"; } else if (chance < 95) { return "Fog"; } else { return "Rain"; } },
    "Central Thanalan": function (chance) { if (chance < 15) { return "Dust Storms"; } else if (chance < 55) { return "Clear Skies"; } else if (chance < 75) { return "Fair Skies"; } else if (chance < 85) { return "Clouds"; } else if (chance < 95) { return "Fog"; } else { return "Rain"; } },
    "Eastern Thanalan": function (chance) { if (chance < 40) { return "Clear Skies"; } else if (chance < 60) { return "Fair Skies"; } else if (chance < 70) { return "Clouds"; } else if (chance < 80) { return "Fog"; } else if (chance < 85) { return "Rain"; } else { return "Showers"; } },
    "Southern Thanalan": function (chance) { if (chance < 20) { return "Heat Waves"; } else if (chance < 60) { return "Clear Skies"; } else if (chance < 80) { return "Fair Skies"; } else if (chance < 90) { return "Clouds"; } else { return "Fog"; } },
    "Northern Thanalan": function (chance) { if (chance < 5) { return "Clear Skies"; } else if (chance < 20) { return "Fair Skies"; } else if (chance < 50) { return "Clouds"; } else { return "Fog"; } },
    "The Goblet": function (chance) { if (chance < 40) { return "Clear Skies"; } else if (chance < 60) { return "Fair Skies"; } else if (chance < 85) { return "Clouds"; } else if (chance < 95) { return "Fog"; } else { return "Rain"; } },
    "Mor Dhona": function (chance) { if (chance < 15) { return "Clouds"; } else if (chance < 30) { return "Fog"; } else if (chance < 60) { return "Gloom"; } else if (chance < 75) { return "Clear Skies"; } else { return "Fair Skies"; } },
    "Ishgard": function (chance) { if (chance < 60) { return "Snow"; } else if (chance < 70) { return "Fair Skies"; } else if (chance < 75) { return "Clear Skies"; } else if (chance < 90) { return "Clouds"; } else { return "Fog"; } },
    "Coerthas Central Highlands": function (chance) { if (chance < 20) { return "Blizzards"; } else if (chance < 60) { return "Snow"; } else if (chance < 70) { return "Fair Skies"; } else if (chance < 75) { return "Clear Skies"; } else if (chance < 90) { return "Clouds"; } else { return "Fog"; } },
    "Coerthas Western Highlands": function (chance) { if (chance < 20) { return "Blizzards"; } else if (chance < 60) { return "Snow"; } else if (chance < 70) { return "Fair Skies"; } else if (chance < 75) { return "Clear Skies"; } else if (chance < 90) { return "Clouds"; } else { return "Fog"; } },
    "The Sea of Clouds": function (chance) { if (chance < 30) { return "Clear Skies"; } else if (chance < 60) { return "Fair Skies"; } else if (chance < 70) { return "Clouds"; } else if (chance < 80) { return "Fog"; } else if (chance < 90) { return "Wind"; } else { return "Umbral Wind"; } },
    "Azys Lla": function (chance) { if (chance < 35) { return "Fair Skies"; } else if (chance < 70) { return "Clouds"; } else { return "Thunder"; } },
    "The Dravanian Forelands": function (chance) { if (chance < 10) { return "Clouds"; } else if (chance < 20) { return "Fog"; } else if (chance < 30) { return "Thunder"; } else if (chance < 40) { return "Dust Storms"; } else if (chance < 70) { return "Clear Skies"; } else { return "Fair Skies"; } },
    "The Dravanian Hinterlands": function (chance) { if (chance < 10) { return "Clouds"; } else if (chance < 20) { return "Fog"; } else if (chance < 30) { return "Rain"; } else if (chance < 40) { return "Showers"; } else if (chance < 70) { return "Clear Skies"; } else { return "Fair Skies"; } },
    "The Churning Mists": function (chance) { if (chance < 10) { return "Clouds"; } else if (chance < 20) { return "Gales"; } else if (chance < 40) { return "Umbral Static"; } else if (chance < 70) { return "Clear Skies"; } else { return "Fair Skies"; } },
    "Idyllshire": function (chance) { if (chance < 10) { return "Clouds"; } else if (chance < 20) { return "Fog"; } else if (chance < 30) { return "Rain"; } else if (chance < 40) { return "Showers"; } else if (chance < 70) { return "Clear Skies"; } else { return "Fair Skies"; } },
    // Data format changed from aggregate to marginal breakpoints
    "Rhalgr's Reach": function (chance) { if ((chance -= 15) < 0) { return "Clear Skies"; } else if ((chance -= 45) < 0) { return "Fair Skies"; } else if ((chance -= 20) < 0) { return "Clouds"; } else if ((chance -= 10) < 0) { return "Fog"; } else { return "Thunder"; } },
    "The Fringes": function (chance) { if ((chance -= 15) < 0) { return "Clear Skies"; } else if ((chance -= 45) < 0) { return "Fair Skies"; } else if ((chance -= 20) < 0) { return "Clouds"; } else if ((chance -= 10) < 0) { return "Fog"; } else { return "Thunder"; } },
    "The Peaks": function (chance) { if ((chance -= 10) < 0) { return "Clear Skies"; } else if ((chance -= 50) < 0) { return "Fair Skies"; } else if ((chance -= 15) < 0) { return "Clouds"; } else if ((chance -= 10) < 0) { return "Fog"; } else if ((chance -= 10) < 0) { return "Wind"; } else { return "Dust Storms"; } },
    "The Lochs": function (chance) { if ((chance -= 20) < 0) { return "Clear Skies"; } else if ((chance -= 40) < 0) { return "Fair Skies"; } else if ((chance -= 20) < 0) { return "Clouds"; } else if ((chance -= 10) < 0) { return "Fog"; } else { return "Thunderstorms"; } },
    "Kugane": function (chance) { if ((chance -= 10) < 0) { return "Rain"; } else if ((chance -= 10) < 0) { return "Fog"; } else if ((chance -= 20) < 0) { return "Clouds"; } else if ((chance -= 40) < 0) { return "Fair Skies"; } else { return "Clear Skies"; } },
    "The Ruby Sea": function (chance) { if ((chance -= 10) < 0) { return "Thunder"; } else if ((chance -= 10) < 0) { return "Wind"; } else if ((chance -= 15) < 0) { return "Clouds"; } else if ((chance -= 40) < 0) { return "Fair Skies"; } else { return "Clear Skies"; } },
    "Yanxia": function (chance) { if ((chance -= 5) < 0) { return "Showers"; } else if ((chance -= 10) < 0) { return "Rain"; } else if ((chance -= 10) < 0) { return "Fog"; } else if ((chance -= 15) < 0) { return "Clouds"; } else if ((chance -= 40) < 0) { return "Fair Skies"; } else { return "Clear Skies"; } },
    "The Azim Steppe": function (chance) { if ((chance -= 5) < 0) { return "Gales"; } else if ((chance -= 5) < 0) { return "Wind"; } else if ((chance -= 7) < 0) { return "Rain"; } else if ((chance -= 8) < 0) { return "Fog"; } else if ((chance -= 10) < 0) { return "Clouds"; } else if ((chance -= 40) < 0) { return "Fair Skies"; } else { return "Clear Skies"; } },
    "Eureka Anemos": function (chance) { if ((chance -= 30) < 0) { return "Fair Skies"; } else if ((chance -= 30) < 0) { return "Gales"; } else if ((chance -= 30) < 0) { return "Showers"; } else { return "Snow"; } },
    "Eureka Pagos": function (chance) { if ((chance -= 10) < 0) { return "Clear Skies"; } else if ((chance -= 18) < 0) { return "Fog"; } else if ((chance -= 18) < 0) { return "Heat Waves"; } else if ((chance -= 18) < 0) { return "Snow"; } else if ((chance -= 18) < 0) { return "Thunder"; } else { return "Brizzards"; } },
    "Eureka Pyros": function (chance) { if ((chance -= 10) < 0) { return "Fair Skies"; } else if ((chance -= 18) < 0) { return "Heat Waves"; } else if ((chance -= 18) < 0) { return "Thunder"; } else if ((chance -= 18) < 0) { return "Blizzards"; } else if ((chance -= 18) < 0) { return "Umbral Wind"; } else { return "Snow"; } },
    "Eureka Hydatos": function (chance) { if ((chance -= 12) < 0) { return "Fair Skies"; } else if ((chance -= 22) < 0) { return "Showers"; } else if ((chance -= 22) < 0) { return "Gloom"; } else if ((chance -= 22) < 0) { return "Thunderstorms"; } else { return "Snow"; } },
    "Shirogane": function (chance) {
      if (chance < 10) {
        return "Rain";
      }
      if (chance < 20) {
        return "Fog";
      }
      if (chance < 40) {
        return "Clouds";
      }
      if (chance < 80) {
        return "Fair Skies";
      }
      return "Clear Skies";
    }
  }
};

function makeTranslatedWeatherArray(weathers) {
  /* 空文字は条件なし (=null) */
  if (weathers.length == 0) {
    return null;
  }

  /* weathersは"・"で区切られた日本語の天気　(例: "雨・豪雨")*/
  var arr = weathers.split("・");
  /* 英名を入れる (例: ["Rain", "Showers"])*/
  var eng = [];
  for (var i = 0; i < arr.length; i++) {
    var weatherJp = arr[i];
    var weatherEn = WeatherFinder.weatherJp[weatherJp];
    eng.push(weatherEn);
  }
  return eng;
}

function calculateTimeRange(windowStart, start, end) {
  switch (windowStart) {
    case 0: {
      if (start >= 8) {
        return null;
      }
      return { 
        start: start, 
        end: Math.min(end, 8) 
      };
    }
    case 8: {
      if (end > 8) {
        if (start >= 16) {
          return null
        }
        return { 
          start: start,
          end: Math.min(end, 16)
        }
      } else {
        return null
      }
    }
    case 16: {
      if (end <= 16) {
        return null;
      }

      return {
        start: Math.max(start, 16),
        end: end
      }
    }
  }
}

/* エオルゼア時間の切れ目(0-8, 8-16, 16-24)毎の開始・終了時間を計算する。null = NG */
function calculateTimeRangePerWindows(start, end) {
  if (end < start) {
    /* 日付を跨ぐ場合は別々に計算してくっ付ける */
    var a = calculateTimeRangePerWindows(start, 24)
    var b = calculateTimeRangePerWindows(0, end)
    return {
      '0': a['0'] || b['0'],
      '8': a['8'] || b['8'],
      '16': a['16'] || b['16']
    };
  } else {
    return { 
      '0': calculateTimeRange(0, start, end),
      '8': calculateTimeRange(8, start, end),
      '16': calculateTimeRange(16, start, end)
    };
  }
}

function getFishChance(maximum, zone_, targetWeather_, targetPrevWeather_, startTime_, endTime_) {
  /* 地球時間をET0,8,16に合わせる (Floor = 下合わせ？) */
  var weatherStartTime = WeatherFinder.getWeatherTimeFloor(new Date()).getTime();
  // console.log(WeatherFinder.getEorzeaHour(weatherStartTime))
  /* ET */
  var weatherStartHour = WeatherFinder.getEorzeaHour(weatherStartTime);
  /* ETのおわ */
  var weatherEndHour = weatherStartHour + 8 // エオルゼア仕様
  /* 日本語から英名に */
  var zone = WeatherFinder.zoneJp[zone_]
  // console.log(zone_ + "→" + zone)
  var targetWeathers = makeTranslatedWeatherArray(targetWeather_)
  var targetPrevWeathers = makeTranslatedWeatherArray(targetPrevWeather_)
  /* おさかなの開始・終了時間 */
  var startTime = (startTime_ === "") ? 0 : startTime_;
  var endTime = (endTime_ === "") ? 24 : endTime_;

  var windows = calculateTimeRangePerWindows(startTime, endTime)

  /* 現在の天気 */
  var weather = WeatherFinder.getWeather(weatherStartTime, zone);
  /* ひとつ前の天気 */
  var prevWeather = WeatherFinder.getWeather(weatherStartTime - 1, zone);

  /* おさかなチャンスリスト */
  var result = [];

  /* 挑戦回数・ヒット回数 */
  var tries = 0;
  var matches = 0;
  while (tries < 3000 && matches < maximum) {
    /* nullのときは天気指定なし */
    var weatherMatch = targetWeathers == null;
    var prevWeatherMatch = targetPrevWeathers == null;

    /* 天気が一致するかどうか */
    if (targetWeathers != null && targetWeathers.includes(weather)) {
      weatherMatch = true;
    }
    /* 前の天気が一致するかどうか */
    if (targetPrevWeathers != null && targetPrevWeathers.includes(prevWeather)) {
      prevWeatherMatch = true;
    }

      /* 0 or 8 or 16 */
    var windowStartET = WeatherFinder.getEorzeaHour(weatherStartTime);
    var fishWindow = windows[windowStartET]

    /* ヒット! */
    if (weatherMatch && prevWeatherMatch && fishWindow) {
      /* 時間調整。例えば10時開始の場合は+2時間する。 エオ1時間=リアル175秒*/
      /* おさかなさん開始時刻。単位はミリ秒 (= 0.001秒) */
      var windowStartTime = weatherStartTime;
      /* おさかな時間開始が天気開始時刻より遅い場合 */
      if (fishWindow.start > windowStartET) {
        windowStartET = fishWindow.start;
        /* 遅れ分足す */
        windowStartTime += (fishWindow.start % 8) * 175 * 1000;
      }

      result.push(windowStartTime)
      matches++;
    }

    /* 試行時間・天気を更新 */
    weatherStartTime += 8 * 175 * 1000; // Increment by 8 Eorzean hours
    weatherStartHour = WeatherFinder.getEorzeaHour(weatherStartTime);
    weatherEndHour = weatherStartHour + 8
    prevWeather = weather;
    weather = WeatherFinder.getWeather(weatherStartTime, zone);
    tries++;
  }

  return result;
}

function dateToYearMonthDayHoursMinutes(date) {
  var year = ("0000" + (date.getFullYear())).slice(-4);
  var month = ("0" + (date.getMonth() + 1)).slice(-2);
  var day = ("0" + date.getDate()).slice(-2);
  var hour = ("0" + (date.getHours())).slice(-2);
  var minutes = ("0" + (date.getMinutes())).slice(-2);
  return year + "/" + month + "/" + day + " " + hour + ":" + minutes;
}

function formatDateAndTime(date) {
  var month = ("0" + (date.getMonth() + 1)).slice(-2);
  var day = ("0" + date.getDate()).slice(-2);
  var hour = ("0" + (date.getHours())).slice(-2);
  var minutes = ("0" + (date.getMinutes())).slice(-2);
  return month + "/" + day + " " + hour + ":" + minutes;
}

function getFormattedLocalTime(timeMillis) {
  var date = new Date(timeMillis);
  return formatDateAndTime(date);
}

function getFormattedEorzeaTime(timeMillis) {
  var hours = WeatherFinder.getEorzeaHour(timeMillis);
  return "ET" + ("0" + hours).slice(-2) + ":00";
}