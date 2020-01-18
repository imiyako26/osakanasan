

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBJ9OrjsQu8NfM6fV1tc0QQhJo0SDiLJZk",
  authDomain: "osakana-f32c3.firebaseapp.com",
  databaseURL: "https://osakana-f32c3.firebaseio.com",
  projectId: "osakana-f32c3",
  storageBucket: "osakana-f32c3.appspot.com",
  messagingSenderId: "999992537612",
  appId: "1:999992537612:web:de016927f80d6b5fff7429",
  measurementId: "G-KZKN68346M"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
db = firebase.firestore();


function undefinedTo(value, defaultValue) {
  if (typeof value === 'undefined') {
    return defaultValue;
  }
  return value;
}

/* dataをlocalStorageに保存するmixinを作成する */
var Synchronized = {
  booleanData: function (dataName, storageName, defaultValue) {
    var data = {};
    var watch = {};
    var storedValue = localStorage.getItem(storageName);
    data[dataName] = storedValue === null ? defaultValue : storedValue === 'Yes';
    watch[dataName] = function (newValue) {
      localStorage.setItem(storageName, newValue ? 'Yes' : 'No');
    }

    return {
      data: data,
      watch: watch
    };
  },
  stringData: function (dataName, storageName, defaultValue) {
    var data = {};
    var watch = {};
    var storedValue = localStorage.getItem(storageName);
    data[dataName] = storedValue === null ? defaultValue : storedValue;
    watch[dataName] = function (newValue) {
      if (newValue === null) {
        localStorage.removeItem(storageName);
      } else {
        localStorage.setItem(storageName, newValue);
      }
    }
    return {
      data: data,
      watch: watch
    }
  }
};

