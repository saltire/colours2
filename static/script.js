var colourApp = angular.module('colourApp', []);

colourApp.controller('colourCtrl', function ($scope, $http) {
    $http.get('colours.json').then(function (res) {
        $scope.colours = res.data;
    });

    $scope.hex = function (r, g, b) {
        var hex = (r * 0x10000 + g * 0x100 + b).toString(16);
        return '#' + '000000'.slice(hex.length) + hex;
    };

    $scope.rgb2hsv = function (r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;

        var min = Math.min(r, g, b);
        var max = Math.max(r, g, b);

        if (min == max) {
            var h = 0;
            var s = 0;
            var v = Math.floor(min * 100);
        }
        else {
            var dif = (r == min) ? g - b : ((b == min) ? r - g : b - r);
            var hue = (r == min) ? 3 : ((b == min) ? 1 : 5);
            var chr = max - min;

            var h = Math.floor((hue - dif / chr) * 60);
            var s = Math.floor(chr / max * 100);
            var v = Math.floor(max * 100);
        }

        return [h, s, v];
    };

    $scope.hsv2rgb = function (h, s, v) {
        h /= 60;
        s /= 100;
        v /= 100;
        var rgb;

        if (s === 0) {
            rgb = [v, v, v];
        }
        else {
            i = Math.floor(h);
            data = [v * (1 - s),
                    v * (1 - s * (h - i)),
                    v * (1 - s * (1 - (h - i)))];

            if (i == 0) {
                rgb = [v, data[2], data[0]];
            } else if (i == 1) {
                rgb = [data[1], v, data[0]];
            } else if (i == 2) {
                rgb = [data[0], v, data[2]];
            } else if (i == 3) {
                rgb = [data[0], data[1], v];
            } else if (i == 4) {
                rgb = [data[2], data[0], v];
            } else if (i == 5) {
                rgb = [v, data[0], data[1]];
            }
        }

        return rgb.map(function (c) { return Math.floor(c * 255); });
    };
});
