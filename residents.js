/* osakana.jsはそのままだと使いづらいので整理 */
var Osakanas = function() {
  /* おさかな名 → おさかな行 */
  var dict = osakanas.reduce(function(dict, osakana) {
    dict[osakana.Fish] = osakana;
    return dict;
  }, {});

  /* 天気は'・'区切り。日本語。''は指定なし */
  function parseWeatherList(weathers) {
    if (weathers === '') {
      return null;
    }

    return weathers.split('・').map(function(weather) {
      return Translation.translate('weather', 'ja', 'en', weather);
    });
  }
  
  
  function formatWeatherTransition(previousWeather, weather) {
    if (previousWeather !== "" && weather !== "") {
      /* 移ろいﾌｨｯｼｭ */
      return previousWeather + " → " + weather;
    } else if (weather !== "") {
      /* 移ろわないﾌｨｯｼｭ */
      return weather;
    } else if (previousWeather !== "") {
      /* 移ろいじゃないけど前天候に依存するﾌｨｯｼｭ。ステタカントゥス、お前のことだ！ */
      return previousWeather + " → なんでも";
    } else {
      return '';
    }
  }

  var csvHookset = {
    'プレシジョン': 'Precision Hookset',
    'ストロング': 'Powerful Hookset',
    '': 'Hook'
  };
  
  function formatTimeSpan(from, to) {
    if (from !== "") {
      return ("0" + from).slice(-2) + ":00-" + ("0" + to).slice(-2) + ":00";
    }
    return '';
  }

  /* おさかな行に整頓されたデータを追加 */
  for (var i = 0; i < osakanas.length; i++) {
    var osakana = osakanas[i];

    var clear = {};
    /* ''は時間指定なし */
    clear.from = osakana.From === '' ? 0 : osakana.From;
    clear.to = osakana.To === '' ? 24 : osakana.To;

    clear.previousWeathers = parseWeatherList(osakana.Previous_Weather);
    clear.weathers = parseWeatherList(osakana.Weather);

    clear.zone = Translation.translate('zone', 'ja', 'en', osakana.Zone);

    clear.hookset = csvHookset[osakana.Hookset];

    osakana.clear = clear;

    osakana.formatted = {
      weather: formatWeatherTransition(osakana.Previous_Weather, osakana.Weather),
      time: formatTimeSpan(osakana.From, osakana.To)
    };
  }

  return {
    list: osakanas,
    dict: dict
  };
}();