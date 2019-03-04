/*
 * 定数
 */
    const ID_CHK_USE_REGEXP          = 'useRegExp';
    const ID_CHK_CASE_SENSITIVE      = 'caseSensitive';
    const ID_CHK_MULTILINE           = 'multiList';
    const ID_REPLACE_STRINGS         = 'replaceStrings';
    const ID_REPLACE_TARGET          = 'replaceTarget';
    const ID_REPLACE_RESULT          = 'replaceResult';
    const ID_BTN_ADDROW              = 'btn_addRow';
    const ID_BTN_EXECUTE             = 'btn_execute';
    const CLS_REPLACE_STRING_BEFORE  = 'beforeString';
    const CLS_REPLACE_STRING_AFTER   = 'afterString';
    const CLS_REPLACE_TARGET_WRAPPER = 'resultWrapper';
    const CLS_BTN_DEL                = 'btn_del';

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

    let sec1 = ''
    + `<fieldSet>`
        + `<legend>Setting</legend>`
        + `<input id="${ID_CHK_USE_REGEXP}" type="checkbox" checked><label for="${ID_CHK_USE_REGEXP}">Use regexp </label>`
        + `<input id="${ID_CHK_CASE_SENSITIVE}" type="checkbox"><label for="${ID_CHK_CASE_SENSITIVE}">Case sensitive </label>`
        + `<input id="${ID_CHK_MULTILINE}" type="checkbox"><label for="${ID_CHK_MULTILINE}">Multi line(β) </label>`
    + `</fieldSet>`;
    nodes.push(htmlToNode(sec1));

    let sec2 = ''
    + `<fieldSet>`
        + `<legend>Replace Strings</legend>`
        + `<button id="${ID_BTN_ADDROW}" type="button">Add row</button>`
        + `<ol id="${ID_REPLACE_STRINGS}">`
            + NODE_INPUT_ROW
        + `</ol>`
    + `</fieldSet>`;
    nodes.push(htmlToNode(sec2));

    let sec3 = ''
    + `<section>`
        + `<div id="" class="${CLS_REPLACE_TARGET_WRAPPER}">`
            + `<div>Before<textarea id="${ID_REPLACE_TARGET}"         ></textarea></div>`
            + `<div>After <textarea id="${ID_REPLACE_RESULT}" readonly></textarea></div>`
        + `</div>`
        + `<button id="${ID_BTN_EXECUTE}" type="button" >execute</button>`
    + `</section>`;
    nodes.push(htmlToNode(sec3));
    
    const fragment = document.createDocumentFragment();
    nodes.forEach(node => {
        fragment.appendChild(node);
    });
    document.body.appendChild(fragment);

    // 初期表示時に4列表示する
    [2,3,4].forEach(addInputRow);
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
 * @function htmlToNode
 * @param {String} htmlStr
 * @return {Node}
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
 * 
 * @function addInputRow
 */
const addInputRow = () => {
    const ol = document.getElementById(ID_REPLACE_STRINGS);
    if (ol) {
        const newRow = htmlToNode(NODE_INPUT_ROW);
        const delButton = htmlToNode(`<button class="${CLS_BTN_DEL}" style="margin-left:.5em;" tabIndex="-1">del</button>`);
        delButton.addEventListener('click', delInputRow);
        newRow.appendChild(delButton);
        ol.appendChild(newRow);
    }
};

const delInputRow = (e) => {
    const delElm = e.target.parentNode;
    delElm.parentNode.removeChild(delElm);
}

/**
 * 置換実行処理
 * 
 * @function executeMultiReplace
 */
const executeMultiReplace = () => {
    // 設定を取得
    const useRegExp       = document.getElementById(ID_CHK_USE_REGEXP)     ? document.getElementById(ID_CHK_USE_REGEXP).checked     : false;
    const isCaseSensitive = document.getElementById(ID_CHK_CASE_SENSITIVE) ? document.getElementById(ID_CHK_CASE_SENSITIVE).checked : false;
    const isMultiLine     = document.getElementById(ID_CHK_MULTILINE)      ? document.getElementById(ID_CHK_MULTILINE).checked      : false;
    

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
                const beforeInput = elem.children.namedItem(CLS_REPLACE_STRING_BEFORE);
                const afterInput = elem.children.namedItem(CLS_REPLACE_STRING_AFTER);
                if (beforeInput !== 'undefined' && afterInput !== 'undefined') {
                    const before = replaceEscapeSequence(beforeInput.value);
                    const after = replaceEscapeSequence(afterInput.value);
                    replaceStrings.push({before, after});
                }
            }
        }
        return replaceStrings;
    })();
    
    // 置換実行
    const result = multiReplace(targetStr, replaceStrings, {useRegExp, isCaseSensitive, isMultiLine});

    // 置換結果を画面へ反映
    const replaceResult = document.getElementById(ID_REPLACE_RESULT);
    if (replaceResult) {
        replaceResult.value = result;
    }
}

/**
 * 複数文字列について置換する
 * 
 * @function multiReplace
 * @param {string}   targetStr 置換対象
 * @param {Object[]} replaceStrings 置換文字列のリスト
 * @param {string}   replaceStrings[].before 置換前の文字列
 * @param {string}   replaceStrings[].after 置換後の文字列
 * @param {Object}   option
 * @param {boolean}  [option.useRegExp = false] 正規表現を使うかどうか
 * @param {boolean}  [option.isCaseSensitive = false] 大文字と小文字を区別するか
 * @param {boolean}  [option.isMultiLine = false] 複数行に対して
 * @return {string}
 */
export const multiReplace = (targetStr, replaceStrings, option = {}) => {
    let result = targetStr;
    const {useRegExp = false, isCaseSensitive = false, isMultiLine = false} = option;
    console.log(useRegExp, isCaseSensitive, isMultiLine);
    if (useRegExp) {
        // 正規表現を使用
        const flags = 'g' + (isCaseSensitive ? '' : 'i')
        if (isMultiLine) {
            // 複数行まとめて
            replaceStrings.forEach(replaceString => {
                result = result.replace(new RegExp(replaceString.before, flags), replaceString.after);
            });
        } else {
            // 行ごとに
            result = result.split('\n').map(line => {
                replaceStrings.forEach(replaceString => {
                    line = line.replace(new RegExp(replaceString.before, flags), replaceString.after);
                });
                return line;
            }).join('\n');
        }
    } else {
        // 正規表現を使用しない
        replaceStrings.forEach(replaceString => {
            result = result.split(replaceString.before).join(replaceString.after);
        });
    }
    return result;
};

/**
 * エスケープシーケンスを戻す
 * 
 * @param {string} str
 * @return {string}
 */
const replaceEscapeSequence = (str) => {
    return str
    .split('\\n').join('\n')
    .split('\\r').join('\r')
    .split('\\t').join('\t');
}

onReadyPromise()
.then(init)
.catch((e) => {
    console.error(e);
});