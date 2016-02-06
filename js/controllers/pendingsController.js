require('angular');

angular.module('liskApp').controller('pendingsController', ['$scope', '$rootScope', '$http', 'viewFactory', 'contactsService', 'ngTableParams', 'gettextCatalog',
    function ($rootScope, $scope, $http, viewFactory, contactsService, ngTableParams, gettextCatalog) {
        $scope.view = viewFactory;
        $scope.view.inLoading = true;
        $scope.view.loadingText = gettextCatalog.getString('Loading contacts');
        $scope.view.page = {title: gettextCatalog.getString('Contacts'), previous: null};
        $scope.view.bar = {showContactsBar: true};
        $scope.contactsView = contactsService;
        //Contacts table
        $scope.tableFollowers = new ngTableParams({
            page: 1,            // show first page
            count: 25,
            sorting: {
                username: 'asc'     // initial sorting
            }
        }, {
            counts: [],
            total: 0,
            getData: function ($defer, params) {
                contactsService.getSortedFollowers($defer, params, $scope.filter, function(err){
                    $scope.view.inLoading = false;
                });
            }
        });

        $scope.tableFollowers.cols = {
            username : gettextCatalog.getString('Username'),
            address : gettextCatalog.getString('Lisk Address')
        };

        $scope.tableContacts.settings().$scope = $scope;

        $scope.$watch("filter.$", function () {
            $scope.tableContacts.reload();
        });

        $scope.updateFollowers = function () {
            $scope.tableContacts.reload();
        };
        //end Top delegates

        $scope.$on('updateControllerData', function (event, data) {
            if (data.indexOf('main.pending') != -1) {
                $scope.updateFollowers();
            }
        });

    }]);
