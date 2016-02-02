require('angular');

angular.module('liskApp').service('languageService', function ($rootScope, gettextCatalog) {

    $rootScope.languages = [
        { id: 'de', name: 'Deutsch' },
        { id: 'en', name: 'English' },
        { id: 'es', name: 'Español' },
        { id: 'fr', name: 'Français' },
        { id: 'it', name: 'Italiano' },
        { id: 'jp', name: '日本語' },
        { id: 'kr', name: '한국어' },
        { id: 'nl', name: 'Netherlandish' },
        { id: 'pl', name: 'Polskie' },
        { id: 'pt', name: 'Português' },
        { id: 'ro', name: 'Română' },
        { id: 'ru', name: 'русский' },
        { id: 'zh', name: '中文' }
    ];

    return function (lang) {
        $rootScope.lang = $rootScope.languages[1];

        $rootScope.changeLang = function () {
            gettextCatalog.setCurrentLanguage(this.lang.id);
            console.log('Language changed to:', this.lang.name);
        }

        gettextCatalog.setCurrentLanguage($rootScope.lang.id);
    }

});
