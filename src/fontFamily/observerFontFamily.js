/**
 * Observador que aguarda a inserção do editor e da toolbar no DOM e, assim que encontrados,
 * injeta o controle de família de fonte na toolbar.
 *
 * @param {string} toolbarSelector - Seletor para o elemento da toolbar (ex.: ".q-editor__toolbar")
 * @param {string} editorContentSelector - Seletor para o elemento de conteúdo editável (ex.: ".q-editor__content")
 */
function initFontFamilyControlObserver(toolbarSelector, editorContentSelector) {
    const fontFamilyControl = new FontFamilyControl();
    fontFamilyControl.init();
  
    const observer = new MutationObserver((mutations, obs) => {
      const toolbar = document.querySelector(toolbarSelector);
      const editorContent = document.querySelector(editorContentSelector);
      if (!toolbar || !editorContent) return;
      if (toolbar.querySelector(".font-family-select")) return;
  
      const container = document.createElement("div");
      container.classList.add("font-family-select");
      container.style.display = "inline-flex";
      container.style.alignItems = "center";
      container.style.marginLeft = "5px";
  
      const label = document.createElement("span");
      label.style.fontSize = "10px";
      // Se desejar um label, descomente a linha abaixo:
      // label.innerHTML = "Fonte: ";
      container.appendChild(label);
  
      container.appendChild(fontFamilyControl.getSelectElement());
      toolbar.appendChild(container);
  
      fontFamilyControl.setEditorContent(editorContent);
    });
  
    observer.observe(document.body, { childList: true, subtree: true });
  }
  
  // Se você usa módulos ES6, pode exportar a função:
  // export { initFontFamilyControlObserver };
  