/* 全てを知る透明な海。実体はない。*/
var Ocean = new Vue({
  mixins: [
    /* いつのフィッシュに用がある？ */
    Synchronized.booleanData('realmreborn', 'realmreborn', true),
    Synchronized.booleanData('heavensward', 'heavensward', true),
    Synchronized.booleanData('stormblood', 'stormblood', true),
    Synchronized.booleanData('shadowbringers', 'shadowbringers', true),
    /* ヌシ・雑魚を表示する？ */
    Synchronized.booleanData('lord', 'lord', true),
    Synchronized.booleanData('zako', 'zako', false),
    /* 釣れた魚に用はない */
    Synchronized.booleanData('caughtFishHidden', 'caughtFishHidden', false),
    /* どこいるの */
    Synchronized.stringData('where', 'where', null),
    /* Cloudに保存する名前 */
    Synchronized.stringData('character', 'character', null),
    Synchronized.stringData('world', 'world', null),
    /* カニさんのターゲット */
    Synchronized.stringData('targetHowTo', 'targetHowTo', null),
    /* 一覧のソート */
    Synchronized.stringData('sortBy', 'sortBy', 'name'),
    Synchronized.booleanData('reversed', 'reversed', false)
  ],
  data: function() {

    var results = {};
    for (var i = 0; i < osakanas.length; i++) {
      var osakana = osakanas[i];
      results[osakana.Fish] = localStorage.getItem(osakana.Fish) === 'Yes';
    }
    
    return {
      results: results,
      localTime: new Date()
    }
  },
  computed: {
    hasCloudId: function () {
      return this.character && this.world;
    },
    cloudId: function () {
      return this.character + '@' + this.world;
    },
    eorzeaTime: function () {
      return WeatherFinder.toEorzeaTime(this.localTime.getTime());
    }
  },
  created: function () {
    /* 3秒毎に更新だよ */
    var self = this;
    setInterval(function () {
      self.localTime = new Date();
    }, 3000);
  },
  methods: {
    /* お知らせ。海には口がないので声を誰かが拾ってくれるのを待つ */
    doSpeak: function (message) {
      this.$emit('speak', message);
    },
    /* おさかな捕まえた！isCaughtがない場合は入れ替え */
    doCatch: function (osakana, isCaught) {
      if (typeof isCaught === 'undefined') {
        isCaught = !this.results[osakana.Fish];
      }
      this.results[osakana.Fish] = isCaught;
      if (isCaught) {
        localStorage.setItem(osakana.Fish, 'Yes');
      } else {
        localStorage.removeItem(osakana.Fish);
      }
    },
    /* 釣れてる？ */
    isCaught: function(osakana) {
      return this.results[osakana.Fish];
    },
    /* 現在の情報からosakana.jsonを作成 */
    toOsakanaJSON: function () {
      /* undefinedは保存できない */
      var json = {};

      var list = {};
      list['sortBy'] = undefinedTo(this.sortBy, null);
      list['reversed'] = this.reversed;
      json['list'] = list;

      var kani = {};
      kani['targetHowTo'] = undefinedTo(this.targetHowTo, null);
      json['kani'] = kani;

      var mola = {};
      mola['realmreborn'] = this.realmreborn;
      mola['heavensward'] = this.heavensward;
      mola['stormblood'] = this.stormblood;
      mola['shadowbringers'] = this.shadowbringers;
      mola['lord'] = this.lord;
      mola['zako'] = this.zako;
      mola['caughtFishHidden'] = this.caughtFishHidden;
      mola['where'] = this.where;
      json['mola'] = mola;

      var fish = {};
      for (var i = 0; i < osakanas.length; i++) {
        var osakana = osakanas[i];
        fish[osakana.Fish] = this.results[osakana.Fish];
      }
      json['catch'] = fish;

      return json;
    },
    /* osakana.jsonから復元だ */
    fromOsakanaJSON: function (json) {
      var list = undefinedTo(json.list, {});
      this.sortBy = undefinedTo(list.sortBy, null);
      this.reversed = undefinedTo(list.reversed, false);

      var kani = undefinedTo(json.kani, {});
      this.targetHowTo = undefinedTo(kani.targetHowTo, null);

      var mola = undefinedTo(json.mola, {});
      this.realmreborn = undefinedTo(mola.realmreborn, true);
      this.heavensward = undefinedTo(mola.heavensward, true);
      this.stormblood = undefinedTo(mola.stormblood, true);
      this.shadowbringers = undefinedTo(mola.shadowbringers, true);
      this.lord = undefinedTo(mola.lord, true);
      this.zako = undefinedTo(mola.zako, false);
      this.where = undefinedTo(mola.where, '');
      this.caughtFishHidden = undefinedTo(mola.caughtFishHidden, false);

      var fish = undefinedTo(json['catch'], {});
      for (var osakanaName in fish) {
        var osakana = Osakanas.dict[osakanaName];

        if (osakana) {
          this.doCatch(osakana, fish[osakanaName]);
        }
      }
    },
    /* Cloudに保存 */
    upload: function () {
      var self = this;

      if (!this.hasCloudId) {
        /* キャラ名がなかったらなにもしないよ */
        self.doSpeak('キャラ名とワールドを教えて', 5);
        return;
      }

      var doc = db.collection('anglers').doc(this.cloudId);
      doc.set(this.toOsakanaJSON())
        .then(function () {
          self.doSpeak('保存したよ');
        })
        .catch(function (error) {
          console.error(error);
          self.doSpeak('保存できなかったよ');
        });
    },
    /* Cloudから取得 */
    download: function () {
      var self = this;
      if (!this.hasCloudId) {
        self.doSpeak('キャラ名とワールドを教えて', 5);
        return;
      }

      var doc = db.collection('anglers').doc(this.cloudId);
      doc.get()
        .then(function (meta) {
          if (!meta.exists) {
            self.doSpeak('保存されてないよ');
          } else {
            self.fromOsakanaJSON(meta.data());
            self.doSpeak('読み込んだよ');
          }
        })
        .catch(function (error) {
          console.error(error);
          self.doSpeak('なんか失敗した');
        });
    },
  }
});
