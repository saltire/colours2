var colourApp = angular.module('colourApp', []);

colourApp.controller('colourCtrl', function ($scope, $log, $http) {
    $http.get('colours.json').then(function (res) {
        $scope.colours = res.data;

        angular.forEach($scope.colours, function (colour) {
            colour.hex = rgb2hex(colour.red, colour.green, colour.blue);
        });
    });
});

colourApp.directive('colourRow', function ($log) {
    return {
        link: function (scope, elem, attr) {
            scope.$watchGroup(['colour.red', 'colour.green', 'colour.blue'], function () {
                console.log('watch rgb');
                var hsv = rgb2hsv(scope.colour.red, scope.colour.green, scope.colour.blue);
                scope.colour.hue = hsv.h;
                scope.colour.sat = hsv.s;
                scope.colour.val = hsv.v;

                scope.colour.hex = rgb2hex(scope.colour.red, scope.colour.green, scope.colour.blue);
            });
        }
    };
});

colourApp.directive('hexColour', function ($log) {
    return {
        require: 'ngModel',
        link: function (scope, elem, attr, ngModel) {
            // parse value on update
            ngModel.$parsers.push(function (value) {
                return value.toUpperCase()
                    .replace(/^#*/, '#')
                    .replace(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/, '#$1$1$2$2$3$3');
            });

            // validate parsed value on update
            ngModel.$validators.hex = function (modelValue, viewValue) {
                return /#?[A-F0-9]{6}/.test(modelValue || viewValue);
            };

            // update RGB on update, if valid
            ngModel.$viewChangeListeners.push(function () {
                if (ngModel.$valid) {
                    scope.colour.red = parseInt(ngModel.$modelValue.slice(1, 3), 16);
                    scope.colour.green = parseInt(ngModel.$modelValue.slice(3, 5), 16),
                    scope.colour.blue = parseInt(ngModel.$modelValue.slice(5, 7), 16);
                }
            });

            // display parsed value on unfocus
            elem.on('change', function (e) {
                ngModel.$setViewValue(ngModel.$modelValue);
                ngModel.$render();
            });
        }
    }
});
