/**
 * Observador que aguarda a inserção do editor e da toolbar no DOM e injeta o controle de indent (com botões para indentar e desindentar)
 * na toolbar.
 *
 * @param {string} toolbarSelector - Seletor para a toolbar (ex.: ".q-editor__toolbar")
 * @param {string} editorContentSelector - Seletor para o conteúdo editável (ex.: ".q-editor__content")
 */
function initIndentControlObserver(toolbarSelector, editorContentSelector) {
    const indentControl = new IndentControl();
  
    const observer = new MutationObserver((mutations, obs) => {
      const toolbar = document.querySelector(toolbarSelector);
      const editorContent = document.querySelector(editorContentSelector);
      if (!toolbar || !editorContent) return;
      // Se o controle já estiver injetado, não reinjeta
      if (toolbar.querySelector(".indent-control")) return;
  
      const container = document.createElement("div");
      container.classList.add("indent-control");
      container.style.display = "inline-flex";
      container.style.alignItems = "center";
      container.style.marginLeft = "5px";
  
      indentControl.setEditorContent(editorContent);
      indentControl.init(container);
      toolbar.appendChild(container);
    });
  
    observer.observe(document.body, { childList: true, subtree: true });
  }
  
  // Se estiver utilizando módulos ES6, exporte a classe e a função:
  // export { IndentControl, initIndentControlObserver };
  