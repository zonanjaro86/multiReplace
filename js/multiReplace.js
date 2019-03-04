/*
 * 定数
 */
    const ID_REPLACE_STRINGS = 'replaceStrings';
    const ID_REPLACE_TARGET = 'replaceTarget';
    const ID_BTN_EXECUTE = 'btn_execute';
    const CLS_REPLACE_STRING_BEFORE = 'beforeString';
    const CLS_REPLACE_STRING_AFTER = 'afterString';
    const CLS_REPLACE_TARGET = 'resultWrapper';

/**
 * ページ読み込み後の非同期処理起点
 * 
 * @async
 * @function onReadyPromise
 * @return {Promise}
 */
const onReadyPromise = () => {
    return new Promise((resolve, reject) => {
        const readyState = document.readyState;
        if (readyState === 'interactive' || readyState == 'complete') {
            resolve();
        } else {
            window.addEventListener('DOMContentLoaded', resolve);
        }
    });
};

/**
 * 画面初期表示時にDOMを生成しイベントリスナーを追加する
 * 
 * @function init
 */
const init = () => {
    // HTML要素を作成
    createDom();

    // イベントを追加
    setEvent();
};

/**
 * HTML要素を作成
 * 
 * @function init
 */
const createDom = () => {
    const nodes = [];

    let sec1 = '';
    sec1 += `<section>`;
    sec1 += `<h2>置換文字列</h2>`;
    sec1 += `<ol id="${ID_REPLACE_STRINGS}">`;
    sec1 += `<li><input class="${CLS_REPLACE_STRING_BEFORE}" /><span> ⇒ </span><input class="${CLS_REPLACE_STRING_AFTER}" /></li>`;
    sec1 += `</ol>`;
    sec1 += `</section>`;

    let sec2 = '';
    sec2 += `<section>`;
    sec2 += `<h2>置換対象</h2>`;
    sec2 += `<div id="${ID_REPLACE_TARGET}" class="${CLS_REPLACE_TARGET}">`;
    sec2 += `<textarea id="before"></textarea>`;
    sec2 += `<textarea id="after"></textarea>`;
    sec2 += `</div>`;
    sec2 += `<button id="${ID_BTN_EXECUTE}" type="button" >実行</button>`;
    sec2 += `</section>`;

    nodes.push(htmlToNode(sec1));
    nodes.push(htmlToNode(sec2));
    
    const fragment = document.createDocumentFragment();
    nodes.forEach(node => {
        fragment.appendChild(node);
    });
    document.body.appendChild(fragment);
};

/**
 * イベントを追加
 * 
 * @function setEvent
 */
const setEvent = () => {
    
};

/**
 * HTML文字列をノードへ変換
 * 
 * @function
 * @param {String} htmlStr
 * @return {NodeList}
 */
const htmlToNode = (htmlStr) => {
    if (!htmlStr || typeof htmlStr !== 'string') return;

    // 任意の要素のinnerHTMLとして設定し、firstChildを取り出すことで変換
    // 複数ノードが連結した文字列では2番目以降は無視される
    const tmpElement = document.createElement('div');
    tmpElement.innerHTML = htmlStr;

    return tmpElement.firstChild;
}

onReadyPromise()
.then(init)
.catch((e) => {
    console.error(e);
});