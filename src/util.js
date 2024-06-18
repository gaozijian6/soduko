import { onMounted, onBeforeUnmount } from 'vue';

export function useDraggable(elementRef) {
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let initialLeft = 0;
  let initialTop = 0;

  const startDrag = (e) => {
    if (e.target !== elementRef.value) return;
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    initialLeft = elementRef.value.offsetLeft;
    initialTop = elementRef.value.offsetTop;
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', stopDrag);
  };

  const onDrag = (e) => {
    if (isDragging) {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      elementRef.value.style.left = `${initialLeft + dx}px`;
      elementRef.value.style.top = `${initialTop + dy}px`;
    }
  };

  const stopDrag = () => {
    isDragging = false;
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', stopDrag);
  };

  onMounted(() => {
    elementRef.value.style.position = 'absolute';
    elementRef.value.addEventListener('mousedown', startDrag);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', stopDrag);
    elementRef.value.removeEventListener('mousedown', startDrag);
  });
}
