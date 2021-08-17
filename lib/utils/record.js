"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reverseRecord = void 0;
function reverseRecord(record) {
    return Object.entries(record)
        .reduce((p, [str, val]) => (Object.assign(Object.assign({}, p), { [val]: str })), {});
}
exports.reverseRecord = reverseRecord;
