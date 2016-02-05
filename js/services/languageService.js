require('angular');

angular.module('liskApp').service('languageService', function ($rootScope, gettextCatalog) {

    $rootScope.languages = [
        { id: 'de', name: 'Deutsch' },
        { id: 'cn', name: '中文' },
        { id: 'en', name: 'English' }
    ];

    return function (lang) {
        $rootScope.lang = $rootScope.languages[2];

        $rootScope.changeLang = function () {
            gettextCatalog.setCurrentLanguage(this.lang.id);
            console.log('Language changed to:', this.lang.name);
        }

        gettextCatalog.setCurrentLanguage($rootScope.lang.id);
    }

});
