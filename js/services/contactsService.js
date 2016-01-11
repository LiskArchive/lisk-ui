require('angular');

angular.module('webApp').service('contactsService', function ($http, userService, $filter) {
    function filterData(data, filter) {
        return $filter('filter')(data, filter)
    }

    function orderData(data, params) {
        return params.sorting() ? $filter('orderBy')(data, params.orderBy()) : filteredData;
    }

    function sliceData(data, params) {
        return data.slice((params.page() - 1) * params.count(), params.page() * params.count())
    }

    function transformData(data, filter, params) {
        return sliceData(orderData(filterData(data, filter), params), params);
    }

    var contacts = {
        count: 0,
        followersCount: 0,
        list: [],
        getContacts: function (publicKey, cb) {
            var queryParams = {
                publicKey: publicKey
            }
            $http.get("/api/contacts/", {
                params: queryParams
            })
                .then(function (response) {
                    if (response.data.success) {
                        contacts.list = response.data.following;
                        contacts.count = response.data.following.length;
                        contacts.followersCount = response.data.followers ? response.data.followers.length : 0;
                    }
                    else {
                        contacts.list = [];
                        contacts.count = 0;
                        contacts.followersCount = 0;
                    }
                    cb();
                });
        },
        getSortedContacts: function ($defer, params, filter, cb) {
            var queryParams = {
                publicKey: userService.publicKey
            }
            $http.get("/api/contacts/", {
                params: queryParams
            })
                .then(function (response) {
                    params.total(response.data.following.length);
                    var filteredData = $filter('filter')(response.data.following, filter);
                    var transformedData = transformData(response.data.following, filter, params);
                    $defer.resolve(transformedData);
                    cb(null);
                });
        },
        getSortedFollowers: function ($defer, params, filter, cb) {
            var queryParams = {
                publicKey: userService.publicKey
            }
            $http.get("/api/contacts/", {
                params: queryParams
            })
                .then(function (response) {
                    params.total(response.data.followers ? response.data.followers.length : 0);
                    var filteredData = $filter('filter')(response.data.followers ? response.data.followers : [], filter);
                    var transformedData = transformData(response.data.followers ? response.data.followers : [], filter, params);
                    $defer.resolve(transformedData);
                    cb(null);
                });
        },
        addContact: function (queryParams, cb) {
            $http.put("/api/contacts/",
                queryParams
            )
                .then(function (response) {
                    cb(response);
                });
        }
    }

    return contacts;
});