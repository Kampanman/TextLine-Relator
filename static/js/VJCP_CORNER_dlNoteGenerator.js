/**
 * コンポーネント：コーナー - DLノートジェネレーター
 */
let dlNoteGenerator = Vue.component("dlnote-generator", {
  template: `<div class="corner">
    <!-- /* ノート入力エリア */ -->
    <div class="fader" v-if="phase==0">
      <h3 align="center">フェーズ１：ノート入力</h3>
      <input-group :type="'1'" :form="'note_input'" @note-data="getNote" @json-data="getJson"></input-group>
    </div>
    <!-- /* 入力ノート出力・補足テキスト入力エリア */ -->
    <div class="fader" v-if="phase==1">
      <h3 align="center">フェーズ２：ノート出力・行別設定</h3>
      <div align="center">
        <br /><input type="button" class="btn btn-primary" value="TXT出力" @click="generateNote">
        <input type="button" class="btn btn-warning" value="JSON出力" @click="generateJSON">
        <input type="button" class="btn btn-danger" value="やり直す" @click="retry">
      </div>
      <viewnote-area v-if="is_json_mode==0" :object="base" @modal-function="openModal"></viewnote-area>
      <viewjson-area v-else :object="parsed" @modal-function="openModal"></viewjson-area>
        <!-- モーダルコンポーネント -->
        <transition-modal :obj="modalObj" @close="closeModal" v-if="modal">
          <!-- default スロットコンテンツ -->
          <input-group :type="'2'" :form="'add_relator'" :txt="modalObj.text" @relator-data="getRelator"></input-group>
          <!-- /default -->
          <!-- footer スロットコンテンツ -->
          <template slot="footer">
            <div align="center">
              <input type="button" class="btn btn-danger" value="閉じる" @click="closeModal">
            </div>
          </template>
          <!-- /footer -->
        </transition-modal>
    </div>
    <!-- /* 最終出力・ダウンロードボタンエリア */ -->
    <div class="fader" v-if="phase==2">
      <h3 align="center">フェーズ３：最終出力・ダウンロード</h3>
      <div align="center">
        <br /><input type="button" class="btn btn-danger" value="やり直す" @click="retry">
        <review-dl :note="dlform" @done-dl="changeCorner"></review-dl>
      </div>
    </div>
  </div>`,

  data: function () {
    return {
      headerObject: {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
      phase: 0,
      base: {
        title: "",
        url: "",
        textarray: "",
      },
      parsed: {},
      modal: false,
      modalObj: {
        target: "",
        text: "",
      },
      dlform: {
        title: "",
        url: "",
        noteArray: [],
      },
      is_json_mode: 0,
    }
  },
  // コンポーネント生成開始時の処理
  created: function () {
    this.init();
  },
  // コンポーネント生成が一通り終了した後の処理
  mounted: function () {
    //
  },
  props: [],
  methods: {
    // 画面初期表示処理
    async init() {
      //
    },
    getNote(form){
      if(form.type=='1'){
        this.phase = 1;
        this.is_json_mode = 0;
        this.base.title = form.title;
        this.base.url = form.url;
        this.base.textarray = form.textarray;
      }
    },
    getRelator(text){
      this.modalObj.text = text;
      let rel_parts = document.getElementById("rel-" + this.modalObj.target);
      rel_parts.dataset.text = this.modalObj.text;
      let this_num = this.modalObj.target.replace("line_","");
      rel_parts.innerText = this.makeRandNums(this_num);
      document.getElementById("cancel_" + this_num).classList.remove("none");
      document.querySelectorAll(".selected").forEach((e) => {
        e.classList.remove("selected");
      });
      this.modal = false;
      setTimeout(()=> alert("関連コンテンツを設定しました。"), 1500);
    },
    getJson(data) {
      if (data.hasOwnProperty("note") && data.note[0].hasOwnProperty("line")) {
        this.parsed = data;
        this.phase = 1;
        this.is_json_mode = 1;
      }
    },
    generateNote(){
      const conf = window.confirm("この内容でノートを出力します。よろしいですか？");
      if(conf){
        this.dlform.title = (this.is_json_mode==0) ? this.base.title : this.parsed.title;
        this.dlform.url = (this.is_json_mode==0) ? this.base.url : this.parsed.url;
        let note_arr = [];
        let rel_flg = 0;
        document.querySelectorAll(".view").forEach((e) => {
          if(!e.classList.contains("pass")){
            if(e.classList.contains("rel")){
              if(e.innerText == '--'){
                note_arr.push('\n');
              }else{
                rel_flg = 1;
                let this_text = " @" + e.innerText + '\n'
                note_arr.push(this_text);
              }
            }else{
              note_arr.push(e.innerText);
            }
          }
        });
        if(rel_flg != 0){
          note_arr.push("\n＝＝＝ ↓ 関連ノート ↓ ＝＝＝\n\n");
          document.querySelectorAll(".rel").forEach((e) => {
            if (e.innerText != '--') {
              let this_text = "【@" + e.innerText + "】\n";
              this_text += e.dataset.text + "\n\n";
              note_arr.push(this_text);
            }
          });
          note_arr.push("＝＝＝ ↑ 関連ノート ↑ ＝＝＝\n");
        }
        this.dlform.noteArray = note_arr;
        this.phase = 2;
        setTimeout(() => alert("ノートを出力しました。"), 1500);
      }
    },
    generateJSON() {
      const conf = window.confirm("一時保存用のJSONファイルを出力します。よろしいですか？");
      if (conf) {
        let object = {};
        let noteTitle = document.getElementsByClassName("note-title")[0].innerText;
        const urlElement = document.getElementsByClassName("note-url");
        let noteUrl = (urlElement.length>0) ? document.getElementsByClassName("note-url")[0].innerText : "";
        object.date = new Date();
        object.title = noteTitle;
        object.url = noteUrl;

        let txtLines = document.getElementsByClassName("txtline");
        object.note = [];
        for (let i = 0; i < txtLines.length; i++){
          let lineText = document.getElementById('line_' + (i + 1)).innerText;
          let relNum = document.getElementById('rel-line_' + (i + 1)).innerText;
          let relText = document.getElementById('rel-line_' + (i + 1)).dataset.text;
          object.note.push({ line:lineText, rel_num:relNum, rel_text:relText });
        }
        let objectJson = JSON.stringify(object);

        try {
          // JSONファイルのダウンロード
          const blob = new Blob([objectJson], { type: 'application/json' });
          const aTag = document.createElement('a');
          aTag.href = URL.createObjectURL(blob);
          aTag.target = '_blank';
          aTag.download = 'savedata-json_' + object.title;
          aTag.click();
          URL.revokeObjectURL(aTag.href);
        } catch (e) {
          console.log(e.message);
        }
      }
    },
    retry(){
      const confirm = window.confirm("画面をリロードします。よろしいですか？");
      if(confirm) location.reload();
    },
    openModal(obj) {
      this.modalReset();
      document.getElementById(obj.target).classList.add("selected");
      this.modalObj.target = obj.target;
      this.modalObj.text = obj.text;
      this.modal = true;
    },
    closeModal() {
      this.modalReset();
      document.querySelectorAll(".selected").forEach((e)=>{
        e.classList.remove("selected");
      });
      this.modal = false;
    },
    modalReset() {
      this.modalObj.target = "";
      this.modalObj.text = "";
    },
    makeRandNums(line_num) {
      let res_numstr = "";
      res_numstr += line_num + "-";
      for(let i=0; i<7; i++){
        let rand_num = Math.floor(Math.random() * 10);
        (i==3) ? res_numstr += "-" : res_numstr += rand_num;
      }

      return res_numstr;
    },
    changeCorner() {
      this.$emit("change-corner",2);
    }
  },
});

export default dlNoteGenerator;
