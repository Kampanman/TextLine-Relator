/**
 * コンポーネント：最終出力・ダウンロードエリア
 */
let reviewDlArea = Vue.component("review-dl", {
  template: `<div class="areaParts">
      <br /><br />
      <section class="view_note_area">
        <div class="separator">
          <p class="ft16px"><b>ノートタイトル ： </b><span>{{ reviewTitle }}</span></p>
        </div>
        <div class="separator" v-if="reviewUrl.length>0">
          <p class="ft16px"><b>ノートURL ： </b><span>{{ reviewUrl }}</span></p>
        </div>
        <br /><br />
        <div class="separator">
          <p class="ft16px"><b>ノート本文 &#8659;</b></p>
          <p class="ft16px" v-for="(line, index) in reviewTextArray">
            <span :id="'line_' + index" class="note_line">{{ line }}</span><br />
          </p>
        </div>
      </section>
      <div><input type="button" class="btn btn-primary" value="ダウンロード" @click="doDownload($event)"></div><br />
  </div>`,
  data: function(){
    return {
      reviewTitle: this.note.title,
      reviewUrl: this.note.url,
      reviewTextArray: [],
    }
  },
  // コンポーネント生成開始時の処理
  created: function () {
    this.init();
  },
  // コンポーネント生成が一通り終了した後の処理
  mounted: function () {

  },
  props: ['note'],
  methods: {
    // 画面初期表示処理
    async init() {
      let joinedText = this.note.noteArray.join("");
      this.reviewTextArray = joinedText.split("\n");
    },
    doDownload(event) {
      const dlConfirm = window.confirm("この内容のテキストファイルをダウンロードします。\nよろしいですか？");
      if (dlConfirm) {
        try {
          // ノートのタイトル・URL・本文の値をセット
          let outputText = "";
          if (this.reviewUrl.length < 1) {
            outputText += 'タイトル： ' + this.reviewTitle + '\n\n';
          } else {
            outputText += 'タイトル： ' + this.reviewTitle + '\n';
            outputText += '（URL： ' + this.reviewUrl + '）\n\n';
          }
          outputText += '＝ ノート本文 ＝' + '\n\n';
          outputText += this.reviewTextArray.join("\n") + '\n';
  
          // 出力日時を設定
          let now = new Date();
          outputText += '\n出力日時： '
            + this.getStringFromDate(now).nengappi_str
            + " " + this.getStringFromDate(now).jifunbyou_str;
  
          // テキストファイルのダウンロード
          const blob = new Blob([outputText], { type: 'text/plain' });
          const aTag = document.createElement('a');
          aTag.href = URL.createObjectURL(blob);
          aTag.target = '_blank';
          aTag.download = this.reviewTitle + '_' + this.getStringFromDate(now).datetime_str;
          aTag.click();
          URL.revokeObjectURL(aTag.href);
        } catch (e) {
          console.log(e.message);
        }

        this.$emit("done-dl");
      }
    },
    getStringFromDate(date) {
      let month_num = date.getMonth() + 1;
      let date_num = date.getDate();
      let hour_num = date.getHours();
      let minute_num = date.getMinutes();
      let second_num = date.getSeconds();
      let zero_month = ('0' + month_num).slice(-2);
      let zero_date = ('0' + date_num).slice(-2);
      let zero_hour = ('0' + hour_num).slice(-2);
      let zero_minute = ('0' + minute_num).slice(-2);
      let zero_second = ('0' + second_num).slice(-2);

      return {
        year: date.getFullYear(),
        month: month_num,
        date: date_num,
        hour: hour_num,
        minute: minute_num,
        second: second_num,
        datetime_str: `${date.getFullYear()}${zero_month}${zero_date}_${zero_hour}${zero_minute}${zero_second}`,
        nengappi_str: `${date.getFullYear()}年${month_num}月${date_num}日`,
        jifunbyou_str: `${hour_num}時${minute_num}分${second_num}秒`,
      }
    }
  },
});

export default reviewDlArea;
