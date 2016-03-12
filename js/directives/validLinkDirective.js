require('angular');
angular.module('liskApp').directive('validLink', function () {
  return {
    require: 'ngModel',
    scope: {
      extension: '@extension'
    },
    link: function (scope, elem, attrs, ctrl) {
      scope.extension = (!scope.extension) ? '' : '.zip';

      var regexp = new RegExp('^(http[s]?:\/\/)([a-z0-9-./]+)(' + scope.extension + ')$', 'i');

      elem.on('blur', function () {
        scope.$apply(function () {
          var link = elem.val().trim();

          if (link.length > 0) {
            ctrl.$setValidity('pattern', link.match(regexp) ? true : false);
          } else {
            ctrl.$setValidity('pattern', true);
          }
        });
      });
    }
  }
});
