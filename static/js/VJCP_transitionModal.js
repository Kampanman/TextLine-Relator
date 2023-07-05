/**
 * コンポーネント：モーダル
 */
let transitionModal = Vue.component("transition-modal", {
  template: `<transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="$emit('close')">
      <div class="modal-window">
        <br />
        <div class="modal-content">
          <slot/>
        </div>
        <footer class="modal-footer">
          <slot name="footer">
            <button @click="$emit('close')">Close</button>
          </slot>
        </footer>
      </div>
    </div>
  </transition>`,
  data: function(){
    return {
      
    }
  },
  // コンポーネント生成開始時の処理
  created: function () {
    this.init();
  },
  // コンポーネント生成が一通り終了した後の処理
  mounted: function () {

  },
  methods: {
    // 画面初期表示処理
    async init() {
      
    },
  },
});

export default transitionModal;
