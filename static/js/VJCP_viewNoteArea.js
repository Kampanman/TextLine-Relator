/**
 * コンポーネント：ノート出力・関連ノート設定エリア
 */
let viewNoteArea = Vue.component("viewnote-area", {
  template: `<div class="areaParts"><br /><br />
      <div class="separator">
        <p class="ft16px"><b>ノートタイトル ： </b><span class="note-title">{{ getObject.title }}</span></p>
      </div>
      <div class="separator" v-if="getObject.url.length>0">
        <p class="ft16px"><b>ノートURL ： </b><span class="note-url">{{ getObject.url }}</span></p>
      </div>
      <div class="separator">
        <table class="note-text">
          <tr>
            <th class="t-8"><p class="ft16px"><b>ノート本文 &#8659;</b></p></th>
            <th class="t-2"><p class="ft16px"><b>関連番号 &#8659;</b></p></th>
          </tr>
          <tr v-for="(line, index) in getObject.textarray">
            <td class="t-8 txtline">
              <p class="ft16px" v-if="line.length==0">
                <span :id="'line_' + (index+1)" class="view"><br /></span>
              </p>
              <p class="ft16px" v-else>
                <input type="button" :id="'add_' + (index+1)" :data-target="'line_' + (index+1)" 
                  class="btn btn-sm line-btn btn-warning str-sm" value="Add-Relator" @click="openModal">
                <input type="button" :id="'on_' + (index+1)" :data-target="'line_' + (index+1)" 
                  class="btn btn-sm line-btn btn-primary str-sm" value="ON" @click="viewal">
                <input type="button" :id="'off_' + (index+1)" :data-target="'line_' + (index+1)" 
                  class="btn btn-sm line-btn btn-secondary str-sm" value="OFF" @click="unviewal">
                <span :id="'line_' + (index+1)" class="view">{{ line }}</span>
              </p>
            </td>
            <td class="t-2">
              <p class="ft16px">
                <span 
                  :id="'rel-line_' + (index+1)" 
                  class="view rel" 
                  :class="(line.length<1) ? 'pass' : ''" 
                  data-text=""
                >--</span><span>&nbsp;</span>
                <input type="button" :id="'cancel_' + (index+1)" :data-target="'rel-line_' + (index+1)" 
                class="btn btn-sm line-btn btn-danger str-sm none" value="Cancel" @click="cancelRelator">
              </p>
            </td>
          </tr>
        </table>
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
      document.getElementById("rel-" + target).classList.remove('unview');
      document.getElementById("rel-" + target).classList.add('view');
      const add_num = target.replace("line_","");
      document.getElementById("add_" + add_num).classList.remove("none");
    },
    unviewal(e) {
      const target = e.target.dataset.target;
      document.getElementById(target).classList.remove('view');
      document.getElementById(target).classList.add('unview');
      document.getElementById("rel-" + target).classList.remove('view');
      document.getElementById("rel-" + target).classList.add('unview');
      const add_num = target.replace("line_","");
      document.getElementById("add_" + add_num).classList.add("none");
    },
    openModal(e) {
      let target = e.target.dataset.target;
      let modaltext = document.getElementById("rel-" + target).dataset.text;
      let line_object = {
        target: target,
        text: modaltext,
      }
      this.$emit('modal-function', line_object);
    },
    cancelRelator(e) {
      e.target.classList.add("none");
      let this_target = e.target.dataset.target;
      document.getElementById(this_target).innerText = "--";
      document.getElementById(this_target).dataset.text = "";
    }
  },
});

export default viewNoteArea;
