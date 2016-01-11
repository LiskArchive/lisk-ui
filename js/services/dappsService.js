require('angular');

angular.module('webApp').service('dappsService', function () {


    var dapp = {
        searchForDapp: '',
        searchForDappGlobal: ''
    }

    return dapp;
})
;