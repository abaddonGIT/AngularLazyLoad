/**
 * Created by abaddon on 01.03.14.
 */
angular.module('module3', []).controller("testcontroller3", function ($scope) {
    $scope.hellow = "Меня подгрузили3";
}).directive("testDirective", function () {
    return {
        link: function (scope, elm, attr) {
            console.log("Директива из третьего модуля!");
        }
    };
}).filter('govno', function () {
    return function (input) {
        return input + 'govno!!!!';
    };
});


