function rgb2hex(r, g, b) {
    var hex = (parseInt(r) * 0x10000 + parseInt(g) * 0x100 + parseInt(b)).toString(16).toUpperCase();
    return '#' + '000000'.slice(hex.length) + hex;
}

function hex2rgb(hex) {
    // this function assumes a valid hex string in the format #RRGGBB
    return {
        red: parseInt(hex.slice(1, 3), 16),
        green: parseInt(hex.slice(3, 5), 16),
        blue: parseInt(hex.slice(5, 7), 16)
    };
}

function rgb2hsv(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    var h, s, v,
        min = Math.min(r, g, b),
        max = Math.max(r, g, b);

    if (min == max) {
        h = 0;
        s = 0;
        v = Math.floor(min * 100);
    }
    else {
        var dif = (r == min) ? g - b : ((b == min) ? r - g : b - r),
            hue = (r == min) ? 3 : ((b == min) ? 1 : 5),
            chr = max - min;

        h = Math.floor((hue - dif / chr) * 60);
        s = Math.floor(chr / max * 100);
        v = Math.floor(max * 100);
    }

    return {
        hue: h,
        sat: s,
        val: v
    };
}

function hsv2rgb(h, s, v) {
    h /= 60;
    s /= 100;
    v /= 100;

    var r, g, b;

    if (s === 0) {
        r = g = b = v;
    }
    else {
        var i = Math.floor(h),
            j = v * (1 - s),
            k = v * (1 - s * (h - i)),
            l = v * (1 - s * (1 - (h - i)));

        if (i == 0) {
            r = v;
            g = l;
            b = j;
        }
        else if (i == 1) {
            r = k;
            g = v;
            b = j;
        }
        else if (i == 2) {
            r = j;
            g = v;
            b = l;
        }
        else if (i == 3) {
            r = j;
            g = k;
            b = v;
        }
        else if (i == 4) {
            r = l;
            g = j;
            b = v;
        }
        else if (i == 5) {
            r = v;
            g = j;
            b = k;
        }
    }

    return {
        red: Math.floor(r * 255),
        green: Math.floor(g * 255),
        blue: Math.floor(b * 255)
    };
}
