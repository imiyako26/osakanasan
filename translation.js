
var Translation = {
  dictionary: {},
  /* 各言語ごとの索引 */
  index: {},
  getIndex: function(what, language) {
    var indexId = what + '-' + language;
    var index = this.index[indexId];
    if (!index) {
      var dict = this.dictionary[what];

      if (!dict) {
        throw new Error(what + 'って何？');
      }

      index = {};
      for (var i = 0; i < dict.length; i++) {
        var entry = dict[i];
        index[entry[language]] = entry;
      }
      this.index[indexId] = index;
    }
    return index;
  },

  translate: function(what, from, to, phrase) {
    var index = this.getIndex(what, from);

    if (!(phrase in index)) {
      throw new Error(phrase + 'は登録されてないよ');
    }

    return index[phrase][to];
  },

  getPhrases: function(what, language) {
    return this.dictionary[what].map(function(entry) {
      return entry[language];
    });
  }
};

/* ========================================================================================== */

Translation.dictionary.zone = [
  {
    "ja": "リムサ・ロミンサ：下甲板層",
    "en": "Limsa Lominsa"
  },
  {
    "ja": "リムサ・ロミンサ：上甲板層",
    "en": "Limsa Lominsa"
  },
  {
    "ja": "中央ラノシア",
    "en": "Middle La Noscea"
  },
  {
    "ja": "低地ラノシア",
    "en": "Lower La Noscea"
  },
  {
    "ja": "東ラノシア",
    "en": "Eastern La Noscea"
  },
  {
    "ja": "西ラノシア",
    "en": "Western La Noscea"
  },
  {
    "ja": "高地ラノシア",
    "en": "Upper La Noscea"
  },
  {
    "ja": "外地ラノシア",
    "en": "Outer La Noscea"
  },
  {
    "ja": "ミスト・ヴィレッジ",
    "en": "Mist"
  },
  {
    "ja": "グリダニア：旧市街",
    "en": "Gridania"
  },
  {
    "ja": "グリダニア：新市街",
    "en": "Gridania"
  },
  {
    "ja": "黒衣森：中央森林",
    "en": "Central Shroud"
  },
  {
    "ja": "黒衣森：東部森林",
    "en": "East Shroud"
  },
  {
    "ja": "黒衣森：南部森林",
    "en": "South Shroud"
  },
  {
    "ja": "黒衣森：北部森林",
    "en": "North Shroud"
  },
  {
    "ja": "ラベンダーベッド",
    "en": "The Lavender Beds"
  },
  {
    "ja": "ウルダハ：ナル回廊",
    "en": "Ul'dah"
  },
  {
    "ja": "西ザナラーン",
    "en": "Western Thanalan"
  },
  {
    "ja": "中央ザナラーン",
    "en": "Central Thanalan"
  },
  {
    "ja": "東ザナラーン",
    "en": "Eastern Thanalan"
  },
  {
    "ja": "南ザナラーン",
    "en": "Southern Thanalan"
  },
  {
    "ja": "北ザナラーン",
    "en": "Northern Thanalan"
  },
  {
    "ja": "ゴブレットビュート",
    "en": "The Goblet"
  },
  {
    "ja": "モードゥナ",
    "en": "Mor Dhona"
  },
  {
    "ja": "イシュガルド：下層",
    "en": "Ishgard"
  },
  {
    "ja": "イシュガルド：上層",
    "en": "Ishgard"
  },
  {
    "ja": "クルザス中央高地",
    "en": "Coerthas Central Highlands"
  },
  {
    "ja": "クルザス西部高地",
    "en": "Coerthas Western Highlands"
  },
  {
    "ja": "アバラシア雲海",
    "en": "The Sea of Clouds"
  },
  {
    "ja": "アジス・ラー",
    "en": "Azys Lla"
  },
  {
    "ja": "高地ドラヴァニア",
    "en": "The Dravanian Forelands"
  },
  {
    "ja": "低地ドラヴァニア",
    "en": "The Dravanian Hinterlands"
  },
  {
    "ja": "ドラヴァニア雲海",
    "en": "The Churning Mists"
  },
  {
    "ja": "イディルシャイア",
    "en": "Idyllshire"
  },
  {
    "ja": "ラールガーズリーチ",
    "en": "Rhalgr's Reach"
  },
  {
    "ja": "ギラバニア辺境地帯",
    "en": "The Fringes"
  },
  {
    "ja": "ギラバニア山岳地帯",
    "en": "The Peaks"
  },
  {
    "ja": "ギラバニア湖畔地帯",
    "en": "The Lochs"
  },
  {
    "ja": "クガネ",
    "en": "Kugane"
  },
  {
    "ja": "シロガネ",
    "en": "Shirogane"
  },
  {
    "ja": "紅玉海",
    "en": "The Ruby Sea"
  },
  {
    "ja": "ヤンサ",
    "en": "Yanxia"
  },
  {
    "ja": "アジムステップ",
    "en": "The Azim Steppe"
  },
  {
    "ja": "クリスタリウム",
    "en": "The Crystarium"
  },
  {
    "ja": "ユールモア",
    "en": "Eulmore"
  },
  {
    "ja": "レイクランド",
    "en": "Lakeland"
  },
  {
    "ja": "コルシア島",
    "en": "Kholusia"
  },
  {
    "ja": "アム・アレーン",
    "en": "Amh Araeng"
  },
  {
    "ja": "イル・メグ",
    "en": "Il Mheg"
  },
  {
    "ja": "ラケティカ大森林",
    "en": "The Raktika Greatwood"
  },
  {
    "ja": "テンペスト",
    "en": "The Tempest"
  }
];

Translation.dictionary.weather = [
  {
    "ja": "晴れ",
    "en": "Fair Skies"
  },
  {
    "ja": "快晴",
    "en": "Clear Skies"
  },
  {
    "ja": "曇り",
    "en": "Clouds"
  },
  {
    "ja": "霧",
    "en": "Fog"
  },
  {
    "ja": "雨",
    "en": "Rain"
  },
  {
    "ja": "風",
    "en": "Wind"
  },
  {
    "ja": "雷",
    "en": "Thunder"
  },
  {
    "ja": "雷雨",
    "en": "Thunderstorms"
  },
  {
    "ja": "暴雨",
    "en": "Showers"
  },
  {
    "ja": "砂塵",
    "en": "Dust Storms"
  },
  {
    "ja": "灼熱波",
    "en": "Heat Waves"
  },
  {
    "ja": "雪",
    "en": "Snow"
  },
  {
    "ja": "吹雪",
    "en": "Blizzards"
  },
  {
    "ja": "妖霧",
    "en": "Gloom"
  },
  {
    "ja": "暴風",
    "en": "Gales"
  },
  {
    "ja": "霊風",
    "en": "Umbral Wind"
  },
  {
    "ja": "放電",
    "en": "Umbral Static"
  }
];

Translation.dictionary.etc = [
  {
    "ja": "プレシジョンフッキング",
    "en": "Precision Hookset"
  },
  {
    "ja": "ストロングフッキング",
    "en": "Powerful Hookset"
  },
  {
    "ja": "フッキング",
    "en": "Hook"
  }
];
