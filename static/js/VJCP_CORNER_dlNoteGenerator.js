/**
 * コンポーネント：コーナー - DLノートジェネレーター
 */
let dlNoteGenerator = Vue.component("dlnote-generator", {
  template: `<div class="corner">
    <!-- /* ノート入力エリア */ -->
    <div class="fader" v-if="phase==0">
      <h3 align="center">フェーズ１：ノート入力</h3>
      <input-group :type="'1'" :form="'note_input'" @note-data="getNote"></input-group>
    </div>
    <!-- /* 入力ノート出力・補足テキスト入力エリア */ -->
    <div class="fader" v-if="phase==1">
      <h3 align="center">フェーズ２：ノート出力・行別設定</h3>
      <div align="center">
        <br /><input type="button" class="btn btn-primary" value="これで出力する" @click="generateNote">
        <input type="button" class="btn btn-danger" value="やり直す" @click="retry">
      </div>
      <viewnote-area :object="base" @modal-function="openModal"></viewnote-area>
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
    }
  },
  // コンポーネント生成開始時の処理
  created: function () {
    this.init();
  },
  // コンポーネント生成が一通り終了した後の処理
  mounted: function () {

  },
  props: [],
  methods: {
    // 画面初期表示処理
    async init() {

    },
    getNote(form){
      if(form.type=='1'){
        this.phase = 1;
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
    generateNote(){
      const conf = window.confirm("この内容でノートを出力します。よろしいですか？");
      if(conf){
        this.dlform.title = this.base.title;
        this.dlform.url = this.base.url;
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
