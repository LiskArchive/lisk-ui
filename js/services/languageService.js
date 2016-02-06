require('angular');

angular.module('liskApp').service('languageService', function ($rootScope, gettextCatalog) {

    $rootScope.languages = [
        { id: 'de', name: 'Deutsch' },
        { id: 'en', name: 'English' },
        { id: 'zh', name: '中文' }
    ];

    return function (lang) {
        $rootScope.lang = $rootScope.languages[1];

        $rootScope.changeLang = function (changed) {
            var lang = _.find($rootScope.languages, function (lang) {
                return lang.id == changed
            });

            if (lang) {
                $rootScope.lang = lang;
                gettextCatalog.setCurrentLanguage(lang.id);
                console.log('Language changed to:', lang.name);
            }
        }

        gettextCatalog.setCurrentLanguage($rootScope.lang.id);
    }

});
