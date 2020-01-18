var DateAndTime = (function() {
  
  function toDate(date) {
    if (typeof date === 'number') {
      return new Date(date);
    } else if (date instanceof Date) {
      return date;
    } else {
      throw new Error('なんかおかしくない？');
    }
  }
  
  function toMillis(date) {
    if (typeof date === 'number') {
      return date;
    } else if (date instanceof Date) {
      return date.getTime();
    } else {
      throw new Error('なんかおかしくない？');
    }
  }
  
  function formatDateAndTime(date) {
    date = toDate(date);
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);
    var hour = ("0" + (date.getHours())).slice(-2);
    var minutes = ("0" + (date.getMinutes())).slice(-2);
    return month + "/" + day + " " + hour + ":" + minutes;
  }

  function formatTime(date) {
    date = toDate(date);
    return ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
  }
  
  return {
    toMillis: toMillis,
    toDate: toDate,
    formatTime: formatTime,
    formatDateAndTime: formatDateAndTime
  };
})();

var DateAndTimeMixin = {
  methods: DateAndTime
};

var WeatherFinder = (function () {
  var weatherChances = {
    "Limsa Lominsa": function (chance) {
      if (chance < 20) {
        return "Clouds";
      } else if (chance < 50) {
        return "Clear Skies";
      } else if (chance < 80) {
        return "Fair Skies";
      } else if (chance < 90) {
        return "Fog";
      } else {
        return "Rain";
      }
    },
    "Middle La Noscea": function (chance) {
      if (chance < 20) {
        return "Clouds";
      } else if (chance < 50) {
        return "Clear Skies";
      } else if (chance < 70) {
        return "Fair Skies";
      } else if (chance < 80) {
        return "Wind";
      } else if (chance < 90) {
        return "Fog";
      } else {
        return "Rain";
      }
    },
    "Lower La Noscea": function (chance) {
      if (chance < 20) {
        return "Clouds";
      } else if (chance < 50) {
        return "Clear Skies";
      } else if (chance < 70) {
        return "Fair Skies";
      } else if (chance < 80) {
        return "Wind";
      } else if (chance < 90) {
        return "Fog";
      } else {
        return "Rain";
      }
    },
    "Eastern La Noscea": function (chance) {
      if (chance < 5) {
        return "Fog";
      } else if (chance < 50) {
        return "Clear Skies";
      } else if (chance < 80) {
        return "Fair Skies";
      } else if (chance < 90) {
        return "Clouds";
      } else if (chance < 95) {
        return "Rain";
      } else {
        return "Showers";
      }
    },
    "Western La Noscea": function (chance) {
      if (chance < 10) {
        return "Fog";
      } else if (chance < 40) {
        return "Clear Skies";
      } else if (chance < 60) {
        return "Fair Skies";
      } else if (chance < 80) {
        return "Clouds";
      } else if (chance < 90) {
        return "Wind";
      } else {
        return "Gales";
      }
    },
    "Upper La Noscea": function (chance) {
      if (chance < 30) {
        return "Clear Skies";
      } else if (chance < 50) {
        return "Fair Skies";
      } else if (chance < 70) {
        return "Clouds";
      } else if (chance < 80) {
        return "Fog";
      } else if (chance < 90) {
        return "Thunder";
      } else {
        return "Thunderstorms";
      }
    },
    "Outer La Noscea": function (chance) {
      if (chance < 30) {
        return "Clear Skies";
      } else if (chance < 50) {
        return "Fair Skies";
      } else if (chance < 70) {
        return "Clouds";
      } else if (chance < 85) {
        return "Fog";
      } else {
        return "Rain";
      }
    },
    "Mist": function (chance) {
      if (chance < 20) {
        return "Clouds";
      } else if (chance < 50) {
        return "Clear Skies";
      } else if (chance < 70) {
        return "Fair Skies";
      } else if (chance < 80) {
        return "Fair Skies";
      } else if (chance < 90) {
        return "Fog";
      } else {
        return "Rain";
      }
    },
    "Gridania": function (chance) {
      if (chance < 5) {
        return "Rain";
      } else if (chance < 20) {
        return "Rain";
      } else if (chance < 30) {
        return "Fog";
      } else if (chance < 40) {
        return "Clouds";
      } else if (chance < 55) {
        return "Fair Skies";
      } else if (chance < 85) {
        return "Clear Skies";
      } else {
        return "Fair Skies";
      }
    },
    "Central Shroud": function (chance) {
      if (chance < 5) {
        return "Thunder";
      } else if (chance < 20) {
        return "Rain";
      } else if (chance < 30) {
        return "Fog";
      } else if (chance < 40) {
        return "Clouds";
      } else if (chance < 55) {
        return "Fair Skies";
      } else if (chance < 85) {
        return "Clear Skies";
      } else {
        return "Fair Skies";
      }
    },
    "East Shroud": function (chance) {
      if (chance < 5) {
        return "Thunder";
      } else if (chance < 20) {
        return "Rain";
      } else if (chance < 30) {
        return "Fog";
      } else if (chance < 40) {
        return "Clouds";
      } else if (chance < 55) {
        return "Fair Skies";
      } else if (chance < 85) {
        return "Clear Skies";
      } else {
        return "Fair Skies";
      }
    },
    "South Shroud": function (chance) {
      if (chance < 5) {
        return "Fog";
      } else if (chance < 10) {
        return "Thunderstorms";
      } else if (chance < 25) {
        return "Thunder";
      } else if (chance < 30) {
        return "Fog";
      } else if (chance < 40) {
        return "Clouds";
      } else if (chance < 70) {
        return "Fair Skies";
      } else {
        return "Clear Skies";
      }
    },
    "North Shroud": function (chance) {
      if (chance < 5) {
        return "Fog";
      } else if (chance < 10) {
        return "Showers";
      } else if (chance < 25) {
        return "Rain";
      } else if (chance < 30) {
        return "Fog";
      } else if (chance < 40) {
        return "Clouds";
      } else if (chance < 70) {
        return "Fair Skies";
      } else {
        return "Clear Skies";
      }
    },
    "The Lavender Beds": function (chance) {
      if (chance < 5) {
        return "Clouds";
      } else if (chance < 20) {
        return "Rain";
      } else if (chance < 30) {
        return "Fog";
      } else if (chance < 40) {
        return "Clouds";
      } else if (chance < 55) {
        return "Fair Skies";
      } else if (chance < 85) {
        return "Clear Skies";
      } else {
        return "Fair Skies";
      }
    },
    "Ul'dah": function (chance) {
      if (chance < 40) {
        return "Clear Skies";
      } else if (chance < 60) {
        return "Fair Skies";
      } else if (chance < 85) {
        return "Clouds";
      } else if (chance < 95) {
        return "Fog";
      } else {
        return "Rain";
      }
    },
    "Western Thanalan": function (chance) {
      if (chance < 40) {
        return "Clear Skies";
      } else if (chance < 60) {
        return "Fair Skies";
      } else if (chance < 85) {
        return "Clouds";
      } else if (chance < 95) {
        return "Fog";
      } else {
        return "Rain";
      }
    },
    "Central Thanalan": function (chance) {
      if (chance < 15) {
        return "Dust Storms";
      } else if (chance < 55) {
        return "Clear Skies";
      } else if (chance < 75) {
        return "Fair Skies";
      } else if (chance < 85) {
        return "Clouds";
      } else if (chance < 95) {
        return "Fog";
      } else {
        return "Rain";
      }
    },
    "Eastern Thanalan": function (chance) {
      if (chance < 40) {
        return "Clear Skies";
      } else if (chance < 60) {
        return "Fair Skies";
      } else if (chance < 70) {
        return "Clouds";
      } else if (chance < 80) {
        return "Fog";
      } else if (chance < 85) {
        return "Rain";
      } else {
        return "Showers";
      }
    },
    "Southern Thanalan": function (chance) {
      if (chance < 20) {
        return "Heat Waves";
      } else if (chance < 60) {
        return "Clear Skies";
      } else if (chance < 80) {
        return "Fair Skies";
      } else if (chance < 90) {
        return "Clouds";
      } else {
        return "Fog";
      }
    },
    "Northern Thanalan": function (chance) {
      if (chance < 5) {
        return "Clear Skies";
      } else if (chance < 20) {
        return "Fair Skies";
      } else if (chance < 50) {
        return "Clouds";
      } else {
        return "Fog";
      }
    },
    "The Goblet": function (chance) {
      if (chance < 40) {
        return "Clear Skies";
      } else if (chance < 60) {
        return "Fair Skies";
      } else if (chance < 85) {
        return "Clouds";
      } else if (chance < 95) {
        return "Fog";
      } else {
        return "Rain";
      }
    },
    "Mor Dhona": function (chance) {
      if (chance < 15) {
        return "Clouds";
      } else if (chance < 30) {
        return "Fog";
      } else if (chance < 60) {
        return "Gloom";
      } else if (chance < 75) {
        return "Clear Skies";
      } else {
        return "Fair Skies";
      }
    },
    "Ishgard": function (chance) {
      if (chance < 60) {
        return "Snow";
      } else if (chance < 70) {
        return "Fair Skies";
      } else if (chance < 75) {
        return "Clear Skies";
      } else if (chance < 90) {
        return "Clouds";
      } else {
        return "Fog";
      }
    },
    "Coerthas Central Highlands": function (chance) {
      if (chance < 20) {
        return "Blizzards";
      } else if (chance < 60) {
        return "Snow";
      } else if (chance < 70) {
        return "Fair Skies";
      } else if (chance < 75) {
        return "Clear Skies";
      } else if (chance < 90) {
        return "Clouds";
      } else {
        return "Fog";
      }
    },
    "Coerthas Western Highlands": function (chance) {
      if (chance < 20) {
        return "Blizzards";
      } else if (chance < 60) {
        return "Snow";
      } else if (chance < 70) {
        return "Fair Skies";
      } else if (chance < 75) {
        return "Clear Skies";
      } else if (chance < 90) {
        return "Clouds";
      } else {
        return "Fog";
      }
    },
    "The Sea of Clouds": function (chance) {
      if (chance < 30) {
        return "Clear Skies";
      } else if (chance < 60) {
        return "Fair Skies";
      } else if (chance < 70) {
        return "Clouds";
      } else if (chance < 80) {
        return "Fog";
      } else if (chance < 90) {
        return "Wind";
      } else {
        return "Umbral Wind";
      }
    },
    "Azys Lla": function (chance) {
      if (chance < 35) {
        return "Fair Skies";
      } else if (chance < 70) {
        return "Clouds";
      } else {
        return "Thunder";
      }
    },
    "The Dravanian Forelands": function (chance) {
      if (chance < 10) {
        return "Clouds";
      } else if (chance < 20) {
        return "Fog";
      } else if (chance < 30) {
        return "Thunder";
      } else if (chance < 40) {
        return "Dust Storms";
      } else if (chance < 70) {
        return "Clear Skies";
      } else {
        return "Fair Skies";
      }
    },
    "The Dravanian Hinterlands": function (chance) {
      if (chance < 10) {
        return "Clouds";
      } else if (chance < 20) {
        return "Fog";
      } else if (chance < 30) {
        return "Rain";
      } else if (chance < 40) {
        return "Showers";
      } else if (chance < 70) {
        return "Clear Skies";
      } else {
        return "Fair Skies";
      }
    },
    "The Churning Mists": function (chance) {
      if (chance < 10) {
        return "Clouds";
      } else if (chance < 20) {
        return "Gales";
      } else if (chance < 40) {
        return "Umbral Static";
      } else if (chance < 70) {
        return "Clear Skies";
      } else {
        return "Fair Skies";
      }
    },
    "Idyllshire": function (chance) {
      if (chance < 10) {
        return "Clouds";
      } else if (chance < 20) {
        return "Fog";
      } else if (chance < 30) {
        return "Rain";
      } else if (chance < 40) {
        return "Showers";
      } else if (chance < 70) {
        return "Clear Skies";
      } else {
        return "Fair Skies";
      }
    },
    // Data format changed from aggregate to marginal breakpoints
    "Rhalgr's Reach": function (chance) {
      if ((chance -= 15) < 0) {
        return "Clear Skies";
      } else if ((chance -= 45) < 0) {
        return "Fair Skies";
      } else if ((chance -= 20) < 0) {
        return "Clouds";
      } else if ((chance -= 10) < 0) {
        return "Fog";
      } else {
        return "Thunder";
      }
    },
    "The Fringes": function (chance) {
      if ((chance -= 15) < 0) {
        return "Clear Skies";
      } else if ((chance -= 45) < 0) {
        return "Fair Skies";
      } else if ((chance -= 20) < 0) {
        return "Clouds";
      } else if ((chance -= 10) < 0) {
        return "Fog";
      } else {
        return "Thunder";
      }
    },
    "The Peaks": function (chance) {
      if ((chance -= 10) < 0) {
        return "Clear Skies";
      } else if ((chance -= 50) < 0) {
        return "Fair Skies";
      } else if ((chance -= 15) < 0) {
        return "Clouds";
      } else if ((chance -= 10) < 0) {
        return "Fog";
      } else if ((chance -= 10) < 0) {
        return "Wind";
      } else {
        return "Dust Storms";
      }
    },
    "The Lochs": function (chance) {
      if ((chance -= 20) < 0) {
        return "Clear Skies";
      } else if ((chance -= 40) < 0) {
        return "Fair Skies";
      } else if ((chance -= 20) < 0) {
        return "Clouds";
      } else if ((chance -= 10) < 0) {
        return "Fog";
      } else {
        return "Thunderstorms";
      }
    },
    "Kugane": function (chance) {
      if ((chance -= 10) < 0) {
        return "Rain";
      } else if ((chance -= 10) < 0) {
        return "Fog";
      } else if ((chance -= 20) < 0) {
        return "Clouds";
      } else if ((chance -= 40) < 0) {
        return "Fair Skies";
      } else {
        return "Clear Skies";
      }
    },
    "The Ruby Sea": function (chance) {
      if ((chance -= 10) < 0) {
        return "Thunder";
      } else if ((chance -= 10) < 0) {
        return "Wind";
      } else if ((chance -= 15) < 0) {
        return "Clouds";
      } else if ((chance -= 40) < 0) {
        return "Fair Skies";
      } else {
        return "Clear Skies";
      }
    },
    "Yanxia": function (chance) {
      if ((chance -= 5) < 0) {
        return "Showers";
      } else if ((chance -= 10) < 0) {
        return "Rain";
      } else if ((chance -= 10) < 0) {
        return "Fog";
      } else if ((chance -= 15) < 0) {
        return "Clouds";
      } else if ((chance -= 40) < 0) {
        return "Fair Skies";
      } else {
        return "Clear Skies";
      }
    },
    "The Azim Steppe": function (chance) {
      if ((chance -= 5) < 0) {
        return "Gales";
      } else if ((chance -= 5) < 0) {
        return "Wind";
      } else if ((chance -= 7) < 0) {
        return "Rain";
      } else if ((chance -= 8) < 0) {
        return "Fog";
      } else if ((chance -= 10) < 0) {
        return "Clouds";
      } else if ((chance -= 40) < 0) {
        return "Fair Skies";
      } else {
        return "Clear Skies";
      }
    },
    "Eureka Anemos": function (chance) {
      if ((chance -= 30) < 0) {
        return "Fair Skies";
      } else if ((chance -= 30) < 0) {
        return "Gales";
      } else if ((chance -= 30) < 0) {
        return "Showers";
      } else {
        return "Snow";
      }
    },
    "Eureka Pagos": function (chance) {
      if ((chance -= 10) < 0) {
        return "Clear Skies";
      } else if ((chance -= 18) < 0) {
        return "Fog";
      } else if ((chance -= 18) < 0) {
        return "Heat Waves";
      } else if ((chance -= 18) < 0) {
        return "Snow";
      } else if ((chance -= 18) < 0) {
        return "Thunder";
      } else {
        return "Brizzards";
      }
    },
    "Eureka Pyros": function (chance) {
      if ((chance -= 10) < 0) {
        return "Fair Skies";
      } else if ((chance -= 18) < 0) {
        return "Heat Waves";
      } else if ((chance -= 18) < 0) {
        return "Thunder";
      } else if ((chance -= 18) < 0) {
        return "Blizzards";
      } else if ((chance -= 18) < 0) {
        return "Umbral Wind";
      } else {
        return "Snow";
      }
    },
    "Eureka Hydatos": function (chance) {
      if ((chance -= 12) < 0) {
        return "Fair Skies";
      } else if ((chance -= 22) < 0) {
        return "Showers";
      } else if ((chance -= 22) < 0) {
        return "Gloom";
      } else if ((chance -= 22) < 0) {
        return "Thunderstorms";
      } else {
        return "Snow";
      }
    },
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
    },
    "Amh Araeng": function (chance) {
      if (chance < 45) {
        return "Fair Skies";
      }
      if (chance < 60) {
        return "Clouds";
      }
      if (chance < 70) {
        return "Dust Storms";
      }
      if (chance < 80) {
        return "Heat Waves";
      }
      return "Clear Skies";
    },
    "Eulmore": function (chance) {
      if (chance < 10) {
        return "Gales";
      }
      if (chance < 20) {
        return "Rain";
      }
      if (chance < 30) {
        return "Fog";
      }
      if (chance < 45) {
        return "Clouds";
      }
      if (chance < 85) {
        return "Fair Skies";
      }
      return "Clear Skies";
    },
    "Il Mheg": function (chance) {
      if (chance < 10) {
        return "Rain";
      }
      if (chance < 20) {
        return "Fog";
      }
      if (chance < 35) {
        return "Clouds";
      }
      if (chance < 45) {
        return "Thunderstorms";
      }
      if (chance < 60) {
        return "Clear Skies";
      }
      return "Fair Skies";
    },
    "Kholusia": function (chance) {
      if (chance < 10) {
        return "Gales";
      }
      if (chance < 20) {
        return "Rain";
      }
      if (chance < 30) {
        return "Fog";
      }
      if (chance < 45) {
        return "Clouds";
      }
      if (chance < 85) {
        return "Fair Skies";
      }
      return "Clear Skies";
    },
    "Lakeland": function (chance) {
      if (chance < 20) {
        return "Clear Skies";
      }
      if (chance < 60) {
        return "Fair Skies";
      }
      if (chance < 75) {
        return "Clouds";
      }
      if (chance < 85) {
        return "Fog";
      }
      if (chance < 95) {
        return "Rain";
      }
      return "Thunderstorms";
    },
    "The Crystarium": function (chance) {
      if (chance < 20) {
        return "Clear Skies";
      }
      if (chance < 60) {
        return "Fair Skies";
      }
      if (chance < 75) {
        return "Clouds";
      }
      if (chance < 85) {
        return "Fog";
      }
      if (chance < 95) {
        return "Rain";
      }
      return "Thunderstorms";
    },
    "The Raktika Greatwood": function (chance) {
      if (chance < 10) {
        return "Fog";
      }
      if (chance < 20) {
        return "Rain";
      }
      if (chance < 30) {
        return "Umbral Wind";
      }
      if (chance < 45) {
        return "Clear Skies";
      }
      if (chance < 85) {
        return "Fair Skies";
      }
      return "Clouds";
    },
    "The Tempest": function (chance) {
      if (chance < 20) {
        return "Clouds";
      }
      if (chance < 80) {
        return "Fair Skies";
      }
      return "Clear Skies";
    }
  };

  // https://github.com/violarulan/EorzeaTimeConvert/blob/master/convert.go
  var YEAR = 33177600 * 1000;
  var MONTH = 2764800 * 1000;
  var DAY = 86400 * 1000;
  var HOUR = 3600 * 1000;
  var MINUTE = 60 * 1000;
  var SECOND = 1 * 1000;

  function toEorzeaTime(date) {
    var epoch = Math.floor(DateAndTime.toMillis(date) * 20.571428571428573);
    var year = Math.floor(epoch / YEAR) + 1;
    /* JavaScriptの月は0から始まる */
    var month = Math.floor(epoch / MONTH % 12);
    var day = Math.floor(epoch / DAY % 32) + 1;
    var hours = Math.floor(epoch / HOUR % 24);
    var minutes = Math.floor(epoch / MINUTE % 60);
    var seconds = Math.floor(epoch / SECOND % 60);

    var result = new Date(year % 10000, month, day, hours, minutes, seconds, 0);
    return result;
  }

  function getEorzeaHour(date) {
    return toEorzeaTime(date).getHours();
  }

  function getWeatherTimeFloor(date) {
    var millis = date.getTime();

    var startMillis = Math.floor(millis - millis % (175 * 8 * 1000));

    return new Date(startMillis);
  }

  function calculateForecastTarget(timeMillis) {
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
  }

  function getWeather(date, zone) {
    var timeMillis = DateAndTime.toMillis(date);
    return weatherChances[zone](calculateForecastTarget(timeMillis));
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

  function findChances(maximum, zone, targetWeathers, targetPrevWeathers, startTime, endTime) {
    /* 地球時間をET0,8,16に合わせる (Floor = 下合わせ？) */
    var weatherStartTime = getWeatherTimeFloor(new Date()).getTime();

    var windows = calculateTimeRangePerWindows(startTime, endTime)

    /* 現在の天気 */
    var weather = getWeather(weatherStartTime, zone);
    /* ひとつ前の天気 */
    var prevWeather = getWeather(weatherStartTime - 1, zone);

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
      var windowStartET = getEorzeaHour(weatherStartTime);
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
      prevWeather = weather;
      weather = getWeather(weatherStartTime, zone);
      tries++;
    }

    return result;
  }

  return {
    getWeatherTimeFloor: getWeatherTimeFloor,
    getWeather: getWeather,
    getEorzeaHour: getEorzeaHour,
    toEorzeaTime: toEorzeaTime,
    findChances: findChances
  }
})();