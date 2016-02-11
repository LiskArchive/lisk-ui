require('angular');

angular.module('liskApp').service('languageService', function ($rootScope, $window, gettextCatalog) {

    $rootScope.languages = [
        { id: 'en', name: 'English' },
        { id: 'de', name: 'Deutsch' },
        { id: 'ru', name: 'русский' },
        { id: 'zh', name: '中文' }
    ];

    $rootScope.changeLang = function (changed) {
        if (!changed) { return; }

        var lang = findLang(changed);

        if (lang) {
            $rootScope.lang = lang;
            $rootScope.selectedLang = $rootScope.lang.id;
            gettextCatalog.setCurrentLanguage(lang.id);
            console.log('Language changed to:', lang.name);
        }
    }

    var detectLang = function () {
        var lang = $window.navigator.languages ? $window.navigator.languages[0] : null;
            lang = lang || $window.navigator.language || $window.navigator.browserLanguage || $window.navigator.userLanguage;

        if (lang.indexOf('-') !== -1) { lang = lang.split('-')[0]; }
        if (lang.indexOf('_') !== -1) { lang = lang.split('_')[0]; }

        return findLang(lang) || $rootScope.languages[0];
    };

    var findLang = function (id) {
        return _.find($rootScope.languages, function (lang) {
            return (lang.id == id) || (lang == id);
        });
    }

    return function () {
        $rootScope.lang = detectLang();
        $rootScope.selectedLang = $rootScope.lang.id;
        gettextCatalog.setCurrentLanguage($rootScope.lang.id);
    }

});
