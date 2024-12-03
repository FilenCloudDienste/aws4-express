"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rawBodyFromStream = exports.rawBodyFromVerify = void 0;
const rawBodyFromVerify = (req, _res, buf, encoding) => {
    var _a;
    req.rawBody = (_a = buf.toString(encoding || 'utf8')) !== null && _a !== void 0 ? _a : '';
};
exports.rawBodyFromVerify = rawBodyFromVerify;
const rawBodyFromStream = (req, _res, next) => {
    if (req.rawBody) {
        return next();
    }
    req.rawBody = '';
    req.setEncoding('utf8');
    req.on('data', (chunk) => {
        req.rawBody += chunk;
    });
    req.on('end', () => {
        next();
    });
    req.on('error', () => {
        next();
    });
};
exports.rawBodyFromStream = rawBodyFromStream;
//# sourceMappingURL=rawBody.js.map