AngularLazyLoad
===============
Позвоялет динамически подгружать модули angular при помощи директивы или внутри контроллера.
<h2>Как использовать?</h2>
<ol>
    <li>
        Подключение:
            <pre>var app = angular.module("app", ["lazyLoad"]);</pre>
    </li>
    <li>
        Настройка провайдера:
        <pre>app.config(['$lazyLoadProvider', function ($lazyLoadProvider) {
        var modules = [
            {
                name: 'testModule',//Настоящие название подгружаемого модуля
                file: 'js/modules/testModule/testModule.js',//Файл модуля
                template: 'js/modules/testModule/tpl/test.tpl.html'//Шаблон для модуля, если необходимо,
                css: 'js/modules/style.css'//Файл стилей, если нужно
            }
        ];
        $lazyLoadProvider.config(modules, "app");
} ]);</pre>
    </li>
    <li>
        Подкрузка директивой:
        <pre><code>&lt;div data-lazy-load="modName"&gt;
</code></pre>
    </li>
    <li>
        Подгрузка внутри контроллера:
        <pre>
app.controller("baseController", ['$scope', '$lazyLoad', '$document', function ($scope, $lazyLoad, $document) {
    $lazyLoad.loadMany([//Ф-я для подгрузки нескольких модулей одновременно, для одного модуля можно использовать ф-ю  loadModule
        {
            name: "testModule",//Имя модуля, которое было указано в провайдере
            scope: $scope,//Область выполнения
            el: angular.element($document[0].querySelector('#testModule'))//Куда будет вставлен подгруженный код шаблона, если такой имеется
        }], function () {
            console.log("Все ok!");
        });
    ]);</pre>
    </li>
</ol>
<hr />
AngularLazyLoad
===============
Lazy loading angular modules
<h2>How to use it?</h2>
<ol>
    <li>
        Installation:
            <pre>var app = angular.module("app", ["lazyLoad"]);</pre>
    </li>
    <li>
        Provider settings:
        <pre>app.config(['$lazyLoadProvider', function ($lazyLoadProvider) {
        var modules = [
            {
                name: 'testModule',//Real module name
                file: 'js/modules/testModule/testModule.js',//Module file
                template: 'js/modules/testModule/tpl/test.tpl.html'//Module template if is there,
                css: 'js/modules/style.css'//Style file, if is there
            }
        ];
        $lazyLoadProvider.config(modules, "app");
} ]);</pre>
    </li>
    <li>
        Loading by means of directive:
        <pre><code>&lt;div data-lazy-load="modName"&gt;
</code></pre>
    </li>
    <li>
        Loading inside controller:
        <pre>
app.controller("baseController", ['$scope', '$lazyLoad', '$document', function ($scope, $lazyLoad, $document) {
    $lazyLoad.loadMany([//Function form loading several modules. If you want to install one module, then use the LoadModule function.
        {
            name: "testModule",//Module name
            scope: $scope,
            el: angular.element($document[0].querySelector('#testModule'))//Element in which module template is loaded
        }], function () {
            console.log("ok!");
        });
    ]);</pre>
    </li>
</ol>