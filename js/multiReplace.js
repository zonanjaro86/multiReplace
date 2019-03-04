/*
 * 定数
 */
    const ID_REPLACE_STRINGS = 'replaceStrings';
    const ID_REPLACE_TARGET = 'replaceTarget';
    const ID_REPLACE_RESULT = 'replaceResult';
    const ID_BTN_ADDROW = 'btn_addRow';
    const ID_BTN_EXECUTE = 'btn_execute';
    const CLS_REPLACE_STRING_BEFORE = 'beforeString';
    const CLS_REPLACE_STRING_AFTER = 'afterString';
    const CLS_REPLACE_TARGET_WRAPPER = 'resultWrapper';

    const NODE_INPUT_ROW = `<li><input name="${CLS_REPLACE_STRING_BEFORE}" /><span> ⇒ </span><input name="${CLS_REPLACE_STRING_AFTER}" /></li>`;

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
    sec1 += `<button id="${ID_BTN_ADDROW}" type="button">行追加</button>`;
    sec1 += `<ol id="${ID_REPLACE_STRINGS}">`;
    sec1 += NODE_INPUT_ROW;
    sec1 += `</ol>`;
    sec1 += `</section>`;
    nodes.push(htmlToNode(sec1));

    let sec2 = '';
    sec2 += `<section>`;
    sec2 += `<h2>置換対象</h2>`;
    sec2 += `<div id="" class="${CLS_REPLACE_TARGET_WRAPPER}">`;
    sec2 += `<textarea id="${ID_REPLACE_TARGET}"></textarea>`;
    sec2 += `<textarea id="${ID_REPLACE_RESULT}"></textarea>`;
    sec2 += `</div>`;
    sec2 += `<button id="${ID_BTN_EXECUTE}" type="button" >実行</button>`;
    sec2 += `</section>`;
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
    // 行追加ボタンイベント
    const btn_addRow = document.getElementById(ID_BTN_ADDROW);
    if (btn_addRow) {
        btn_addRow.addEventListener('click', addInputRow);
    }

    // 実行ボタンイベント
    const btn_execute = document.getElementById(ID_BTN_EXECUTE);
    if (btn_execute) {
        btn_execute.addEventListener('click', executeMultiReplace);
    }
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

/**
 * 置換文字列入力行を1行追加
 */
const addInputRow = () => {
    const ol = document.getElementById(ID_REPLACE_STRINGS);
    if (ol) {
        ol.appendChild(htmlToNode(NODE_INPUT_ROW));
    }
};

/**
 * 置換実行処理
 */
const executeMultiReplace = () => {
    // 置換対象を取得
    const targetStr = (() => {
        const replaceTarget = document.getElementById(ID_REPLACE_TARGET);
        if (replaceTarget && replaceTarget.value) {
            return replaceTarget.value;
        } else {
            return '';
        }
    })();

    // 置換文字列を取得
    const replaceStrings = (() => {
        let replaceStrings = [];
        const lists = document.getElementById(ID_REPLACE_STRINGS).children;
        for (const elem of lists) {
            if (elem && elem.children) {
                const before = elem.children.namedItem(CLS_REPLACE_STRING_BEFORE);
                const after = elem.children.namedItem(CLS_REPLACE_STRING_AFTER);
                if (before !== 'undefined' && after !== 'undefined') {
                    replaceStrings.push({before:before.value, after:after.value});
                }
            }
        }
        return replaceStrings;
    })();
    
    // 置換実行
    const result = multiReplace(targetStr, replaceStrings);

    // 置換結果を画面へ反映
    const replaceResult = document.getElementById(ID_REPLACE_RESULT);
    if (replaceResult) {
        replaceResult.value = result;
    }
}

/**
 * 複数文字列について置換する
 * 
 * @param {string} targetStr 
 * @param {Object[]} replaceStrings
 * @param {string} replaceStrings[].before
 * @param {string} replaceStrings[].after
 * @return {string}
 */
export const multiReplace = (targetStr, replaceStrings) => {
    let result = targetStr;
    replaceStrings.forEach(replaceString => {
        result = result.split(replaceString.before).join(replaceString.after);
    });
    return result;
};

onReadyPromise()
.then(init)
.catch((e) => {
    console.error(e);
});