var RandomGen = (function () {
    function RandomGen() {
        this.seed = Math.floor(Math.random() * 1000);
    }
    RandomGen.prototype.SetSeedFromKeyStr = function (keyStr) {
        var seed = 0;
        for (var i = 0; i < keyStr.length; i++) {
            var ch = keyStr.charCodeAt(i);
            seed = ch + (seed << 6) + (seed << 16) - seed;
        }
        this.seed = Math.abs(seed);
    };
    RandomGen.prototype.Next = function () {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return this.seed / 233280;
    };
    RandomGen.prototype.NextInt = function (min, max) {
        min = min || 0;
        max = max || 1;
        this.seed = (this.seed * 9301 + 49297) % 233280;
        var rnd = this.seed / 233280;
        var val = Math.round(min + rnd * (max - min));
        if (val < min) {
            return min;
        }
        if (val > max) {
            return max;
        }
        return val;
    };
    RandomGen.prototype.Chance = function (probability) {
        return this.Next() < probability;
    };
    return RandomGen;
}());
function GetRandomBase64Str(minLength, maxLength) {
    var rand = new RandomGen();
    var len = rand.NextInt(minLength, maxLength);
    var str = "";
    for (var i = 0; i < len; i++) {
        str += GetBase64Char(rand.NextInt(0, 63));
    }
    return str;
}
function Base64ToInt(ch) {
    var i = ch.charCodeAt(0);
    if (i >= 65 && i <= 90) {
        return i - 65;
    }
    if (i >= 97 && i <= 122) {
        return i - 71;
    }
    if (i >= 48 && i <= 57) {
        return i + 5;
    }
    if (i == 43) {
        return 62;
    }
    if (i == 47) {
        return 63;
    }
    return 0;
}
function GetBase64Char(chIdx) {
    if (chIdx >= 0 && chIdx <= 25) {
        return String.fromCharCode(65 + chIdx);
    }
    if (chIdx >= 26 && chIdx <= 51) {
        return String.fromCharCode(97 + chIdx - 26);
    }
    if (chIdx >= 52 && chIdx <= 61) {
        return String.fromCharCode(48 + chIdx - 52);
    }
    if (chIdx == 62) {
        return "+";
    }
    if (chIdx == 63) {
        return "/";
    }
    return "";
}
function ClipValue(value, min, max) {
    if (value < min) {
        return min;
    }
    if (value > max) {
        return max;
    }
    return value;
}
function RatioToPercent(val) { return "" + Math.round(val * 100); }
//# sourceMappingURL=PcMath.js.map