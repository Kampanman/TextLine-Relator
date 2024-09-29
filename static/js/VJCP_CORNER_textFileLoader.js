/**
 * コンポーネント：コーナー - テキストファイルローダー
 */
let textFileLoader = Vue.component("textfile-loader", {
  template: `<div class="corner fader" align="center">
    <div><br /><br /></div>

    <!-- /* ファイル選択orD&D */ -->
    <label id="selectFileArea" class="btn btn-primary" :class="(loaded==1) ? 'none' : ''" for="selectFile">
      <span class="ft20px">テキストファイルを選択してください</span>
      <div class="none"><input type="file" id="selectFile" @change="selectFile" /></div>
    </label><br />
    <div class="textline ft20px" :class="(loaded==0) ? 'none' : 'fader'" align="left">
      <span id="file_title"><b>ファイルタイトル：</b>{{ loadfile.title }}<br /></span><br />
      <div align="center">
        <form name="searching">
          <div class="searching_inner">
            <label for="searchword" class="exep">検索語： </label>
            <input type="text" name="word" id="searchword" v-model="sWord" :disabled="searched==1">
          </div>
          <div class="searching_inner">
            <input type="button" name="do" class="btn btn-primary" value="検索" @click="doSearching" v-if="searched==0">
            <input 
              type="button" 
              name="do" 
              class="btn btn-primary" 
              value="ジャンプボタン表示" 
              @click="setHitObject" 
              v-if="searched==1" 
              :disabled="jumpable==1"
            >
            <input type="button" name="clear" class="btn btn-secondary" value="クリア" @click="searchClear">
          </div>
        </form><br />
        <div class="searching_inner fader" v-if="searched==1">
          <div id="case_hit" v-if="hitCount>0">
            <b>検索語は {{ hitCount }} 行に含まれていました。</b>
            <div class="fader" v-if="jumpable==1">
              <input 
                type="button" 
                class="btn btn-success" 
                value="検出1件目に移動する" 
                :data-href="hitHref.first" 
                @click="jumphref"
              >
              <input 
                type="button" 
                class="btn btn-success" 
                value="検出最後尾に移動する" 
                :data-href="hitHref.last" 
                v-if="hitHref.last!=''" 
                @click="jumphref"
              >
            </div>
          </div>
          <div id="case_unhit" v-if="hitCount==0">
            <b>検索語はどの行にも含まれていませんでした。</b>
          </div>
        </div>
      </div>
      <b>ファイル内テキスト &#8659;<br /></b><br />
      <span 
        v-for="(line, index) in loadfile.text_array" 
        :id="'line_'+(index+1)" 
        :class="(searched==1 && line.indexOf(sWord)>-1) ? 'hit' : ''"
      >{{ line }}<br /></span>
    </div><br />
  </div>`,

  data: function () {
    return {
      headerObject: {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
      loaded: 0,
      loadfile: {
        title: "",
        text_array: [],
      },
      searched: 0,
      jumpable: 0,
      sWord: "",
      hitCount: 0,
      hitHref: {},
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
    selectFile() {
      // FileListオブジェクト取得
      const selectFiles = document.querySelector("#selectFile").files;
      // Fileオブジェクト取得
      const file = selectFiles[0];
      if(file.name.indexOf(".txt")<0){
        alert("選択されたファイルがテキストファイルではありません。")
      }else{
        // FileReaderオブジェクト取得
        const reader = new FileReader();
        reader.readAsText(file);
        // ファイル読み込み完了時の処理
        reader.onload = () => {
          let text_array = reader.result.split("\n");
          this.loadfile.title = file.name;
          this.loadfile.text_array = text_array;
          this.loaded = 1;
        }
        // ファイル読み込みエラー時の処理
        reader.onerror = () => {
          console.log("ファイル読み込みエラー");
        }
      }
    },
    doSearching() {
      // 検索語が入力されていない場合はアラートを出す
      if (this.sWord == "") {
        alert("検索語が入力されていません。");
      } else {
        this.searched = 1;
        let counter = 0;
        this.loadfile.text_array.forEach((e)=>{
          if(e.indexOf(this.sWord)>-1) counter++;
        });
        this.hitCount = counter;
      }
    },
    searchClear(){
      this.searched = 0;
      this.jumpable = 0;
      this.sWord = "";
      this.hitCount = 0;
    },
    setHitObject(){
      let hitObject = {};
      const hits = document.querySelectorAll(".hit");
      for(let i=0; i<hits.length; i++){
        if(i==0) hitObject.first = hits[i].getAttribute("id");
        if(hits.length>1){
          if(i==(hits.length-1)) hitObject.last = hits[i].getAttribute("id");
        }else{
          hitObject.last = "";
        }
      }
      this.hitHref = hitObject;
      this.jumpable = 1;
    },
    jumphref(e){
      location.href = "#" + e.target.dataset.href;
    }
  },
});

export default textFileLoader;
