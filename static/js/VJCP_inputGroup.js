/**
 * コンポーネント：ノート入力エリア
 */
let inputGroup = Vue.component("input-group", {
  template: `<div class="areaParts">
    <div align="center" v-if="partsType==1"><br />
      <label id="" class="btn btn-warning" for="selectSaveJson">
        <span>savedata-jsonを読み込む</span>
        <div class="none"><input type="file" id="selectSaveJson" @change="selectSaveJson" /></div>
      </label>
    </div>
    <p align="center" v-if="viewSessionMessage"><br /><b>セッションの保存内容を反映しました。</b></p><br>
    <form :name="formName">
      <div class="separator">
        <label :for="formName + '_title'">ノートタイトル <span style="color:red" v-if="partsType==1"><b>&#042;</b></span></label>
        <input type="text" :id="formName + '_title'" name="title" :placeholder="phword.title">
      </div>
      <div class="separator">
        <label :for="formName + '_url'">URL</label>
        <input type="text" :id="formName + '_url'" name="url" :placeholder="phword.url">
      </div>
      <div class="separator">
        <label :for="formName + '_text'">ノート本文 <span style="color:red"><b>&#042;</b></span></label><br>
        <span class="blacker">&nbsp;</span>
        <textarea :id="formName + '_text'" name="text" rows="5" :placeholder="phword.text" @input="biteCount">{{ textareaValue }}</textarea>
        <p align="center">現在の本文総バイト数：{{ currentBite }} バイト</p>
      </div>
      <div :id="formName + '_validMessage'" class="separator" v-for="message in validArray" align="center">
        <span style="color:red;"><b>{{ message }}</b></span><br />
      </div>
      <div v-if="partsType==1" class="separator" align="center">
        <input id="into-session" type="button" class="btn btn-primary" value="セッションにセーブする" @click="saveSession">
        <input type="button" class="btn btn-secondary" value="セッションを空にする" @click="clearSession">
      </div>
      <div v-if="partsType==1" class="separator" align="center">
        <input type="button" class="btn btn-primary" value="これで出力する" @click="formFire">
      </div>
      <div v-if="partsType==2" class="separator" align="center">
        <input type="button" class="btn btn-primary" value="タイトルとURLを本文に追加する" @click="addTitleUrl">
      </div>
      <div v-if="partsType==2" class="separator" align="center">
        <input type="button" class="btn btn-warning" value="関連コンテンツに設定する" @click="setRelator">
      </div>
    </form>
  </div>`,
  data: function(){
    return {
      partsType: this.type,
      formName: this.form,
      textareaValue: this.txt,
      currentBite: 0,
      viewSessionMessage: false,
      headword: "ノートの",
      phword: {
        title: "",
        url: "",
        text: "",
      },
      validArray: [],
    }
  },
  // コンポーネント生成開始時の処理
  created: function () {
    this.init();
  },
  // コンポーネント生成が一通り終了した後の処理
  mounted: function () {
    if (this.partsType == 1) {
      const formElem = document.forms[this.formName];
      if (sessionStorage.getItem('base_title') != null) {
        this.viewSessionMessage = true;
        formElem.title.value = sessionStorage.getItem('base_title');
      }
      if (sessionStorage.getItem('base_url') != null) {
        formElem.url.value = sessionStorage.getItem('base_url');
      }
      if (sessionStorage.getItem('base_text') != null) {
        formElem.text.value = sessionStorage.getItem('base_text');
      }
      this.biteCount();
    }
  },
  props: ['type','form','txt'],
  methods: {
    // 画面初期表示処理
    async init() {
      const tailword = "を入力してください";
      if (this.partsType != 1) this.headword = "関連ノートの";
      this.phword.title = this.headword + "タイトル" + tailword;
      this.phword.url = this.headword + "URL" + tailword;
      this.phword.text = this.headword + "本文" + tailword;
    },
    formFire() {
      this.validArray = [];
      const formElem = document.forms[this.formName];
      if (this.validForm(formElem).res) {
        let result = window.confirm("これで出力します。よろしいですか？");
        if (result) {
          let formTextArray = formElem.text.value.split("\n");
          let form = {};
          form.type = this.partsType;
          form.title = formElem.title.value;
          form.url = formElem.url.value;
          form.textarray = formTextArray;
          this.$emit("note-data", form);
        }
      } else {
        this.validArray = this.validForm(formElem).mes_arr;
      }
    },
    addTitleUrl() {
      this.validArray = [];
      const formElem = document.forms[this.formName];
      if (this.validForm(formElem).res) {
        let result = window.confirm("タイトルとURLを追加します。よろしいですか？");
        if (result) {
          let addText = "";
          addText += "\n - About: " + formElem.title.value;
          if (!this.isEmpty(formElem.url.value)) {
            addText += "\n - URL: " + formElem.url.value;
          }
          formElem.text.value += addText;
        }
      } else {
        this.validArray = this.validForm(formElem).mes_arr;
      }
    },
    setRelator() {
      this.validArray = [];
      const formElem = document.forms[this.formName];
      const relateText = formElem.text.value;

      if (this.validRelatorText(relateText).res) {
        let result = window.confirm("関連コンテンツに設定します。よろしいですか？");
        if (result) this.$emit("relator-data", relateText);
      } else {
        this.validArray = this.validRelatorText(relateText).mes_arr;
      }
    },
    validForm(formElem) {
      let resObject = { res: true, mes_arr: [] };
      
      // ノートタイトルに関する判定
      if (this.isEmpty(formElem.title.value)) {
        resObject.res = false;
        resObject.mes_arr.push("ノートタイトルを入力してください。");
      } else if (this.isOver(formElem.title.value, 100)) {
        resObject.res = false;
        resObject.mes_arr.push("ノートタイトルが100文字を超えています。");
      }
      
      // ノート本文に関する判定
      if (this.isEmpty(formElem.text.value)) {
        resObject.res = false;
        resObject.mes_arr.push("ノート本文を入力してください。");
      }else if(this.biteCount(formElem.text.value) > 65000){
        resObject.res = false;
        resObject.mes_arr.push("ノート本文の文字数が多すぎます。");
      }
      
      // ノートURLに関する判定
      if (!this.isEmpty(formElem.url.value)) {
        const pattern = /^https?:\/\/[\w/:%#\$&\?\(\)~\.=\+\-]+$/
        const isUrl = pattern.test(formElem.url.value);
        if (!isUrl) {
          resObject.res = false;
          resObject.mes_arr.push("URL入力欄にはURL形式で入力してください。");
        }
      }
      
      return resObject;
    },
    validRelatorText(val) {
      let resObject = { res: true, mes_arr: [] };
      if (this.isEmpty(val)) {
        resObject.res = false;
        resObject.mes_arr.push("ノート本文を入力してください。");
      }else if(this.biteCount(val) > 65000){
        resObject.res = false;
        resObject.mes_arr.push("ノート本文の文字数が多すぎます。");
      }

      return resObject;
    },
    isEmpty(str) {
      let res = false;
      if (str.length < 1) res = true;
      return res;
    },
    isOver(str, len) {
      let res = false;
      if (str.length > len) res = true;
      return res;
    },
    biteCount() {
      const formElem = document.forms[this.formName];
      let number_bytes = encodeURI(formElem.text.value).replace(/%../g, "*").length;
      this.currentBite = number_bytes;
      return number_bytes;
    },
    saveSession() {
      const formElem = document.forms[this.formName];
      this.validArray = [];
      if (this.validForm(formElem).res) {
        let result = window.confirm("入力内容をセッションに登録します。よろしいですか？");
        if (result) {
          sessionStorage.clear();
          sessionStorage.setItem('base_title', formElem.title.value);
          sessionStorage.setItem('base_url', formElem.url.value);
          sessionStorage.setItem('base_text', formElem.text.value);
          setTimeout(() => alert("セッションに登録しました。"), 1000);
        }
      } else {
        this.validArray = this.validForm(formElem).mes_arr;
      }
    },
    clearSession() {
      const confirmMessage = "セッションの登録内容を消去します。よろしいですか？\n（消去後に画面をリロードします）";
      let result = window.confirm(confirmMessage);
      if (result) {
        sessionStorage.clear();
        setTimeout(function () {
          alert("セッションの登録内容を消去しました。");
          location.reload();
        }, 1000);
      }
    },
    selectSaveJson() {
      // FileListオブジェクト取得
      const selectFiles = document.querySelector("#selectSaveJson").files;
      // Fileオブジェクト取得
      const file = selectFiles[0];
      if(file.name.indexOf(".json")<0){
        alert("選択されたファイルがJSONファイルではありません。")
      }else{
        // FileReaderオブジェクト取得
        const reader = new FileReader();
        reader.readAsText(file);

        // ファイル読み込み完了時の処理
        reader.onload = () => {
          let savedData = JSON.parse(reader.result);
          this.$emit("json-data", savedData);
        }

        // ファイル読み込みエラー時の処理
        reader.onerror = () => {
          alert("ファイルの読み込みに失敗しました。");
        }
      }
    },
  },
});

export default inputGroup;