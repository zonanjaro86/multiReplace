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

    // test
    nodes.push(htmlToNode('<h1>test</h1>'));
    nodes.push(htmlToNode('<p>testです</p>'));
    
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