

$(function () {
  /* お知らせトビウオ */
  var tobiVM = new Vue({
    el: '#tobi-container',
    mixins: [DateAndTimeMixin],
    data: {
      message: null,
      timerId: null
    },
    created: function () {
      /* トビウオさんは海の声を拾って表示する */
      Ocean.$on('speak', function (message) {
        tobiVM.speak(message, 5);
      });
    },
    methods: {
      bye: function () {
        this.message = null;
        if (this.timerId !== null) {
          clearTimeout(this.timerId);
          this.timerId = null;
        }
      },
      speak: function (message, seconds) {
        this.message = message;
        if (typeof seconds === 'number') {
          /* n秒後にサヨナラ */
          if (this.timerId !== null) {
            /* 予約されてたらキャンセル */
            clearTimeout(this.timerId);
            this.timerId = null;
          }

          var self = this;
          this.timerId = setTimeout(function () {
            self.bye();
          }, seconds * 1000);
        }
      }
    }
  })

  /* 設定マンボウ */
  var molaVM = new Vue({
    el: '#mola',
    mixins: [DateAndTimeMixin],
    data: {
      Ocean: Ocean,
      open: false
    }
  })

  /* 太陽奴 */
  var sunVM = new Vue({
    el: '#header',
    mixins: [DateAndTimeMixin],
    data: {
      Ocean: Ocean
    },
    computed: {
      /* 過去2個、現在、未来2個の天気 */
      weathers: function () {
        /* 場所が設定されていないときはなし */
        if (!Ocean.where) {
          return [];
        }

        var where = Ocean.where;
        var zone = Translation.translate('zone', 'ja', 'en', where);

        function calculateWindowWheather(millis) {
          var date = new Date(millis);
          var weather = WeatherFinder.getWeather(millis, zone);
          var eorzeaTime = WeatherFinder.toEorzeaTime(millis);
          /* 空白入りはclassに使えないよ */
          var weatherClassName = weather.replace(' ', '_')

          return {
            weather: weather,
            weatherJa: Translation.translate('weather', 'en', 'ja', weather),
            weatherClassName: weatherClassName,
            eorzeaTime: DateAndTime.formatTime(eorzeaTime),
            localTime: DateAndTime.formatTime(date)
          };
        }

        /* 8合わせ */
        var millis = WeatherFinder.getWeatherTimeFloor(Ocean.localTime).getTime()
        return [
          calculateWindowWheather(millis - (175 * 16 * 1000)),
          calculateWindowWheather(millis - (175 * 8 * 1000)),
          calculateWindowWheather(millis),
          calculateWindowWheather(millis + (175 * 8 * 1000)),
          calculateWindowWheather(millis + (175 * 16 * 1000))
        ];
      },
      zones: function () {
        return Translation.getPhrases('zone', 'ja');
      }
    }
  });

  /* 教えて！カニさん */
  var kaniVM = new Vue({
    el: '.senpai',
    mixins: [DateAndTimeMixin],
    data: {
      Translation: Translation,
      Ocean: Ocean
    },
    created: function () {
      /* 作成時とターゲット変更時に起動 */
      this.informBody();
      Ocean.$watch('targetHowTo', this.informBody.bind(this))
    },
    computed: {
      osakana: function () {
        if (!Ocean.targetHowTo) {
          return null;
        }
        return Osakanas.dict[Ocean.targetHowTo];
      }
    },
    methods: {
      informBody: function () {
        if (Ocean.targetHowTo) {
          $(document.body).addClass('senpai-visible');
        } else {
          $(document.body).removeClass('senpai-visible');
        }
      }
    }
  })

  /* お魚予測 (おさかな名　→ 時間Array) */
  var forecasts = {};
  /* おさかなさんリスト */
  var listVM = new Vue({
    el: '.content',
    mixins: [DateAndTimeMixin],
    data: {
      Translation: Translation,
      Ocean: Ocean
    },
    computed: {
      /* リストはソートされてるお魚さんを表示 */
      sortedOsakanas: function () {
        var copy = [];
        for (var i = 0; i < osakanas.length; i++) {
          if (this.shouldList(osakanas[i])) {
            copy.push(osakanas[i]);
          }
        }

        var self = this;
        var factor = Ocean.sortBy;
        copy.sort(function (a, b) {
          var comparison;
          switch (factor) {
            case 'chance1': {
              /* chanceは日付の数値 */
              var chanceA = self.getChance(a, 0);
              var chanceB = self.getChance(b, 0);
              comparison = chanceA - chanceB;
              break;
            }
            case 'chance2': {
              var chanceA = self.getChance(a, 1);
              var chanceB = self.getChance(b, 1);
              comparison = chanceA - chanceB;
              break;
            }
            case 'spot': {
              comparison = a.Spot.localeCompare(b.Spot);
              break;
            }
            case 'zone': {
              comparison = a.Zone.localeCompare(b.Zone);
              break;
            }
            case 'name':
            default:
              comparison = a.Fish.localeCompare(b.Fish)
              break;
          }

          if (Ocean.reversed) {
            comparison = -comparison;
          }
          return comparison;
        });
        return copy;
      },
    },
    created: function () {
      var last_known_scroll_position = 0;
      var ticking = false;

      function doSomething(scroll_pos) {
        // console.log(scroll_pos)
        if (scroll_pos > 10) {
          $(document.body).addClass('scrolled')
        } else {
          $(document.body).removeClass('scrolled')
        }
      }

      window.addEventListener('scroll', function (e) {
        last_known_scroll_position = window.scrollY;

        if (!ticking) {
          window.requestAnimationFrame(function () {
            doSomething(last_known_scroll_position);
            ticking = false;
          });

          ticking = true;
        }
      });
    },
    methods: {
      getOsakanaLink: function (osakana) {
        return 'https://ff14angler.com/fish/' + osakana.Neko;
      },
      checkVersion: function (osakana) {
        if (!osakana.Since)
          return true;
        if (osakana.Since < 3) {
          return Ocean.realmreborn;
        } else if (osakana.Since < 4) {
          return Ocean.heavensward;
        } else if (osakana.Since < 5) {
          return Ocean.stormblood;
        } else if (osakana.Since < 6) {
          return Ocean.shadowbringers;
        } else {
          return true;
        }
      },
      checkGrade: function (osakana) {
        if (osakana.Lord === 'Yes') {
          return Ocean.lord;
        } else {
          return Ocean.zako;
        }
      },
      checkLocation: function (osakana) {
        return !Ocean.where || Ocean.where === osakana.Zone;
      },
      shouldList: function (osakana) {
        return (!Ocean.isCaught(osakana) || !Ocean.caughtFishHidden)
          && this.checkVersion(osakana)
          && this.checkGrade(osakana)
          && this.checkLocation(osakana);
      },
      getChances: function (osakana) {
        /* チャンス計算は一回だけ */
        var chances = forecasts[osakana.Fish];
        if (!chances) {
          var clear = osakana.clear;
          chances = WeatherFinder.findChances(2, clear.zone, clear.weathers, clear.previousWeathers, clear.from, clear.to);
          forecasts[osakana.Fish] = chances;
        }
        return chances;
      },
      getChance: function (osakana, nth) {
        return this.getChances(osakana)[nth];
      },
      getChanceLT: function (osakana, nth) {
        return DateAndTime.formatDateAndTime(this.getChance(osakana, nth));
      },
      getChanceET: function (osakana, nth) {
        return DateAndTime.formatTime(WeatherFinder.toEorzeaTime(this.getChance(osakana, nth)));
      },
      getHooksetClass: function (osakana) {
        if (osakana.Hookset === 'プレシジョン') {
          return 'precision-hookset';
        } else if (osakana.Hookset === 'ストロング') {
          return 'powerful-hookset';
        } else {
          return 'hook';
        }
      },
      changeSortBy: function (sortBy) {
        if (Ocean.sortBy === sortBy) {
          /* 現在の並び替えファクタをクリックしたら順を逆に */
          Ocean.reversed = !Ocean.reversed;
        } else {
          /* 別のソート対象だったら昇順 */
          Ocean.sortBy = sortBy;
          Ocean.reversed = false;
        }
      },
      sortColumnClass: function (sortBy) {
        if (Ocean.sortBy === sortBy) {
          if (Ocean.reversed) {
            return 'sort-column-descending';
          } else {
            return 'sort-column-ascending';
          }
        } else {
          return 'sort-column';
        }
      }
    }
  });

});