var colourApp = angular.module('colourApp', []);

colourApp.controller('colourCtrl', function ($scope, $log, $http) {
    $http.get('colours.json').then(function (res) {
        $scope.colours = res.data;
    });
});

function sync_values(scope) {
    scope.red = scope.colour.red;
    scope.green = scope.colour.green;
    scope.blue = scope.colour.blue;

    var hsv = rgb2hsv(scope.colour.red, scope.colour.green, scope.colour.blue);
    scope.hue = hsv.hue;
    scope.sat = hsv.sat;
    scope.val = hsv.val;

    scope.hex = rgb2hex(scope.colour.red, scope.colour.green, scope.colour.blue);
}

colourApp.directive('colourRow', function () {
    return {
        link: function (scope, elem, attr) {
            sync_values(scope);
        }
    };
});

colourApp.directive('max', function () {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ngModel) {
            ngModel.$parsers.push(function (value) {
                return typeof value == 'number' ? value : parseInt(value.replace(/[^\d]/g, ''));
            });

            ngModel.$validators.max = function (modelValue, viewValue) {
                return modelValue <= parseInt(attrs.max);
            };
        }
    };
});

colourApp.directive('colourValue', function () {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ngModel) {
            // sync value with colour on unfocus
            elem.on('change', function (e) {
                sync_values(scope);
                ngModel.$setViewValue(scope[attrs.ngModel]);
                ngModel.$render();
            });
        }
    };
});

colourApp.directive('colourRgb', function () {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ngModel) {
            // sync colour with values on update, if valid
            ngModel.$viewChangeListeners.push(function () {
                if (scope.red !== undefined && scope.green !== undefined && scope.blue !== undefined) {
                    scope.colour.red = scope.red;
                    scope.colour.green = scope.green;
                    scope.colour.blue = scope.blue;
                }
            });
        }
    };
});

colourApp.directive('colourHsv', function () {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ngModel) {
            // sync colour with values on update, if valid
            ngModel.$viewChangeListeners.push(function () {
                if (scope.hue !== undefined && scope.sat !== undefined && scope.val !== undefined) {
                    angular.extend(scope.colour, hsv2rgb(scope.hue, scope.sat, scope.val));
                }
            });
        }
    };
});

colourApp.directive('colourHex', function () {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ngModel) {
            // parse value on update
            ngModel.$parsers.push(function (value) {
                return value.toUpperCase()
                    .replace(/^#*/, '#')
                    .replace(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/, '#$1$1$2$2$3$3');
            });

            // validate parsed value on update
            ngModel.$validators.hex = function (modelValue, viewValue) {
                return /#?[A-F0-9]{6}/.test(modelValue);
            };

            // sync colour with value on update, if valid
            ngModel.$viewChangeListeners.push(function () {
                if (ngModel.$valid) {
                    angular.extend(scope.colour, hex2rgb(ngModel.$modelValue));
                }
            });
        }
    };
});
