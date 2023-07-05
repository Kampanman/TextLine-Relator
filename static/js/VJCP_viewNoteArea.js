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
            <span :id="'line_' + index" class="view"><br /></span>
          </p>
          <p class="ft16px" v-else>
            <input type="button" :id="'add_' + index" :data-target="'line_' + index" 
              class="btn btn-sm line-btn btn-warning str-sm" value="Add-Relator" @click="openModal">
            <input type="button" :id="'on_' + index" :data-target="'line_' + index" 
              class="btn btn-sm line-btn btn-primary str-sm" value="ON" @click="viewal">
            <input type="button" :id="'off_' + index" :data-target="'line_' + index" 
              class="btn btn-sm line-btn btn-secondary str-sm" value="OFF" @click="unviewal">
            <span :id="'line_' + index" class="view">{{ line }}</span>
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
    viewal(e) {
      const target = e.target.dataset.target;
      document.getElementById(target).classList.remove('unview');
      document.getElementById(target).classList.add('view');
    },
    unviewal(e) {
      const target = e.target.dataset.target;
      document.getElementById(target).classList.remove('view');
      document.getElementById(target).classList.add('unview');
    },
    openModal(e) {
      console.log(this.generateToken());
      this.$emit('modal-function');
    },
    generateToken() {
      const addStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                      + "abcdefghijklmnopqrstuvwxyz"
                      + "1234567890";
      let addStr_array = addStr.split('');
      
      let returnStr_array = [];
      for (let i = 0; i < 10; i++){
        let randNum = Math.floor(Math.random() * addStr_array.length);
        returnStr_array.push(addStr_array[randNum]);
      }
      return returnStr_array.join('');
    }
  },
});

export default viewNoteArea;
