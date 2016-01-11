require('angular');
var compareVersion = require('../../node_modules/compare-version/index.js');

angular.module('webApp').controller('appController', ['dappsService', '$scope', '$rootScope', '$http', "userService", "$interval", "$timeout", 'viewFactory', '$state', 'blockService', 'sendCryptiModal', 'registrationDelegateModal', 'userSettingsModal', 'serverSocket', 'delegateService', '$window', 'forgingModal', 'errorModal', 'contactsService', 'addContactModal', 'userInfo', 'transactionsService', 'secondPassphraseModal', 'focusFactory',
    function (dappsService, $rootScope, $scope, $http, userService, $interval, $timeout, viewFactory, $state, blockService, sendCryptiModal, registrationDelegateModal, userSettingsModal, serverSocket, delegateService, $window, forgingModal, errorModal, contactsService, addContactModal, userInfo, transactionsService, secondPassphraseModal, focusFactory) {
        $scope.searchTransactions = transactionsService;
        $scope.searchDapp = dappsService;
        $scope.searchBlocks = blockService;
        $scope.toggled = false;
        $scope.rememberedPassword = userService.rememberPassword ? userService.rememberedPassword : false;
        $scope.xcr_usd = 0;
        $scope.version = 'ersion load';
        $scope.diffVersion = 0;
        $scope.subForgingCollapsed = true;
        $scope.categories = {};
        $scope.dataToShow = {forging: false}

        $scope.getCategoryName = function (id) {
            for (var key in $scope.categories) {
                if ($scope.categories.hasOwnProperty(key)) {
                    if (id == $scope.categories[key]) {
                        return key.toString();
                    }
                }
            }
        }

        $scope.getCategories = function () {
            $http.get("/api/dapps/categories").then(function (response) {
                if (response.data.success) {
                    $scope.categories = response.data.categories;
                }
                else {
                    $scope.categories = {};
                }
            });

        }

        $scope.collapseMenu = function () {
            $scope.subForgingCollapsed = !$scope.subForgingCollapsed;
        }

        $scope.toggleMenu = function () {
            $scope.toggled = !$scope.toggled;
        }


        $scope.moreDropdownStatus = {
            isopen: false
        };
        $scope.moreNotificationsStatus = {
            isopen: false
        };

        $scope.moreDownTable = {
            isopen: false
        };

        $scope.contacts = {
            count: 0,
            list: []
        };

        $scope.toggleDropdown = function ($event) {

        };

        $scope.toggled = function (open) {
            if ($scope.checked) {
                $scope.moreDownTable.isopen = true;
            }
        }
        $scope.checked = false;
        $scope.check = function ($event) {
            $event.stopPropagation();
            $scope.checked = true;
        }


        $scope.syncState = 1;
        $scope.loading = {
            labels: ['Total', 'Loaded'],
            values: [0, 100],
            colours: ['#1976d2', '#ffffff'],
            options: {
                percentageInnerCutout: 90,
                animationEasing: "linear",
                segmentShowStroke: false,
                showTooltips: false
            }
        };
        $scope.view = viewFactory;

        $scope.toggleSearchDapps = function () {
            $scope.view.bar.searchDapps = !$scope.view.bar.searchDapps;
            $scope.searchDapp.searchForDappGlobal = '';
        }

        $scope.modules = [
            'main.dashboard',
            'main.delegates',
            'main.transactions',
            'main.votes',
            'main.forging',
            'main.blockchain',
            'passphrase',
            'main.contacts',
            'main.dappstore',
            'main.multi'
        ];


        $scope.getUSDPrice = function () {
            $http.get("//146.148.61.64:4060/api/1/ticker/XCR_BTC")
                .then(function (response) {
                    var xcr_btc = response.data.last;
                    $http.get("//146.148.61.64:4060/api/1/ticker/BTC_USD")
                        .then(function (response) {
                            $scope.xcr_usd = xcr_btc * response.data.last;
                        });
                });
        };

        $scope.getVersion = function () {
            $http.get("/api/peers/version").then(function (response) {
                if (response.data.success) {
                    $scope.version = response.data.version;
                    $http.get("https://wallet.crypti.me/api/peers/version").then(function (response) {
                        $scope.latest = response.data.version;
                        $scope.diffVersion = compareVersion($scope.version, $scope.latest);
                    });
                }
                else {
                    $scope.diffVersion = -1;
                    $scope.version = 'ersion error';
                }
            });
        };

        $scope.convertToUSD = function (xcr) {
            return (xcr / 100000000) * $scope.xcr_usd;
        };

        $scope.clearSearch = function () {
            $scope.searchTransactions.searchForTransaction = '';
            $scope.searchBlocks.searchForBlock = '';
        }

        $scope.getAppData = function () {
            $http.get("/api/accounts", {params: {address: userService.address}})
                .then(function (resp) {
                    var account = resp.data.account;
                    if (!account) {
                        userService.balance = 0;
                        userService.unconfirmedBalance = 0;
                        userService.secondPassphrase = '';
                        userService.unconfirmedPassphrase = '';
                        userService.username = '';
                    }
                    else {
                        userService.balance = account.balance;
                        userService.unconfirmedBalance = account.unconfirmedBalance;
                        userService.multisignatures = account.multisignatures;
                        userService.u_multisignatures = account.u_multisignatures;
                        userService.secondPassphrase = account.secondSignature || account.unconfirmedSignature;
                        userService.unconfirmedPassphrase = account.unconfirmedSignature;
                        userService.username = account.username;
                    }
                    $scope.username = userService.username;
                    $scope.balance = userService.balance;
                    $scope.unconfirmedBalance = userService.unconfirmedBalance;
                    $scope.secondPassphrase = userService.secondPassphrase;
                    $scope.unconfirmedPassphrase = userService.unconfirmedPassphrase;
                    $scope.delegateInRegistration = userService.delegateInRegistration;
                    if ($state.current.name != 'passphrase') {
                        $scope.getMultisignatureAccounts(function (multisignature) {
                            $scope.multisignature = userService.u_multisignatures.length || userService.multisignatures.length
                                || multisignature;
                        });
                    }

                    if ($state.current.name == 'main.dashboard' || $state.current.name == 'main.forging' || $state.current.name == 'main.votes' || $state.current.name == 'main.delegates') {
                        $scope.getForging($scope.setForgingText);
                        $scope.getDelegate();
                    }

                    if ($state.current.name == 'main.dashboard') {
                        $scope.getContacts();

                    }
                    if ($state.current.name == 'main.pending' || $state.current.name == 'main.contacts') {
                        $scope.getContacts();
                    }
                    if ($state.current.name == 'main.forging' || $state.current.name == 'main.votes' || $state.current.name == 'main.delegates') {
                        $scope.getMyVotesCount();
                        $scope.getForging($scope.setForgingText);
                    }
                    if ($state.current.name == 'main.dappstore' || 'main.dashboard') {
                        $scope.getCategories();
                    }

                });
        };

        $scope.getMasterPassword = function () {
            $http.get("api/dapps/ismasterpasswordenabled")
                .then(function (resp) {
                    if (resp.data.success) {
                        $scope.ismasterpasswordenabled = resp.data.enabled;
                    }
                });
        }

        $scope.sendCrypti = function (to) {
            to = to || '';
            $scope.sendCryptiModal = sendCryptiModal.activate({
                totalBalance: $scope.unconfirmedBalance,
                to: to,
                destroy: function () {
                }
            });
        }

        $scope.addContact = function (contact) {
            contact = contact || "";
            $scope.addContactModal = addContactModal.activate({
                contact: contact,
                destroy: function () {
                }
            });
        }

        $scope.isUserInContactList = function (address) {
            var inList = false;
            $scope.contacts.list.forEach(function (contact) {
                if (contact.address == address) {
                    inList = true;
                }
            });
            return inList;
        }

        $scope.setSecondPassphrase = function () {
            $scope.addSecondPassModal = secondPassphraseModal.activate({
                totalBalance: $scope.unconfirmedBalance,
                destroy: function () {
                }
            });
        }

        $scope.enableForging = function () {
            if ($scope.rememberedPassword) {
                $http.post("/api/delegates/forging/enable", {
                    secret: $scope.rememberedPassword,
                    publicKey: userService.publicKey
                })
                    .then(function (resp) {
                        if (resp.data.success) {
                            userService.setForging(resp.data.success);
                            $scope.forging = resp.data.success;
                            $scope.dataToShow.forging = $scope.forging;
                        }
                        else {
                            $scope.errorModal = errorModal.activate({
                                error: resp.data.error,
                                destroy: function () {
                                    $scope.forging = false;
                                    $scope.dataToShow.forging = $scope.forging;
                                }
                            })
                        }
                    });


            }
            else {
                $scope.forgingModal = forgingModal.activate({
                    forging: false,
                    totalBalance: userService.unconfirmedBalance,
                    destroy: function (success) {
                        userService.setForging(success);
                        $scope.getForging($scope.setForgingText);
                        $scope.forging = userService.forging;
                        $scope.dataToShow.forging = $scope.forging;

                    }
                })
            }
        }

        $scope.disableForging = function () {
            if ($scope.rememberedPassword) {

                $scope.error = null;

                $http.post("/api/delegates/forging/disable", {
                    secret: $scope.rememberedPassword,
                    publicKey: userService.publicKey
                })
                    .then(function (resp) {
                        if (resp.data.success) {
                            userService.setForging(!resp.data.success);
                            $scope.forging = !resp.data.success;
                            $scope.dataToShow.forging = $scope.forging;
                        }
                        else {
                            $scope.errorModal = errorModal.activate({
                                error: resp.data.error,
                                destroy: function () {
                                    $scope.forging = true;
                                    $scope.dataToShow.forging = $scope.forging;
                                }
                            })
                        }


                    });
            }
            else {
                $scope.forgingModal = forgingModal.activate({
                    forging: true,
                    totalBalance: userService.unconfirmedBalance,
                    destroy: function () {
                        $scope.forging = userService.forging;
                        $scope.dataToShow.forging = $scope.forging;
                        $scope.getForging($scope.setForgingText);
                    }
                })
            }
        }

        $scope.toggleForging = function () {
            if ($scope.forging) {
                $scope.disableForging();
            }
            else {
                $scope.enableForging();
            }
        }

        $scope.setForgingText = function (forging) {
            if ($state.current.name == 'main.forging' || $state.current.name == 'main.votes' || $state.current.name == 'main.delegates') {
                $scope.forgingStatus = forging ? 'Enabled' : 'Disabled';
                $scope.forgingEnabled = forging;
            }
            else {
                $scope.forgingStatus = null;
            }
        }

        $scope.getForging = function (cb) {
            $http.get("/api/delegates/forging/status", {params: {publicKey: userService.publicKey}})
                .then(function (resp) {
                    $scope.forging = resp.data.enabled;
                    $scope.dataToShow.forging = $scope.forging;
                    userService.setForging($scope.forging);
                    cb($scope.forging);
                });
        }

        $scope.getMultisignatureAccounts = function (cb) {
            var queryParams = {
                publicKey: userService.publicKey
            }

            $http.get("/api/multisignatures/accounts", {
                params: queryParams
            })
                .then(function (response) {
                    if (response.data.success) {
                        if (response.data.accounts.length) {
                            return userService.setMultisignature(true, cb);
                        }
                        else {
                            $http.get("/api/multisignatures/pending", {
                                params: queryParams
                            })
                                .then(function (response) {
                                    if (response.data.success) {
                                        if (response.data.transactions.length) {
                                            return userService.setMultisignature(true, cb);
                                        }
                                        else {
                                            return userService.setMultisignature(false, cb);
                                        }
                                    }
                                    else {
                                        return userService.setMultisignature(false, cb);
                                    }
                                });

                        }
                    }
                    else {
                        return userService.setMultisignature(false, cb);
                    }
                });
        }


        $scope.getContacts = function () {
            contactsService.getContacts(userService.publicKey, function () {
                $scope.contacts = {
                    count: contactsService.count,
                    followersCount: contactsService.followersCount,
                    list: contactsService.list
                };
            });
        }

        $scope.registrationDelegate = function () {
            $scope.registrationDelegateModal = registrationDelegateModal.activate({
                totalBalance: userService.unconfirmedBalance,
                destroy: function () {
                    $scope.delegateInRegistration = userService.delegateInRegistration;
                    $scope.getDelegate();
                }
            })
        }

        $scope.userSettings = function () {
            $scope.userSettingsModal = userSettingsModal.activate({
                destroy: function () {
                }
            });
        }

        $scope.getDelegate = function () {
            delegateService.getDelegate(userService.publicKey, function (response) {
                if (response.username && !$scope.username) {
                    $scope.username = response.username;
                    userService.username = response.username;

                }
                if ($scope.delegateInRegistration) {
                    /*  $scope.delegateInRegistration = !(!!response);
                     userService.setDelegateProcess($scope.delegateInRegistration);*/
                }
                $scope.delegate = response;
                userService.setDelegate($scope.delegate);
                if (!response.noDelegate) {
                    $http.get("/api/transactions", {
                        params: {
                            senderPublicKey: userService.publicKey,
                            limit: 1,
                            type: 2
                        }
                    }).then(function (response) {
                        if (response.data.success) {
                            userService.setDelegateTime(response.data.transactions);
                        }
                        else {
                            userService.setDelegateTime([{timestamp: null}]);
                        }
                    });
                }
            });
        }

        $scope.getSync = function () {
            $http.get("/api/loader/status/sync").then(function (resp) {
                if (resp.data.success) {
                    $scope.syncState = resp.data.sync ? (resp.data.blocks ? (Math.floor((resp.data.height / resp.data.blocks) * 100)) : 0) : 0;
                    if ($scope.syncState) {
                        $scope.loading.values = [(resp.data.height - resp.data.blocks) < 0 ? (0 - (resp.data.height - resp.data.blocks)) : (resp.data.height - resp.data.blocks), resp.data.blocks];
                    }
                }
            });
        }

        $scope.getMyVotesCount = function () {
            $http.get("/api/accounts/delegates/", {params: {address: userService.address}})
                .then(function (response) {
                    $scope.myVotesCount = response.data.delegates ? response.data.delegates.length : 0;
                });
        }

        $scope.myUserInfo = function () {
            $scope.modal = userInfo.activate({userId: userService.address});
        }

        $scope.syncInterval = $interval(function () {
            $scope.getSync();
        }, 1000 * 30);

        $scope.getSync();
        $scope.getDelegate();

        $scope.showMenuItem = function (state) {
            return $scope.modules.indexOf(state) != -1;
        }

        $scope.goToPrevios = function () {
            $state.go($scope.view.page.previos);
        }

        $rootScope.$on('$stateChangeSuccess',
            function (event, toState, toParams, fromState, fromParams) {

            });
        $rootScope.$on('$stateChangeStart',
            function (event, toState, toParams, fromState, fromParams) {

            });

        $scope.$on('socket:transactions/change', function (ev, data) {
            $scope.getAppData();
            $scope.updateViews([
                'main.transactions',
                'main.contacts',
                'main.multi',
                'main.dashboard'
            ]);
        });
        $scope.$on('socket:blocks/change', function (ev, data) {
            $scope.getAppData();
            $scope.updateViews([
                'main.blockchain',
                'main.dashboard'
            ]);
        });
        $scope.$on('socket:delegates/change', function (ev, data) {
            $scope.getAppData();
            $scope.updateViews([
                'main.delegates',
                'main.votes',
                'main.forging'
            ]);
        });
        $scope.$on('socket:rounds/change', function (ev, data) {
            console.log("I\'m here");
            $scope.getAppData();
            $scope.updateViews([
                'main.delegates',
                'main.votes',
                'main.forging'
            ]);
        })

        $scope.$on('socket:contacts/change', function (ev, data) {
            $scope.getAppData();
            $scope.updateViews([
                'main.contacts'
            ]);
        });
        $scope.$on('socket:dapps/change', function (ev, data) {
            $scope.updateViews([
                'main.dapps'
            ]);
        });
        $scope.$on('socket:followers/change', function (ev, data) {
            $scope.getAppData();
            $scope.updateViews([
                'main.pending'
            ]);
        });

        $scope.$on('socket:multisignatures/change', function (ev, data) {
            $scope.getAppData();
            $scope.updateViews([
                'main.multi'
            ]);
        });

        $scope.$on('socket:multisignatures/signatures/change', function (ev, data) {
            $scope.getAppData();
            $scope.updateViews([
                'main.multi'
            ]);
        });

        $window.onfocus = function () {
            $scope.getAppData();
            $scope.updateViews([$state.current.name]);
        }

        $scope.updateViews = function (views) {
            $timeout(function () {
                $scope.$broadcast('updateControllerData', views);
            });
        }

        $scope.getAppData();
        $scope.getUSDPrice();
        $scope.getVersion();
        $scope.getMasterPassword();
        $timeout(function () {
            $scope.getVersion();
        }, 60 * 10 * 1000);
    }]);