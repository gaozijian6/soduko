import { onMounted, onBeforeUnmount } from 'vue';

let highestZIndex = 1;

export function useDraggable(parentRef, sonRef) {
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let initialLeft = 0;
  let initialTop = 0;

  const startDrag = (e) => {
    if (e.target !== sonRef.value) return;
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    initialLeft = parentRef.value.offsetLeft;
    initialTop = parentRef.value.offsetTop;
    highestZIndex += 1;
    parentRef.value.style.zIndex = highestZIndex;
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', stopDrag);
  };

  const onDrag = (e) => {
    if (isDragging) {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      parentRef.value.style.left = `${initialLeft + dx}px`;
      parentRef.value.style.top = `${initialTop + dy}px`;
    }
  };

  const stopDrag = () => {
    isDragging = false;
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', stopDrag);
  };

  onMounted(() => {
    if (parentRef.value && sonRef.value) {
      parentRef.value.style.position = 'absolute';
      sonRef.value.addEventListener('mousedown', startDrag);
    }
  });

  onBeforeUnmount(() => {
    if (sonRef.value) {
      document.removeEventListener('mousemove', onDrag);
      document.removeEventListener('mouseup', stopDrag);
      sonRef.value.removeEventListener('mousedown', startDrag);
    }
  });
}
