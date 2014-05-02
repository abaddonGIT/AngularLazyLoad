AngularLazyLoad
===============
Позвоялет динамически подгружать модули angular при помощи директивы или внутри контроллера.
<h2>Как использовать?</h2>
<ol>
    <li>
        Подключение:
        <pre>
            <script src="js/modules/lazyLoad/lazyLoad.js" type="text/javascript"></script>
        </pre>
        <pre>
            var app = angular.module("app", ["lazyLoad"]);
        </pre>
    </li>
    <li>
        Настройка провайдера:
        <pre>
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
        </pre>
    </li>
    <li>
        Подкрузка директивой:
        <pre>
            <div data-lazy-load="modName"></div>
        </pre>
    </li>
    <li>
        Подгрузка внутри контроллера:
        <pre>
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
        </pre>
    </li>
</ol>