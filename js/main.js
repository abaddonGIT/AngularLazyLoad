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

app.controller("baseController", ['$scope', '$lazyLoad', '$document', '$filter', '$rootScope', function ($scope, $lazyLoad, $document, $filter, $rootScope) {
    $scope.mimi = "mimi";
    $lazyLoad.loadMany([
        {
            name: "testModule",
            scope: $scope,
            el: angular.element($document[0].querySelector('#testModule'))
        },
        {
            name: "testModule2",
            scope: $scope,
            el: angular.element($document[0].querySelector('#testModule2'))
        }
    ], function (options) {
        console.log(options);
    });

    $rootScope.$on("filter:start", function (e, input) {
        $scope.mimi = $filter("govno")(input);
        console.log($scope);
    });

}]);

app.filter("test", function ($lazyLoad, $rootScope, $filter) {
    $lazyLoad.loadModule({
        name: 'module3',
        scope: this
    }, function () {
        $rootScope.$emit("filter:loaded");
    });
    return function (input) {
        $rootScope.$on("filter:loaded", function () {
            $rootScope.$emit("filter:start", input);
        });
        return input;
    };
});