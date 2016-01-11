require('angular');
angular.module('webApp').directive('stopEvent', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            element.bind('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
            });
        }
    };
});