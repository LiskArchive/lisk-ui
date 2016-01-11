require('angular');


angular.module('webApp').controller('forgingController', ['$scope', '$rootScope', '$http', "userService", "$interval", "companyModal", "forgingModal", "delegateService", "viewFactory", "blockInfo", "ngTableParams", "blockService",
    function ($rootScope, $scope, $http, userService, $interval, companyModal, forgingModal, delegateService, viewFactory, blockInfo, ngTableParams, blockService) {

        $scope.allVotes = 100
            * 1000
            * 1000
            * 1000
            * 1000
            * 100;
        $scope.showAllColumns = false;
        $scope.showFullTime = false;
        $scope.countForgingBlocks = 0;
        $scope.graphs = {
            amountForged: {
                labels: ['1', '2', '3', '4'],
                series: ['Series A', 'Series B'],
                data: [
                    [20, 50, 20, 50],
                    [60, 30, 40, 20]
                ],
                colours: ['#378fe0', '#29b6f6'],
                options: {
                    scaleShowGridLines: false,
                    pointDot: false,
                    showTooltips: false,
                    scaleShowLabels: false,
                    scaleBeginAtZero: true
                }
            },
            totalForged: {
                labels: ['Total Forged'],
                values: [1],
                colours: ['#fff'],
                options: {
                    percentageInnerCutout: 90,
                    animationEasing: "linear",
                    segmentShowStroke: false,
                    showTooltips: false,
                    scaleLineColor: "rgba(0,0,0,0)",
                    scaleGridLineWidth: 0,
                    scaleShowHorizontalLines: false,

                    scaleShowVerticalLines: false
                }
            },
            rank: {
                labels: ['Others', 'Rank'],
                values: [0, 100],
                colours: ['#90a4ae', '#f5f5f5'],
                options: {
                    responsive: true,
                    percentageInnerCutout: 90,
                    animationEasing: "linear",
                    segmentShowStroke: false,
                    showTooltips: false
                }
            },
            uptime: {
                labels: ['Others', 'Uptime'],
                values: [0, 100],
                colours: ['#90a4ae', '#f5f5f5'],
                options: {
                    percentageInnerCutout: 90,
                    animationEasing: "linear",
                    segmentShowStroke: false,
                    showTooltips: false
                }
            },
            approval: {
                labels: ['Others', 'Approval'],
                values: [0, $scope.allVotes],
                colours: ['#90a4ae', '#f5f5f5'],
                options: {
                    percentageInnerCutout: 90,
                    animationEasing: "linear",
                    segmentShowStroke: false,
                    showTooltips: false
                }
            }
        }

        $scope.getApproval = function (vote) {
            return (vote / $scope.allVotes ) * 100;
        };

        $scope.approval = 0;
        $scope.vote = 0;
        $scope.rank = 0;
        $scope.uptime = 0;
        $scope.view = viewFactory;
        $scope.view.inLoading = true;
        $scope.view.loadingText = "Loading forging status";
        $scope.view.page = {title: 'Forging', previos: null};
        $scope.view.bar = {forgingMenu: true};

        $scope.address = userService.address;
        $scope.effectiveBalance = userService.effectiveBalance;
        $scope.totalBalance = userService.balance;
        $scope.unconfirmedBalance = userService.unconfirmedBalance;
        $scope.loadingBlocks = true;
        $scope.setForgingText(userService.forging);

        //Blocks
        $scope.tableBlocks = new ngTableParams({
            page: 1,
            count: 25,
            sorting: {
                height: 'desc'
            }
        }, {
            total: 0,
            counts: [],
            getData: function ($defer, params) {
                $scope.loading = true;
                blockService.getBlocks('', $defer, params, $scope.filter, function () {
                    $scope.loading = false;
                    $scope.countForgingBlocks = params.total();
                    $scope.view.inLoading = false;
                }, userService.publicKey);
            }
        });

        $scope.tableBlocks.settings().$scope = $scope;

        $scope.$watch("filter.$", function () {
            $scope.tableBlocks.reload();
        });

        $scope.updateBlocks = function () {
            $scope.tableBlocks.reload();
        };
        //end Blocks


        $scope.updateGraphs = function () {
            delegateService.getDelegate(userService.publicKey, function (response) {
                var totalDelegates = 108;
                var rank = response.rate;
                if (!rank || rank == 0) {
                    $scope.graphs.rank.values = [0, 100];
                }
                else {
                    $scope.graphs.rank.values = [totalDelegates - rank, totalDelegates - 1 - (totalDelegates - rank) == -1 ? 0 : totalDelegates - 1 - (totalDelegates - rank)];
                }

                if (($scope.rank == 0 && rank != 0) || ($scope.rank > 50 && rank <= 50) || ($scope.rank > 101 && rank <= 101) || ($scope.rank <= 50 && rank > 50)) {
                    $scope.graphs.rank.colours = [rank <= 50 ? '#7cb342' : (rank > 101 ? '#d32f2f' : '#ffa000'), '#f5f5f5'];
                }

                $scope.rank = rank;


                var uptime = parseFloat(response.productivity || 0);

                $scope.graphs.uptime.values = [uptime, 100 - uptime];
                if (($scope.uptime == 0 && uptime > 0) || ($scope.uptime >= 95 && uptime < 95) || ($scope.uptime >= 50 && uptime < 50)) {
                    $scope.graphs.uptime.colours = [uptime >= 95 ? '#7cb342' : (uptime >= 50 ? '#ffa000' : '#d32f2f'), '#f5f5f5'];
                }
                $scope.uptime = response.productivity || 0;

                var approval = $scope.getApproval(response.vote);

                $scope.graphs.approval.values = [approval, $scope.getApproval($scope.allVotes) - approval];
                if (($scope.approval == 0 && approval > 0) || ($scope.approval >= 95 && approval < 95) || ($scope.approval >= 50 && approval < 50)) {
                    $scope.graphs.approval.colours = [approval >= 95 ? '#7cb342' : (approval >= 50 ? '#ffa000' : '#d32f2f'), '#f5f5f5'];
                }
                $scope.approval = approval;


            });
        };

        $scope.getForgedAmount = function () {
            $http.get("/api/delegates/forging/getForgedByAccount", {params: {generatorPublicKey: userService.publicKey}})
                .then(function (resp) {
                    $scope.totalForged = resp.data.fees;
                });
        }


        $scope.$on('updateControllerData', function (event, data) {
            if (data.indexOf('main.forging') != -1) {
                $scope.updateBlocks();
                $scope.getForgedAmount();
                $scope.updateGraphs();
            }
        });

        $scope.updateBlocks();
        $scope.getForgedAmount();
        $scope.updateGraphs();


        $scope.newCompany = function () {
            $scope.companyModal = companyModal.activate({
                totalBalance: $scope.unconfirmedBalance,
                destroy: function () {
                    $scope.getInfo();
                }
            });
        }

        $scope.blockInfo = function (block) {
            $scope.modal = blockInfo.activate({block: block});
        }

    }]);