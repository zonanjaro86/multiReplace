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

onReadyPromise().then(() => {
    console.log('loaded');
});