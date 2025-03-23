// fontSizeControl.js

class FontSizeControl {
    constructor() {
      this.fontSizeSelect = null;
      this.editorContent = null;
      this.selectionEventAdded = false;
      this.sizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];
      this.defaultSize = 14;
    }
  
    // Cria o elemento select com as opções de tamanho
    createSelect() {
      this.fontSizeSelect = document.createElement("select");
      this.fontSizeSelect.style.fontSize = "13px";
      this.sizes.forEach((size) => {
        const option = document.createElement("option");
        option.value = size;
        option.text = size;
        this.fontSizeSelect.appendChild(option);
      });
      this.fontSizeSelect.value = this.defaultSize;
    }
  
    // Aplica o tamanho de fonte especificado (em pixels) ao trecho selecionado ou ao elemento onde o cursor estiver
    applyFontSize(fontSize) {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
  
      if (sel.isCollapsed) {
        let node = sel.focusNode;
        if (!node) return;
        if (node.nodeType === Node.TEXT_NODE) {
          node = node.parentNode;
        }
        if (node instanceof Element && node.classList.contains("modified-font")) {
          this.overrideFontSize(node, fontSize);
        }
      } else {
        const range = sel.getRangeAt(0);
        const span = document.createElement("span");
        span.classList.add("modified-font");
        span.style.fontSize = fontSize + "px";
  
        try {
          range.surroundContents(span);
        } catch (e) {
          const content = range.extractContents();
          span.appendChild(content);
          range.insertNode(span);
        }
  
        this.overrideFontSize(span, fontSize);
  
        // Reselecta o conteúdo para permitir ajustes subsequentes
        const newRange = document.createRange();
        newRange.selectNodeContents(span);
        sel.removeAllRanges();
        sel.addRange(newRange);
      }
  
      // Dispara um evento "input" para que o editor registre a alteração e atualize seu modelo interno.
      const inputEvent = new Event("input", { bubbles: true });
      this.editorContent.dispatchEvent(inputEvent);
    }
  
    // Força o tamanho da fonte em um elemento e todos os seus descendentes
    overrideFontSize(element, fontSize) {
      element.style.fontSize = fontSize + "px";
      Array.from(element.children).forEach((child) =>
        this.overrideFontSize(child, fontSize)
      );
    }
  
    // Atualiza o valor do controle (select) conforme a seleção atual
    updateFontSizeSelect() {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0 || !this.editorContent) return;
      if (!this.editorContent.contains(sel.anchorNode)) return;
  
      // Se a seleção estiver colapsada, usamos o elemento onde o cursor está
      if (sel.isCollapsed) {
        let node = sel.focusNode;
        if (!node) return;
        if (node.nodeType === Node.TEXT_NODE) {
          node = node.parentElement;
        }
        if (!node) return;
        const computedSize = window.getComputedStyle(node).fontSize;
        if (computedSize) {
          this.fontSizeSelect.value = parseInt(computedSize, 10).toString();
        }
        return;
      }
  
      // Para seleção não colapsada, pega os elementos dos extremos da seleção
      const range = sel.getRangeAt(0);
      let startElem = range.startContainer;
      let endElem = range.endContainer;
      if (startElem.nodeType === Node.TEXT_NODE) {
        startElem = startElem.parentElement;
      }
      if (endElem.nodeType === Node.TEXT_NODE) {
        endElem = endElem.parentElement;
      }
      if (!startElem || !endElem) return;
      const startSize = parseFloat(window.getComputedStyle(startElem).fontSize);
      const endSize = parseFloat(window.getComputedStyle(endElem).fontSize);
      if (Math.abs(startSize - endSize) < 0.1) {
        this.fontSizeSelect.value = startSize.toString();
      } else {
        this.fontSizeSelect.value = "";
      }
    }
  
    // Adiciona o evento de mudança ao select
    addEventListeners() {
      this.fontSizeSelect.addEventListener("change", () => {
        const newSize = parseInt(this.fontSizeSelect.value, 10);
        this.applyFontSize(newSize);
      });
      // Atualiza o controle sempre que a seleção muda
      document.addEventListener("selectionchange", this.updateFontSizeSelect.bind(this));
    }
  
    // Define o elemento de conteúdo do editor
    setEditorContent(editorContent) {
      this.editorContent = editorContent;
    }
  
    // Retorna o elemento select criado (para usos futuros, se necessário)
    getSelectElement() {
      return this.fontSizeSelect;
    }
  
    // Inicializa a funcionalidade: cria o select e adiciona os event listeners
    init() {
      this.createSelect();
      this.addEventListeners();
    }
  }
  
  