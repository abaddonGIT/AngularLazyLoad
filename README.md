AngularLazyLoad
===============
Позвоялет динамически подгружать модули angular при помощи директивы или внутри контроллера.
<h2>Как использовать?</h2>
<ol>
    <li>
        Подключение:
        <code>
            <script src="js/modules/lazyLoad/lazyLoad.js" type="text/javascript"></script>
        </code>
        <code>
            var app = angular.module("app", ["lazyLoad"]);
        </code>
    </li>
    <li>
        Настройка провайдера:
        <code>
            app.config(['$lazyLoadProvider', function ($lazyLoadProvider) {
                var modules = [
                    {
                        name: 'testModule',//Настоящие название подгружаемого модуля
                        file: 'js/modules/testModule/testModule.js',//Файл модуля
                        template: 'js/modules/testModule/tpl/test.tpl.html'//Шаблон для модуля, если необходимо,
                        css: 'js/modules/style.css'//Файл стилей, если нужно
                    }
                ];
                $lazyLoadProvider.config(modules, "app");
            } ]);
        </code>
    </li>
    <li>
        Подкрузка директивой:
        <code>
            <div data-lazy-load="modName"></div>
        </code>
    </li>
    <li>
        Подгрузка внутри контроллера:
        <code>
            app.controller("baseController", ['$scope', '$lazyLoad', '$document', function ($scope, $lazyLoad, $document) {
                $lazyLoad.loadMany([//Ф-я для подгрузки нескольких модулей одновременно, для одного модуля можно использовать ф-ю loadModule
                    {
                        name: "testModule",//Имя модуля, которое было указано в провайдере
                        scope: $scope,//Область выполнения
                        el: angular.element($document[0].querySelector('#testModule'))//Куда будет вставлен подгруженный код шаблона, если такой имеется
                    }
                ], function () {
                   console.log("Все модули подгруженны");
                });
            }]);
        </code>
    </li>
</ol>