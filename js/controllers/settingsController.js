require('angular');


angular.module('webApp').controller('settingsController', ['$scope', '$rootScope', '$http', "userService", "$interval", "multisignatureModal",
    function ($rootScope, $scope, $http, userService, $interval, multisignatureModal) {
        $scope.view.page = {title: 'Settings', previos: null};
        $scope.view.bar = {};

        $scope.settings = {
            user: userService,
            enabledMultisign: false
        }

        $scope.checkEnabledMultisign = function () {
            if (userService.multisignatures) {
                if (userService.multisignatures.length) {
                    return true;
                }
            }
            if (userService.u_multisignatures) {
                if (userService.u_multisignatures.length) {
                    return true;
                }
            }
            return false;
        }

        $scope.settings.enabledMultisign = $scope.checkEnabledMultisign();

        $scope.updateSettings = $interval(function () {
            $scope.settings.enabledMultisign = $scope.checkEnabledMultisign();
        }, 1000);


        $scope.setMultisignature = function () {
            if ($scope.settings.enabledMultisign) {
                return;
            }
            $interval.cancel($scope.updateSettings);
            $scope.multisignatureModal = multisignatureModal.activate({
                destroy: function (enabled) {
                    $scope.settings.enabledMultisign = enabled;
                    $scope.settings.updateSettings = $interval(function () {
                        $scope.enabledMultisign = $scope.checkEnabledMultisign();
                    }, 1000);

                }
            });
        }


    }]);
