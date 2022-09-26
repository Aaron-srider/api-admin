/**
 * Created by PanJiaChen on 16/11/18.
 */

import { Message } from 'element-ui';

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
    if (arguments.length === 0 || !time) {
        return null;
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
    let date;
    if (typeof time === 'object') {
        date = time;
    } else {
        if (typeof time === 'string') {
            if (/^[0-9]+$/.test(time)) {
                // support "1548221490638"
                time = parseInt(time);
            } else {
                // support safari
                // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
                time = time.replace(new RegExp(/-/gm), '/');
            }
        }

        if (typeof time === 'number' && time.toString().length === 10) {
            time = time * 1000;
        }
        date = new Date(time);
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay(),
    };
    const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
        const value = formatObj[key];
        // Note: getDay() returns 0 on Sunday
        if (key === 'a') {
            return ['日', '一', '二', '三', '四', '五', '六'][value];
        }
        return value.toString().padStart(2, '0');
    });
    return time_str;
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
    if (('' + time).length === 10) {
        time = parseInt(time) * 1000;
    } else {
        time = +time;
    }
    const d = new Date(time);
    const now = Date.now();

    const diff = (now - d) / 1000;

    if (diff < 30) {
        return '刚刚';
    } else if (diff < 3600) {
        // less 1 hour
        return Math.ceil(diff / 60) + '分钟前';
    } else if (diff < 3600 * 24) {
        return Math.ceil(diff / 3600) + '小时前';
    } else if (diff < 3600 * 24 * 2) {
        return '1天前';
    }
    if (option) {
        return parseTime(time, option);
    } else {
        return (
            d.getMonth() +
            1 +
            '月' +
            d.getDate() +
            '日' +
            d.getHours() +
            '时' +
            d.getMinutes() +
            '分'
        );
    }
}

export function format_during(millisecond) {
    var days = parseInt(millisecond / (1000 * 60 * 60 * 24));
    var hours = parseInt(
        (millisecond % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    var minutes = parseInt((millisecond % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = parseInt((millisecond % (1000 * 60)) / 1000);
    if (millisecond === 0) {
        return 0;
    }

    if (seconds === 0) {
        return millisecond + 'ms';
    }

    if (minutes === 0) {
        return seconds + 's';
    }

    if (hours === 0) {
        return minutes + 'm';
    }

    if (days === 0) {
        return hours + 'h';
    }

    return days + 'd';
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
    const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ');
    if (!search) {
        return {};
    }
    const obj = {};
    const searchArr = search.split('&');
    searchArr.forEach((v) => {
        const index = v.indexOf('=');
        if (index !== -1) {
            const name = v.substring(0, index);
            const val = v.substring(index + 1, v.length);
            obj[name] = val;
        }
    });
    return obj;
}

export function set_map(map, key, value, vue) {
    map.set(key, value);
    vue.$forceUpdate();
}

export function str_empty(str) {
    return str == undefined || str == '';
}

export function when_unknow_err(code, callback) {
    if (code != undefined) {
        console.log('未知错误，错误码:', code);
        Message.warning(`未知错误，错误码：${code}`);
    }

    if (callback != undefined && typeof callback === 'function') {
        callback();
    }
}

function process_case(value, ...args) {
    if (args.length == 0) {
        console.log(value);
        return;
    }

    var process_func = () => {};
    for (var i = 0; i < args.length; i += 2) {
        var candidate = args[i];
        if (candidate === value) {
            process_func = args[i + 1];
            if (typeof process_func === 'function') {
                process_func(value);
                return;
            }
        }
    }

    var args_num = args.length;
    if (args_num % 2 == 0) {
        // 没有提供默认函数，输出
        console.log(value);
        return;
    }

    var last = args[args.length - 1];
    if (last == undefined || typeof last !== 'function') {
        console.log(value);
        return;
    }

    // 提供了默认函数，执行
    last(value);
}

export class ArrayUtils {
    static remove(array, predicate) {
        let idx = 0;
        for (let i = 0; i < array.length; i++) {
            const item = array[i];
            if (predicate(item) === true) {
                idx = i;
            }
        }

        array.splice(idx, 1);
    }

    static getFirst(array, predicate) {
        for (let i = 0; i < array.length; i++) {
            const item = array[i];
            if (predicate(item) === true) {
                return item;
            }
        }

        return null;
    }
}

export class StringUtils {
    static empty(str) {
        if (str == undefined || str === '') {
            return true;
        }
        return false;
    }

    static isInt(str) {
        let pattern = /^\d*$/;
        return pattern.test(str);
    }
}

// ====================== 关于页面之间query传参 ======================
import { encode_obj, decode_obj } from './base64';

function encode_query(query) {
    return encode_obj(query);
}

export function parse_query(query) {
    return decode_obj(query);
}

export function to_page(router, path, query) {
    if (query != undefined) {
        query = encode_query(query);
    }
    router.push({
        path,
        query,
    });
}
