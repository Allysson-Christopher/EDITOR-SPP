class FontFamilyControl {
    constructor() {
      this.fontFamilySelect = null;
      this.editorContent = null;
      this.selectionEventAdded = false;
      // Lista de famílias de fonte suportadas – modifique conforme sua necessidade
      this.fonts = [
        "Arial",
        "Verdana",
        "Times New Roman",
        "Courier New",
        "Georgia",
        "Comic Sans MS"
      ];
      this.defaultFont = "Arial";
    }
  
    // Cria o elemento select com as opções de família de fonte
    createSelect() {
      this.fontFamilySelect = document.createElement("select");
      this.fontFamilySelect.style.fontSize = "13px";
      this.fonts.forEach((font) => {
        const option = document.createElement("option");
        option.value = font;
        option.text = font;
        this.fontFamilySelect.appendChild(option);
      });
      this.fontFamilySelect.value = this.defaultFont;
    }
  
    // Aplica a família de fonte especificada ao trecho selecionado ou ao elemento onde o cursor estiver
    applyFontFamily(fontFamily) {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
  
      if (sel.isCollapsed) {
        let node = sel.focusNode;
        if (!node) return;
        if (node.nodeType === Node.TEXT_NODE) {
          node = node.parentNode;
        }
        if (node instanceof Element && node.classList.contains("modified-font-family")) {
          this.overrideFontFamily(node, fontFamily);
        }
      } else {
        const range = sel.getRangeAt(0);
        const span = document.createElement("span");
        span.classList.add("modified-font-family");
        span.style.fontFamily = fontFamily;
  
        try {
          range.surroundContents(span);
        } catch (e) {
          const content = range.extractContents();
          span.appendChild(content);
          range.insertNode(span);
        }
  
        this.overrideFontFamily(span, fontFamily);
  
        // Reselecta o conteúdo para permitir ajustes subsequentes
        const newRange = document.createRange();
        newRange.selectNodeContents(span);
        sel.removeAllRanges();
        sel.addRange(newRange);
      }
  
      // Dispara um evento "input" para que o editor registre a alteração no modelo interno.
      const inputEvent = new Event("input", { bubbles: true });
      this.editorContent.dispatchEvent(inputEvent);
    }
  
    // Força a família de fonte em um elemento e em todos os seus descendentes
    overrideFontFamily(element, fontFamily) {
      element.style.fontFamily = fontFamily;
      Array.from(element.children).forEach((child) =>
        this.overrideFontFamily(child, fontFamily)
      );
    }
  
    // Atualiza o valor do controle (select) conforme a seleção atual
    updateFontFamilySelect() {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0 || !this.editorContent) return;
      if (!this.editorContent.contains(sel.anchorNode)) return;
  
      if (sel.isCollapsed) {
        let node = sel.focusNode;
        if (!node) return;
        if (node.nodeType === Node.TEXT_NODE) {
          node = node.parentElement;
        }
        if (!node) return;
        let computedFamily = window.getComputedStyle(node).fontFamily;
        if (computedFamily) {
          // Remove aspas, se existirem
          computedFamily = computedFamily.replace(/['"]/g, "");
          this.fontFamilySelect.value = computedFamily;
        }
        return;
      }
  
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
      let startFamily = window.getComputedStyle(startElem).fontFamily.replace(/['"]/g, "");
      let endFamily = window.getComputedStyle(endElem).fontFamily.replace(/['"]/g, "");
      if (startFamily === endFamily) {
        this.fontFamilySelect.value = startFamily;
      } else {
        this.fontFamilySelect.value = "";
      }
    }
  
    // Adiciona os event listeners ao controle
    addEventListeners() {
      this.fontFamilySelect.addEventListener("change", () => {
        const newFamily = this.fontFamilySelect.value;
        this.applyFontFamily(newFamily);
      });
      document.addEventListener("selectionchange", this.updateFontFamilySelect.bind(this));
    }
  
    // Define o elemento de conteúdo do editor
    setEditorContent(editorContent) {
      this.editorContent = editorContent;
    }
  
    // Retorna o elemento select criado (para usos futuros)
    getSelectElement() {
      return this.fontFamilySelect;
    }
  
    // Inicializa a funcionalidade: cria o select e adiciona os event listeners
    init() {
      this.createSelect();
      this.addEventListeners();
    }
  }
  
  // Se você usa módulos ES6, pode exportar a classe:
  // export default FontFamilyControl;
  