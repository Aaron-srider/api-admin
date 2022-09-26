const Base64 = require('js-base64').Base64;

export function encode_obj(obj) {
    var new_obj = {};
    for (const attrname in obj) {
        var base64_value = Base64.encode(obj[attrname]);
        new_obj[attrname] = base64_value;
    }
    return new_obj;
}

export function decode_obj(obj) {
    var new_obj = {};
    for (const attrname in obj) {
        var base64_value = Base64.decode(obj[attrname]);
        new_obj[attrname] = base64_value;
    }
    return new_obj;
}
