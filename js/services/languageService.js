require('angular');

angular.module('liskApp').service('languageService', function ($rootScope, $window, gettextCatalog) {

    $rootScope.languages = [
        { id: 'de', name: 'Deutsch' },
        { id: 'en', name: 'English' },
        { id: 'zh', name: '中文' }
    ];

    $rootScope.changeLang = function (changed) {
        var lang = findLang(changed);

        if (lang) {
            $rootScope.lang = lang;
            gettextCatalog.setCurrentLanguage(lang.id);
            console.log('Language changed to:', lang.name);
        }
    }

    var detectLang = function () {
        var lang = $window.navigator.languages ? $window.navigator.languages[0] : null;
            lang = lang || $window.navigator.language || $window.navigator.browserLanguage || $window.navigator.userLanguage;

        if (lang.indexOf('-') !== -1) { lang = lang.split('-')[0]; }
        if (lang.indexOf('_') !== -1) { lang = lang.split('_')[0]; }

        return findLang(lang);
    };

    var findLang = function (id) {
        return _.find($rootScope.languages, function (lang) {
            return lang.id == id
        });
    }

    return function (lang) {
        $rootScope.lang = detectLang() || $rootScope.languages[1];
        gettextCatalog.setCurrentLanguage($rootScope.lang.id);
    }

});
