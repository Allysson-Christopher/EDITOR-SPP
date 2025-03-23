/**
   * Observador que aguarda a inserção do editor e da toolbar no DOM e, assim que encontrados,
   * injeta o controle de tamanho de fonte na toolbar.
   *
   * @param {string} toolbarSelector - Seletor para o elemento da toolbar (ex.: ".q-editor__toolbar")
   * @param {string} editorContentSelector - Seletor para o elemento de conteúdo editável (ex.: ".q-editor__content")
   */
function initFontSizeControlObserver(toolbarSelector, editorContentSelector) {
    const fontSizeControl = new FontSizeControl();
    fontSizeControl.init();
  
    const observer = new MutationObserver((mutations, obs) => {
      const toolbar = document.querySelector(toolbarSelector);
      const editorContent = document.querySelector(editorContentSelector);
      if (!toolbar || !editorContent) return;
      if (toolbar.querySelector(".font-size-select")) return;
  
      const container = document.createElement("div");
      container.classList.add("font-size-select");
      container.style.display = "inline-flex";
      container.style.alignItems = "center";
      container.style.marginLeft = "5px";
  
      const label = document.createElement("span");
      label.style.fontSize = "10px";
      // Se desejar um label, basta descomentar a linha abaixo:
      // label.innerHTML = "Tamanho: ";
      container.appendChild(label);
  
      container.appendChild(fontSizeControl.getSelectElement());
      toolbar.appendChild(container);
  
      fontSizeControl.setEditorContent(editorContent);
    });
  
    observer.observe(document.body, { childList: true, subtree: true });
  }
  
  // Se estiver utilizando módulos ES6, exporte as funções necessárias:
  