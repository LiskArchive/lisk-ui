require('angular');

angular.module('liskApp').directive('voteAction', function (gettextCatalog) {
    return {
        restrict: 'E',
        template: '<span>{{action}}</span>',
        replace: true,
        transclude: true,
        scope: {
            adding: '=adding'
        },
        link: function (scope, element, attrs) {
            if (scope.adding) {
                scope.action = gettextCatalog.getString('CONFIRM VOTE');
            } else {
                scope.action = gettextCatalog.getString('REMOVE VOTE');
            }
        }
    };
});
