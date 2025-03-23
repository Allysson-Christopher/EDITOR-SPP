class IndentControl {
  constructor() {
    this.indentButton = null;
    this.outdentButton = null;
    this.editorContent = null;
    // Incremento (ou decremento) em pixels para cada clique
    this.indentStep = 50;
  }

  // Cria os botões de indent e outdent com seus respectivos ícones
  createButtons() {
    // Botão para aumentar o recuo (indent)
    this.indentButton = document.createElement("button");
    this.indentButton.innerHTML =
      '<i class="material-icons" style="font-size:18px;">format_indent_increase</i>';
    this.indentButton.style.border = "none";
    this.indentButton.style.background = "none";
    this.indentButton.style.cursor = "pointer";
    this.indentButton.title = "Indentar Parágrafo";

    // Botão para diminuir o recuo (outdent)
    this.outdentButton = document.createElement("button");
    this.outdentButton.innerHTML =
      '<i class="material-icons" style="font-size:18px;">format_indent_decrease</i>';
    this.outdentButton.style.border = "none";
    this.outdentButton.style.background = "none";
    this.outdentButton.style.cursor = "pointer";
    this.outdentButton.title = "Desindentar Parágrafo";
  }

  // Aplica o recuo usando padding-left para preservar o alinhamento
  applyIndent() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || !this.editorContent) return;
    if (!this.editorContent.contains(sel.anchorNode)) return;

    let node = sel.focusNode;
    if (!node) return;
    if (node.nodeType === Node.TEXT_NODE) {
      node = node.parentElement;
    }
    const block = node.closest("p, div, li, pre");
    if (!block) return;

    // Salva o alinhamento atual do bloco
    const computedAlignment = window.getComputedStyle(block).textAlign;

    let currentPadding = parseFloat(window.getComputedStyle(block).paddingLeft) || 0;
    const newPadding = currentPadding + this.indentStep;
    block.style.paddingLeft = newPadding + "px";

    // Se o bloco estiver justificado, reforce o alinhamento justificado
    if (computedAlignment === "justify") {
      block.style.textAlign = "justify";
    }

    const inputEvent = new Event("input", { bubbles: true });
    this.editorContent.dispatchEvent(inputEvent);
  }

  // Diminui o recuo usando padding-left, sem ir abaixo de 0px, e preserva o alinhamento justificado se for o caso
  applyOutdent() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || !this.editorContent) return;
    if (!this.editorContent.contains(sel.anchorNode)) return;

    let node = sel.focusNode;
    if (!node) return;
    if (node.nodeType === Node.TEXT_NODE) {
      node = node.parentElement;
    }
    const block = node.closest("p, div, li, pre");
    if (!block) return;

    const computedAlignment = window.getComputedStyle(block).textAlign;

    let currentPadding = parseFloat(window.getComputedStyle(block).paddingLeft) || 0;
    let newPadding = currentPadding - this.indentStep;
    if (newPadding < 0) newPadding = 0;
    block.style.paddingLeft = newPadding + "px";

    if (computedAlignment === "justify") {
      block.style.textAlign = "justify";
    }

    const inputEvent = new Event("input", { bubbles: true });
    this.editorContent.dispatchEvent(inputEvent);
  }

  // Insere os botões em um container fornecido
  createControl(container) {
    this.createButtons();
    container.appendChild(this.indentButton);
    container.appendChild(this.outdentButton);
  }

  // Adiciona os event listeners aos botões
  addEventListeners() {
    this.indentButton.addEventListener("click", (e) => {
      e.preventDefault();
      this.applyIndent();
    });
    this.outdentButton.addEventListener("click", (e) => {
      e.preventDefault();
      this.applyOutdent();
    });
  }

  // Inicializa a funcionalidade: cria os botões, adiciona os listeners e injeta o controle no container
  init(container) {
    this.createControl(container);
    this.addEventListeners();
  }

  // Define o elemento de conteúdo do editor (contentEditable)
  setEditorContent(editorContent) {
    this.editorContent = editorContent;
  }
}

