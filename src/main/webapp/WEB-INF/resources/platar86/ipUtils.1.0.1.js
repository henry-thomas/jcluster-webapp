/* 
 * Copyright (C) 2019 platar86
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var ipUtils = {};

ipUtils.validateIpAddrString = function (ip) {
    if (typeof (ip) !== 'string') {
        return false;
    }
    if (ip.indexOf('/') !== -1) {
        let arr = ip.split('/');
        if (arr.length !== 2) {
            return false;
        } else {
            ip = arr[0];
            let maskBits = arr[1];
            if (isNaN(maskBits)) {
                return false;
            } else {
                let maskBitsNum = Number(maskBits);
                if (maskBitsNum < 1 || maskBitsNum > 31) {
                    return false;
                } else {
//                    let mask = ipUtils.convertMaskBitCountToString(maskBitsNum);
                }
            }
        }
    }

    if (ip.split('.').length !== 4) {
        return false;
    }

    let segArr = ip.split('.');
    for (var i = 0; i < segArr.length; i++) {
        if (isNaN(segArr[i])) {
            return false;
        }
        let num = Number(segArr[i]);
        if (num < 0 || num > 255) {
            return false;
        }
    }
    return true;
};

ipUtils.getIpRangeString = function (ip, mask) {
    let ipNum = ipUtils.convertIpAddressToNumber(ip);
    let mskNum = ~(ipUtils.convertIpAddressToNumber(mask));

    let min = ipNum & ~(mskNum);
    let max = ipNum | mskNum;

    let minStr = ipUtils.convertIpAddressToString(min);
    let maxStr = ipUtils.convertIpAddressToString(max);

    return "[" + minStr + ' - ' + maxStr + ']';
};

ipUtils.validateIpInSameSubnetMaskString = function (ip, mask, compare) {
    let ipNum = ipUtils.convertIpAddressToNumber(ip);
    let maskNum = ipUtils.convertIpAddressToNumber(mask);
    let ipCompNum = ipUtils.convertIpAddressToNumber(compare);
    if (ipNum === undefined || maskNum === undefined || ipCompNum === undefined) {
        return false;
    }
    let ipValidate = ipNum & maskNum;
    let ipComValidate = ipCompNum & maskNum;
    if (ipValidate !== ipComValidate) {
        return false;
    }
    return true;
};

ipUtils.validateIpMaskString = function (ip) {
    if (typeof (ip) !== 'string') {
        return false;
    }

    if (ip.split('.').length !== 4) {
        return false;
    }
    let segArr = ip.split('.');
    let msk = 0;
    for (var i = 0; i < segArr.length; i++) {
        if (isNaN(segArr[i])) {
            return false;
        }
        let num = Number(segArr[i]);
        if (num < 0 || num > 255) {
            return false;
        }
        msk |= (num << ((3 - i) * 8));
    }
    let end = false;
    for (var i = 0; i < 32; i++) {
        if ((msk & (1 << i)) === 0) {
            if (end) {
                return false;
            }
        } else {
            end = true;
        }
    }

    return true;
};

ipUtils.convertMaskToBitCount = function (ip) {
    if (typeof (ip) !== 'string') {
        return false;
    }

    if (ip.split('.').length !== 4) {
        return false;
    }
    let segArr = ip.split('.');
    let msk = 0;
    for (var i = 0; i < segArr.length; i++) {
        if (isNaN(segArr[i])) {
            return false;
        }
        let num = Number(segArr[i]);
        if (num < 0 || num > 255) {
            return false;
        }
        msk |= (num << ((3 - i) * 8));
    }
    let bitCount = 0;
    for (var i = 0; i < 32; i++) {
        if ((msk & (1 << i)) === 0) {
            bitCount++;
        } else {
            return bitCount;
        }
    }

    return 0;
};

ipUtils.convertMaskBitCountToString = function (bitCount) {
    bitCount = 32 - bitCount;
    let maskIvert = 0;
    for (var i = 0; i < bitCount; i++) {
        maskIvert |= 1 << i;
    }
    maskIvert = ~(maskIvert);
    return ipUtils.convertIpAddressToString(maskIvert);
};

ipUtils.convertIpAddressToString = function (ip) {
    let str = "";
    for (var i = 0; i < 4; i++) {
        str += ((ip >> ((3 - i) * 8)) & 0xFF);
        if (i !== 3) {
            str += ".";
        }
    }
    return str;
};


ipUtils.convertIpAddressToNumber = function (ip) {
    if (typeof (ip) !== 'string') {
        return;
    }

    if (ip.split('.').length !== 4) {
        return;
    }
    let segArr = ip.split('.');
    let msk = 0;
    for (var i = 0; i < segArr.length; i++) {
        if (isNaN(segArr[i])) {
            return false;
        }
        let num = Number(segArr[i]);
        if (num < 0 || num > 255) {
            return false;
        }
        msk |= (num << ((3 - i) * 8));
    }
    return msk;
};