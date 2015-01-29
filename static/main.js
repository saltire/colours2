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
            scope.$watch('colour.hex', function (hex) {
                scope.colour.red = parseInt(hex.slice(1, 3), 16);
                scope.colour.green = parseInt(hex.slice(3, 5), 16),
                scope.colour.blue = parseInt(hex.slice(5, 7), 16);

                var hsv = rgb2hsv(scope.colour.red, scope.colour.green, scope.colour.blue);
                scope.colour.hue = hsv.h;
                scope.colour.sat = hsv.s;
                scope.colour.val = hsv.v;
            });

            scope.$watchGroup(['colour.red', 'colour.green', 'colour.blue'], function () {
                var hsv = rgb2hsv(scope.colour.red, scope.colour.green, scope.colour.blue);
                scope.colour.hue = hsv.h;
                scope.colour.sat = hsv.s;
                scope.colour.val = hsv.v;

                scope.colour.hex = rgb2hex(scope.colour.red, scope.colour.green, scope.colour.blue);
            });

            scope.$watchGroup(['colour.hue', 'colour.sat', 'colour.val'], function () {
                var rgb = hsv2rgb(scope.colour.hue, scope.colour.sat, scope.colour.val);
                scope.colour.red = rgb.r;
                scope.colour.green = rgb.g;
                scope.colour.blue = rgb.b;

                scope.colour.hex = rgb2hex(scope.colour.red, scope.colour.green, scope.colour.blue);
            });
        }
    };
});

colourApp.directive('hexColour', function ($log) {
    return {
        require: 'ngModel',
        link: function (scope, elem, attr, ngModel) {
            ngModel.$parsers.push(function (value) {
                return value.toUpperCase()
                    .replace(/[^A-F0-9]/g, '')
                    .replace(/^#*/, '#')
                    .replace(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/, '#$1$1$2$2$3$3');
            });
            ngModel.$validators.hex = function (modelValue, viewValue) {
                return /#?[A-F0-9]{6}/.test(modelValue || viewValue);
            };
        }
    }
});
