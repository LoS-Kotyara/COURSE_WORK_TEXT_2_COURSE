<template>
  <div class="mainFrame">
    <div
      class="paragraph"
      v-for="(item, index) in textData"
      :key="index"
      :ID="index"
    >
      <div class="lineNumber">{{ index + 1 }}</div>
      <div class="textContainer">
        <div class="backDrop"></div>
        <textarea
          class="dataText-textarea"
          ref="title"
          type="text"
          v-on:keyup.alt.down="goTo(index + 1)"
          v-on:keyup.alt.up="goTo(index - 1)"
          v-on:input="upgrade(index, $event.target.value, $event)"
          v-on:keyup.delete="delOrBackPressed(index, $event)"
          v-bind:value="item"
          @focus="active(index)"
          @blur="inactive(index)"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'mainFrame',
  props: {},
  data() {
    return {};
  },
  computed: {
    textData() {
      return this.$store.getters.getValue;
    },

    strings() {
      return this.$store.getters.getStrings;
    },
  },
  components: {},
  updated() {},
  mounted() {
    this.$store.dispatch('getDict', { el: this });
    this.$refs.title[0].focus();
  },
  methods: {
    active(index) {
      this.$refs.title[index].classList.add('active');
      this.$refs.title[index].parentElement.children[0].classList.add('active');
      this.$refs.title[index].parentElement.classList.add('active');
    },
    inactive(index) {
      this.$refs.title[index].classList.remove('active');
      this.$refs.title[index].parentElement.children[0].classList.remove(
        'active'
      );
      this.$refs.title[index].parentElement.classList.remove('active');
    },
    goTo(index) {
      this.$nextTick(() => {
        let input = this.$refs.title[index];
        input.focus();
      });
    },
    insertNewParagraph(index) {
      this.$store.commit('insertNewParagraph', index);
      this.$nextTick(() => {
        let input = this.$refs.title[index + 1];
        input.focus();
        input.setSelectionRange(0, 0);
        this.$forceUpdate();
      });
    },
    upgrade: function(index, newValue, e) {
      // Если введённый символ является Enter
      if (
        e.inputType == 'insertLineBreak' ||
        (e.inputType == 'insertText' && e.data == null)
      ) {
        this.insertNewParagraph(index);
        this.changeLineNumberWidth();
      }

      // Фильтруем введённые данные
      // Это необходимо в случаях, когда пользователь скопировал большой
      // фрагмент текста в поле ввода
      newValue = newValue.split(/\r?\n/).filter((el) => el);

      // Сохраняем изменённые данные
      if (newValue.length == 0) {
        this.$store.commit('editParagraph', {
          id: index,
          newValue: newValue[0],
        });
      } else {
        for (let i = 0; i < newValue.length; i++) {
          this.$store.commit('editParagraph', {
            id: index + i,
            newValue: newValue[i],
          });
        }
      }

      let element = this.$refs.title[index];

      // Установка минимального размера поля ввода, если произошло удаление строки
      element.style.height = 'auto';

      // Установка размера поля ввода равным размеру скроллбара.
      // Необходимо для автоматического увеличения размера поля
      element.style.height = element.scrollHeight + 'px';

      // element.parentElement.children[0].innerHTML = '<div>asd</div>';

      let separators = this.$store.getters.getSeparators(index);

      let div = this.strings[index].map((word, i) => {
        let suggestions = this.$store.getters.getSuggestions(index, i);

        const spanTemp = `<span title="${suggestions}" onClick="this.parentNode.parentNode.children[1].focus()" style="display: inline-block; z-index: 1; "`;

        let element = spanTemp;
        if (word.correct) element += `class="correct">${word.word}</span>`;
        else {
          element += `class="wrong">${word.word}</span>`;
        }
        if (separators != undefined && i < separators.length) {
          element +=
            spanTemp + `">${separators[i][0].replace(/\s/g, '&nbsp;')}</span>`;
        }
        return element;
      });

      element.parentElement.children[0].innerHTML = div.join('');
    },

    delOrBackPressed(index, e) {
      let selStart = this.$refs.title[index].selectionStart;

      // Если была нажата кнопка backspace или del при пустой строке,
      // То значение строки будет неопределённым, а вместе с ним и значение
      // Длины этой строки. Чтобы обойти эту ситуацию, используется конструкция
      // try..catch
      let dataLength;
      try {
        dataLength = this.$store.getters.getValueLengthById(index);
      } catch {
        dataLength = 0;
      }

      let input, pos;

      if (e.code == 'Delete') {
        // Еcли была нажата del
        if (selStart == dataLength) {
          // Если курсор находится в конце поля ввода
          input = this.$refs.title[index];
          pos = this.$store.getters.getValueLengthById(index);

          const beforeLength = this.$store.getters.getValueLength;
          this.$store.commit('deleteParagraph', index);
          const afterLength = this.$store.getters.getValueLength;

          this.changeLineNumberWidth();

          this.$nextTick(() => {
            if (beforeLength != afterLength) {
              input.focus();
              input.setSelectionRange(pos, pos);
            }
          });
        }
      } else {
        // Если была нажата backspace
        const selStart = this.$refs.title[index].selectionStart;
        if (index > 0 && selStart == 0) {
          // Если курсор находится в начале поля ввода поля ввода и это поле
          // Не является пустым

          input = this.$refs.title[index - 1];
          pos = this.$store.getters.getValueLengthById(index - 1);

          const beforeLength = this.$store.getters.getValueLength;
          this.$store.commit('backspaceParagraph', index);
          const afterLength = this.$store.getters.getValueLength;

          this.changeLineNumberWidth();

          this.$nextTick(() => {
            if (beforeLength != afterLength) {
              input.focus();
              input.setSelectionRange(pos, pos);
            }
          });
        }
      }
    },
    changeLineNumberWidth() {
      this.$nextTick(() => {
        let dataLength = this.$store.getters.getValueLength;
        let length = (dataLength + '').length;

        this.$el.children.forEach((el) => {
          el.style.gridTemplateColumns = `${0.25 + length}rem auto`;
        });
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import './../assets/css/mainframe.less';
@import './../assets/css/paragraph.less';
</style>
