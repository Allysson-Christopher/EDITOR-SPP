// (function () {
//   let fontSizeSelect = null;
//   let editorContent = null;

//   // Função auxiliar para forçar o tamanho da fonte em um elemento e todos os seus descendentes
//   function overrideFontSize(element, fontSize) {
//     element.style.fontSize = fontSize + "px";
//     Array.from(element.children).forEach((child) =>
//       overrideFontSize(child, fontSize)
//     );
//   }

//   // Aplica o tamanho de fonte especificado (em pixels) ao trecho selecionado ou ao elemento onde o cursor estiver
//   function applyFontSize(fontSize) {
//     const sel = window.getSelection();
//     if (!sel || sel.rangeCount === 0) return;

//     if (sel.isCollapsed) {
//       let node = sel.focusNode;
//       if (!node) return;
//       if (node.nodeType === Node.TEXT_NODE) {
//         node = node.parentNode;
//       }
//       if (node instanceof Element && node.classList.contains("modified-font")) {
//         overrideFontSize(node, fontSize);
//       }
//     } else {
//       const range = sel.getRangeAt(0);
//       const span = document.createElement("span");
//       span.classList.add("modified-font");
//       span.style.fontSize = fontSize + "px";

//       try {
//         range.surroundContents(span);
//       } catch (e) {
//         const content = range.extractContents();
//         span.appendChild(content);
//         range.insertNode(span);
//       }

//       overrideFontSize(span, fontSize);

//       // Reselecta o conteúdo para permitir ajustes subsequentes
//       const newRange = document.createRange();
//       newRange.selectNodeContents(span);
//       sel.removeAllRanges();
//       sel.addRange(newRange);
//     }

//     // Dispara um evento "input" para que o editor registre a alteração e atualize seu modelo interno.
//     const inputEvent = new Event("input", { bubbles: true });
//     editorContent.dispatchEvent(inputEvent);
//   }

//   // Atualiza o valor do controle (select) conforme a seleção atual
//   function updateFontSizeSelect() {
//     const sel = window.getSelection();
//     if (!sel || sel.rangeCount === 0 || !editorContent) return;
//     if (!editorContent.contains(sel.anchorNode)) return;

//     // Se a seleção estiver colapsada, usamos o elemento onde o cursor está
//     if (sel.isCollapsed) {
//       let node = sel.focusNode;
//       if (!node) return;
//       if (node.nodeType === Node.TEXT_NODE) {
//         node = node.parentElement;
//       }
//       if (!node) return;
//       const computedSize = window.getComputedStyle(node).fontSize;
//       if (computedSize) {
//         fontSizeSelect.value = parseInt(computedSize, 10).toString();
//       }
//       return;
//     }

//     // Para seleção não colapsada, pega os elementos dos extremos da seleção
//     const range = sel.getRangeAt(0);
//     let startElem = range.startContainer;
//     let endElem = range.endContainer;
//     if (startElem.nodeType === Node.TEXT_NODE) {
//       startElem = startElem.parentElement;
//     }
//     if (endElem.nodeType === Node.TEXT_NODE) {
//       endElem = endElem.parentElement;
//     }
//     if (!startElem || !endElem) return;
//     const startSize = parseFloat(window.getComputedStyle(startElem).fontSize);
//     const endSize = parseFloat(window.getComputedStyle(endElem).fontSize);
//     // Se os tamanhos são praticamente iguais, usamos o tamanho; caso contrário, limpamos o select.
//     if (Math.abs(startSize - endSize) < 0.1) {
//       fontSizeSelect.value = startSize.toString();
//     } else {
//       fontSizeSelect.value = "";
//     }
//   }

//   // Injeta o controle de tamanho de fonte na toolbar do editor
//   function initFontSizeControl() {
//     const toolbar = document.querySelector(".q-editor__toolbar");
//     editorContent = document.querySelector(".q-editor__content");
//     if (!toolbar || !editorContent) return false;

//     if (toolbar.querySelector(".font-size-select")) return true;

//     const container = document.createElement("div");
//     container.classList.add("font-size-select");
//     container.style.display = "inline-flex";
//     container.style.alignItems = "center";
//     container.style.marginLeft = "5px";

//     const label = document.createElement("span");
//     // label.innerHTML = 'Tamanho: ';
//     label.style.fontSize = "10px";
//     container.appendChild(label);

//     fontSizeSelect = document.createElement("select");
//     fontSizeSelect.style.fontSize = "13px";
//     const sizes = [
//       8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72,
//     ];
//     sizes.forEach((size) => {
//       const option = document.createElement("option");
//       option.value = size;
//       option.text = size;
//       fontSizeSelect.appendChild(option);
//     });
//     // Define um valor padrão
//     fontSizeSelect.value = 14;

//     // Ao alterar o select, aplica o tamanho selecionado ao trecho ou elemento
//     fontSizeSelect.addEventListener("change", function () {
//       const newSize = parseInt(this.value, 10);
//       applyFontSize(newSize);
//     });

//     container.appendChild(fontSizeSelect);
//     toolbar.appendChild(container);
//     return true;
//   }

//   // Observer para aguardar que o editor seja inserido no DOM
//   const observer = new MutationObserver((mutations, obs) => {
//     if (initFontSizeControl()) {
//       // Atualiza o controle sempre que a seleção muda
//       document.addEventListener("selectionchange", updateFontSizeSelect);
//     }
//   });

//   observer.observe(document.body, { childList: true, subtree: true });
// })();
