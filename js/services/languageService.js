require('angular');

angular.module('liskApp').service('languageService', function ($rootScope, gettextCatalog) {

    $rootScope.languages = [
        { id: 'de', name: 'Deutsch' },
        { id: 'en', name: 'English' },
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
