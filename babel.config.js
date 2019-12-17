module.exports = {
  presets: [
    ['@vue/app', {
        polyfills: [
            'es6.promise',
            'es7.promise.finally',
            'es6.symbol',
            'es6.array.iterator',
            'es6.array.find',
            'es6.array.find-index',
            'es7.array.includes' ,
            'es6.string.includes',
            'es6.object.assign'
        ]
    }]
  ]
}
