/**
 * コンポーネント：ノート入力エリア
 */
let inputGroup = Vue.component("input-group", {
  template: `<div class="areaParts">
    <form :name="formName">
      <div class="separator"><label :for="'#' + formName + '_title'">ノートタイトル</label><input type="text" :id="formName + '_title'" name="title" :placeholder="phword.title"></div>
      <div class="separator"><label :for="'#' + formName + '_url'">URL</label><input type="text" :id="formName + '_url'" name="url" :placeholder="phword.url"></div>
      <div class="separator">
        <label :for="'#' + formName + '_text'">ノート本文</label><br>
        <span class="blacker">&nbsp;</span>
        <textarea :id="formName + '_text'" name="text" rows="5" :placeholder="phword.text" @input="biteCount"></textarea>
        <p align="center">現在の本文総バイト数：{{ currentBite }} バイト</p>
      </div>
      <div :id="formName + '_validMessage'" class="separator" v-for="message in validArray" align="center">
        <span style="color:red;"><b>{{ message }}</b></span><br />
      </div>
      <div v-if="partsType==1" class="separator" align="center">
        <input id="into-session" type="button" class="btn btn-primary" value="セッションにセーブする">
        <input type="button" class="btn btn-secondary" value="セッションを空にする">
      </div>
      <div v-if="partsType==1" class="separator" align="center">
        <input type="button" class="btn btn-primary" value="これで出力する" @click="formFire">
      </div>
      <div v-if="partsType==2" class="separator" align="center">
        <input type="button" class="btn btn-primary" value="タイトルとURLを挿入する">
      </div>
    </form>
  </div>`,
  data: function(){
    return {
      partsType: this.type,
      formName: this.form,
      currentBite: 0,
      headword: "ノートの",
      phword: {
        title: "",
        url: "",
        text: "",
      },
      validArray: [],
    }
  },
  created: function () {
    this.init();
  },
  props: ['type','form'],
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
        let formTextArray = formElem.text.value.split("\n");
        let form = {};
        form.type = this.partsType;
        form.title = formElem.title.value;
        form.url = formElem.url.value;
        form.textarray = formTextArray;
        this.$emit("note-data", form);
      } else {
        this.validArray = this.validForm(formElem).mes_arr;
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
          resObject.mes_arr.push("URR入力欄にはURL形式で入力してください。");
        }
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
  },
});

export default inputGroup;