var app = angular.module("app", ["lazyLoad"]);
app.config(['$lazyLoadProvider', function ($lazyLoadProvider) {
    var modules = [
        {
            name: 'testModule',
            file: 'js/modules/testModule/testModule.js',
            template: 'js/modules/testModule/tpl/test.tpl.html'
        },
        {
            name: 'testModule2',
            file: 'js/modules/testModule2/testModule2.js',
            template: 'js/modules/testModule2/tpl/test.tpl.html'
        },
        {
            name: 'module3',
            file: 'js/modules/module3/module3.js'
        }
    ];
    $lazyLoadProvider.config(modules, "app");
} ]);
