/**
 * コンポーネント：ノート出力・関連ノート設定エリア
 */
let viewNoteArea = Vue.component("viewnote-area", {
  template: `<div class="areaParts">
      <br /><br />
      <div class="separator">
        <p class="ft16px"><b>ノートタイトル ： </b><span>{{ getObject.title }}</span></p>
      </div>
      <div class="separator" v-if="getObject.url.length>0">
        <p class="ft16px"><b>ノートURL ： </b><span>{{ getObject.url }}</span></p>
      </div>
      <div class="separator">
        <p class="ft16px"><b>ノート本文 &#8659;</b></p>
        <div v-for="(line, index) in getObject.textarray">
          <p class="ft16px" v-if="line.length==0">
            <span class="view"><br /></span>
          </p>
          <p class="ft16px" v-else>
            <span class="view">{{ line }}</span>
          </p>
        </div>
      </div>
  </div>`,
  data: function(){
    return {
      getObject: this.object,
    }
  },
  // コンポーネント生成開始時の処理
  created: function () {
    this.init();
  },
  // コンポーネント生成が一通り終了した後の処理
  mounted: function () {

  },
  props: ['object'],
  methods: {
    // 画面初期表示処理
    async init() {
      
    },
  },
});

export default viewNoteArea;
