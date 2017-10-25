function showPreview (text, el) {
    try {
        let mathMl = TeXZilla.toMathML(text);
        el.innerHTML  = "";
        if (!mathMl.textContent.match(/error/)) {
            el.appendChild(mathMl);
        }
    } catch (e) {}
}

function setViewPort() {
    var viewport = document.querySelector("meta[name=viewport]");
    if (!viewport) {
        viewport=document.createElement('meta');
        viewport.name = "viewport";
        document.getElementsByTagName('head')[0].appendChild(viewport);
    }
    viewport.setAttribute('content', 'width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no');
}

function getCaretPosition (node) {
    var range = window.getSelection().getRangeAt(0),
        preCaretRange = range.cloneRange(),
        caretPosition,
        tmp = document.createElement("div");

    preCaretRange.selectNodeContents(node);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    tmp.appendChild(preCaretRange.cloneContents());
    caretPosition = tmp.innerHTML.length;
    return caretPosition;
}

function checkForLatex (text,cursorPosition) {
    var foundExp = null;

    text.replace(/\$\$(.*?)\$\$/g, (match,p1,offset) => {
        let start = offset,
            end = offset + p1.length + 6;

        if (start <= cursorPosition && cursorPosition <= end) {
            foundExp = p1;
        }
    });

    return foundExp;
}

function makeFull(el) {
    var container = document.createElement("div"),
        tool = document.createElement("div"),
        back = document.createElement("div"),
        preview = document.createElement("div"),
        txt = document.createElement("div"),
        tool_height = 38;

    setViewPort();

    container.style.position = "fixed";
    container.style.boxSizing = "border-box";
    container.style.top = "0";
    container.style.left = "0";
    container.style.width = "100%";
    container.style.height = window.innerHeight;
    container.style.background = "white";

    tool.style.boxSizing = "border-box";
    tool.style.background = "#eee";
    tool.style.height = tool_height + "px";
    tool.style.border = "1px solid #ccc";
    tool.style.display = "table";
    tool.style.width = "100%";

    back.innerHTML = "Back";
    back.style.width = "60px";
    back.style.display = "table-cell";
    back.style.margin = "2px";
    back.style.background = "rgb(50, 111, 180)";
    back.style.boxSizing = "border-box";
    back.style.margin = "2px;";
    back.style.color = "white";
    back.style.fontFamily = "sans-serif";
    back.style.textAlign = "center";
    back.style.verticalAlign = "middle";
    back.addEventListener("click", (e) => {
        document.body.removeChild(container);
    });

    preview.style.display = "table-cell";
    preview.style.overflow = "hidden";
    preview.style.height = "20px";
    preview.style.paddingLeft = "5px";
    preview.style.verticalAlign = "middle";

    txt.id = "ag-mobile-editor";
    txt.contentEditable = true;
    txt.innerHTML = el.innerHTML;
    txt.style.boxSizing = "border-box";
    txt.style.fontSize = "16px";
    txt.style.padding = "2px";
    txt.style.width = "100%";
    txt.style.width = "100%";
    txt.style.height = (window.innerHeight-tool_height) + "px";
    txt.addEventListener("input", (e) => {
        el.innerHTML = txt.innerHTML;
    });

    txt.addEventListener("keypress", (e) => {
        let ltx = checkForLatex(txt.innerHTML,getCaretPosition(txt));

        if (ltx) {
            showPreview(ltx,preview);
        } else {
            preview.innerHTML = "";
        }
    });

    tool.appendChild(back);
    tool.appendChild(preview);
    container.appendChild(tool);
    container.appendChild(txt);

    document.body.appendChild(container);
    el.style.postion = "absolute";
    el.style.top = 0;
    el.style.left = 0;
}

setViewPort();

document.addEventListener("focusin", (e) => {
    if (e.target.classList.contains("editor_atto_content")) {
        makeFull(e.target);
    }
});