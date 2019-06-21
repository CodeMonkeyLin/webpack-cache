// import $ from 'jquery'

// window.onload = function () {
//     document.getElementById('btn').onclick = function () {
//         $('<div></div>').html('我是main').appendTo('body')
//     }
// }


function getComponent() {
    return import(/* webpackPrefetch: true */ 'jquery').then(({ default: $ }) => {
        return $('<div></div>').html('我是main')
    })
}

window.onload = function () {
    document.getElementById('btn').onclick = function () {
        getComponent().then(item => {
            item.appendTo('body')
        })
    }
}