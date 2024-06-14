<template>
  <div class="emoji-picker" ref="picker">
    <div class="emoji-picker-header">
      <span>经典表情</span>
      <button @click="close">关闭</button>
    </div>
    <div class="emoji-picker-body">
      <span v-for="emoji in emojis" :key="emoji" class="emoji" @click="selectEmoji(emoji)">
        {{ emoji }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  emojiButton: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['select', 'close']);
const picker = ref(null);

const emojis = [
  '😊', '😂', '😍', '😢', '😎', '😜', '😡', '😱', '👍', '👎', '🤔', '🙄', '😏', '😓', '😪', '😴', '😷', '🤒', '🤕',
  '🤑', '🤠', '😇', '🤓', '🤡', '👻', '💀', '👽', '👾', '🤖', '🎃', '😺', '😸', '😹', '😻', '😼', '😽', '🙀',
  '😿', '😾', '🙌', '👏', '🙏', '👌', '👈', '👉', '👆', '👇', '👍', '👎', '👊', '✊', '✌️', '🤞', '🤟', '🤘',
  '🤙', '🖕', '✋', '🤚', '🖐️', '🖖', '👋', '🤙', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '👃', '🧠', '👀', '👁️',
  '👅', '👄', '🧑', '👶', '👧', '🧒', '👦', '👩', '🧑‍🦱', '🧑‍🦲', '🧑‍🦳', '🧑‍🦰', '👩‍🦳', '👩‍🦲', '👨‍🦳', '👨‍🦲',
  '👩‍🦱', '👨‍🦱', '🧓', '👴', '👵', '👮', '🕵️', '💂', '👷', '🤴', '👸', '👳', '👲', '🧕', '🤵', '👰', '🤰',
  '🤱', '👩‍🍼', '🧑‍🍼', '👨‍🍼', '🧙', '🧝', '🧚', '🧛', '🧟', '🧞', '🧜', '🧌', '🧅', '🧄', '🥥', '🍅', '🍆',
  '🥑', '🥦', '🥒', '🌶️', '🥕', '🌽', '🥬', '🥭', '🍍', '🥝', '🍇', '🍉', '🍌', '🍒', '🍓', '🍑', '🍈', '🍏',
  '🍎', '🍐', '🍊', '🍋', '🍍', '🥭', '🍠', '🥔', '🍆', '🥒', '🥬', '🌽', '🥕', '🌶️', '🍄', '🥜', '🌰', '🍞',
  '🥖', '🥨', '🥯', '🥐', '🍞', '🥖', '🥨', '🥯', '🥐', '🍔', '🍟', '🍕', '🌭', '🥪', '🌮', '🌯', '🥙', '🧆',
  '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🍤', '🍙', '🍚', '🍘', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🎂',
  '🍰', '🍪', '🍩', '🍿', '🥤', '🍻', '🥂', '🍾', '🍷', '🍹', '🍸', '🍺', '🍶', '🍵', '🥃', '🍽️', '🍴', '🥄',
];


const selectEmoji = (emoji) => {
  emit('select', emoji);
};

const close = () => {
  emit('close');
};

const handleClickOutside = (event) => {
  if (picker.value && !picker.value.contains(event.target) && props.emojiButton && !props.emojiButton.contains(event.target)) {
    close();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped lang="less">
.emoji-picker {
  position: absolute;
  bottom: 50px;
  left: 0;
  top: 155px;
  width: 300px;
  background: white;
  border: 1px solid #ddd;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  z-index: 1000;
  width: 460px;
  height: 300px;

  .emoji-picker-header {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background: #f5f5f5;
    border-bottom: 1px solid #ddd;
  }

  .emoji-picker-body {
    padding: 10px;
    display: flex;
    flex-wrap: wrap;
    overflow-y: auto;
    width: calc(100% - 20px);
    height: calc(100% - 70px);
  }

  .emoji {
    cursor: pointer;
    padding: 5px;
    margin: 2px;
    font-size: 20px;
    transition: background 0.3s;

    &:hover {
      background: #eee;
    }
  }
}
</style>