"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.awsVerify = exports.AwsSignature = void 0;
const crypto_1 = __importDefault(require("crypto"));
const querystring_1 = __importDefault(require("querystring"));
const headers_1 = require("./headers");
class AwsSignature {
    constructor() {
        this.verify = (options) => (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g;
            try {
                this.options = Object.assign({ enabled: () => true, headers: () => req.headers, onExpired: () => {
                        res.status(401).send('Request is expired');
                    }, onMissingHeaders: () => {
                        res.status(400).send('Required headers are missing');
                    }, onSignatureMismatch: () => {
                        res.status(401).send('The signature does not match');
                    }, onBeforeParse: () => true, onAfterParse: () => true, onSuccess: () => next() }, options);
                if (yield ((_b = (_a = this.options).enabled) === null || _b === void 0 ? void 0 : _b.call(_a, req))) {
                    if (!(yield this.parse(req, res, next))) {
                        return;
                    }
                    const calculatedAuthorization = this.authHeader();
                    if (calculatedAuthorization !== ((_c = this.message) === null || _c === void 0 ? void 0 : _c.authorization)) {
                        return (_e = (_d = this.options).onSignatureMismatch) === null || _e === void 0 ? void 0 : _e.call(_d, req, res, next);
                    }
                }
                return (_g = (_f = this.options).onSuccess) === null || _g === void 0 ? void 0 : _g.call(_f, this === null || this === void 0 ? void 0 : this.message, req, res, next);
            }
            catch (error) {
                return next(error);
            }
        });
        this.parse = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
            if (!this.options) {
                throw new Error('Missing options setup');
            }
            if (!(yield ((_b = (_a = this.options).onBeforeParse) === null || _b === void 0 ? void 0 : _b.call(_a, req, res, next)))) {
                return false;
            }
            // Get the AWS signature v4 headers from the request
            const authorization = req.header(headers_1.Headers.Authorization);
            const xAmzDate = req.header(headers_1.Headers.XAmzDate);
            const xAmzExpires = Number(req.header(headers_1.Headers.XAmzExpires));
            const contentSha256 = req.header(headers_1.Headers.XAmzContentSha256);
            const bodyHash = contentSha256 || this.hashBuffer((_c = req.rawBody) !== null && _c !== void 0 ? _c : '');
            const { path, query } = this.parsePath(req.url);
            const method = req.method;
            // Check if the required headers are present
            if (!authorization || !xAmzDate) {
                return (_e = (_d = this.options).onMissingHeaders) === null || _e === void 0 ? void 0 : _e.call(_d, req, res, next);
            }
            // Expires? use xAmzExpires [seconds] to calculate
            // if xAmzExpires not set will be ignored.
            const expired = this.expires(xAmzDate, xAmzExpires);
            if (expired) {
                return yield ((_g = (_f = this.options).onExpired) === null || _g === void 0 ? void 0 : _g.call(_f, req, res, next));
            }
            // Extract the necessary information from the authorization header
            const [, credentialRaw, signedHeadersRaw, _signatureRaw] = authorization.split(/\s+/);
            const credential = (_j = (_h = /=([^,]*)/.exec(credentialRaw)) === null || _h === void 0 ? void 0 : _h[1]) !== null && _j !== void 0 ? _j : ''; // credential.split('=');
            const signedHeaders = (_l = (_k = /=([^,]*)/.exec(signedHeadersRaw)) === null || _k === void 0 ? void 0 : _k[1]) !== null && _l !== void 0 ? _l : '';
            const [accessKey, date, region, service, requestType] = credential.split('/');
            const incommingHeaders = this.options.headers ? yield this.options.headers(req.headers) : req.headers;
            const canonicalHeaders = signedHeaders
                .split(';')
                .map((key) => key.toLowerCase() + ':' + this.trimAll(incommingHeaders[key]))
                .join('\n');
            if (!accessKey ||
                !bodyHash ||
                !canonicalHeaders ||
                !date ||
                !method ||
                !path ||
                !region ||
                !requestType ||
                !service ||
                !signedHeaders ||
                !xAmzDate) {
                yield ((_o = (_m = this.options).onSignatureMismatch) === null || _o === void 0 ? void 0 : _o.call(_m, req, res, next));
                return false;
            }
            this.message = {
                accessKey,
                authorization,
                bodyHash,
                canonicalHeaders,
                date,
                method,
                path,
                region,
                requestType,
                query,
                service,
                signedHeaders,
                xAmzDate,
                xAmzExpires,
            };
            this.secretKey = yield this.options.secretKey(this.message, req, res, next);
            if (!this.secretKey) {
                yield ((_q = (_p = this.options).onSignatureMismatch) === null || _q === void 0 ? void 0 : _q.call(_p, req, res, next));
                return false;
            }
            if (!(yield ((_s = (_r = this.options).onAfterParse) === null || _s === void 0 ? void 0 : _s.call(_r, this.message, req, res, next)))) {
                return false;
            }
            return true;
        });
        this.authHeader = () => {
            if (!this.message) {
                throw new Error('Missing parsed incoming message');
            }
            return [
                'AWS4-HMAC-SHA256 Credential=' + this.message.accessKey + '/' + this.credentialString(),
                'SignedHeaders=' + this.message.signedHeaders,
                'Signature=' + this.signature(),
            ].join(', ');
        };
        this.credentialString = () => {
            var _a, _b, _c, _d;
            if (!this.message) {
                throw new Error('Missing parsed incoming message');
            }
            return [(_a = this.message) === null || _a === void 0 ? void 0 : _a.date, (_b = this.message) === null || _b === void 0 ? void 0 : _b.region, (_c = this.message) === null || _c === void 0 ? void 0 : _c.service, (_d = this.message) === null || _d === void 0 ? void 0 : _d.requestType].join('/');
        };
        this.signature = () => {
            if (!this.message || !this.secretKey) {
                throw new Error('Missing parsed incoming message');
            }
            const hmacDate = this.hmac('AWS4' + this.secretKey, this.message.date);
            const hmacRegion = this.hmac(hmacDate, this.message.region);
            const hmacService = this.hmac(hmacRegion, this.message.service);
            const hmacCredentials = this.hmac(hmacService, 'aws4_request');
            return this.hmacHex(hmacCredentials, this.stringToSign());
        };
        this.stringToSign = () => {
            if (!this.message) {
                throw new Error('Missing parsed incoming message');
            }
            return ['AWS4-HMAC-SHA256', this.message.xAmzDate, this.credentialString(), this.hash(this.canonicalString())].join('\n');
        };
        this.canonicalString = () => {
            if (!this.message) {
                throw new Error('Missing parsed incoming message');
            }
            return [
                this.message.method,
                this.canonicalURI(),
                this.canonicalQueryString(),
                this.message.canonicalHeaders + '\n',
                this.message.signedHeaders,
                this.message.bodyHash,
            ].join('\n');
        };
        this.parsePath = (url) => {
            let path = url || '/';
            if (/[^0-9A-Za-z;,/?:@&=+$\-_.!~*'()#%]/.test(path)) {
                path = encodeURI(decodeURI(path));
            }
            const queryIx = path.indexOf('?');
            let query;
            if (queryIx >= 0) {
                query = querystring_1.default.parse(path.slice(queryIx + 1));
                path = path.slice(0, queryIx);
            }
            return {
                path,
                query,
            };
        };
        this.canonicalQueryString = () => {
            if (!this.message) {
                throw new Error('Missing parsed incoming message');
            }
            if (!this.message.query) {
                return '';
            }
            const reducedQuery = Object.keys(this.message.query).reduce((obj, key) => {
                var _a, _b;
                if (!key) {
                    return obj;
                }
                obj[this.encodeRfc3986Full(key)] = (_b = (_a = this.message) === null || _a === void 0 ? void 0 : _a.query) === null || _b === void 0 ? void 0 : _b[key];
                return obj;
            }, {});
            const encodedQueryPieces = [];
            Object.keys(reducedQuery)
                .sort()
                .forEach((key) => {
                var _a, _b, _c, _d;
                if (!Array.isArray(reducedQuery[key])) {
                    encodedQueryPieces.push(key + '=' + this.encodeRfc3986Full((_a = reducedQuery[key]) !== null && _a !== void 0 ? _a : ''));
                }
                else {
                    (_d = (_c = (_b = reducedQuery[key]) === null || _b === void 0 ? void 0 : _b.map(this.encodeRfc3986Full)) === null || _c === void 0 ? void 0 : _c.sort()) === null || _d === void 0 ? void 0 : _d.forEach((val) => {
                        encodedQueryPieces.push(key + '=' + val);
                    });
                }
            });
            return encodedQueryPieces.join('&');
        };
        this.canonicalURI = () => {
            if (!this.message) {
                throw new Error('Missing parsed incoming message');
            }
            let pathStr = this.message.path;
            if (pathStr !== '/') {
                pathStr = pathStr.replace(/\/{2,}/g, '/');
                pathStr = pathStr
                    .split('/')
                    .reduce((_path, piece) => {
                    if (piece === '..') {
                        _path.pop();
                    }
                    else if (piece !== '.') {
                        _path.push(this.encodeRfc3986Full(piece));
                    }
                    return _path;
                }, [])
                    .join('/');
                if (pathStr[0] !== '/') {
                    pathStr = '/' + pathStr;
                }
            }
            return pathStr;
        };
        this.trimAll = (header) => header === null || header === void 0 ? void 0 : header.toString().trim().replace(/\s+/g, ' ');
        this.encodeRfc3986 = (urlEncodedString) => urlEncodedString.replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase());
        this.encodeRfc3986Full = (str) => this.encodeRfc3986(encodeURIComponent(str));
        this.hmacHex = (secretKey, data) => crypto_1.default.createHmac('sha256', secretKey).update(data, 'utf8').digest('hex');
        this.hmac = (secretKey, data) => crypto_1.default.createHmac('sha256', secretKey).update(data, 'utf8').digest();
        this.hash = (data) => crypto_1.default.createHash('sha256').update(data, 'utf8').digest('hex');
        this.hashBuffer = (data) => crypto_1.default.createHash('sha256').update(data).digest('hex');
        this.expires = (dateTime, expires) => {
            if (!expires) {
                return false;
            }
            const stringISO8601 = dateTime.replace(/^(.{4})(.{2})(.{2})T(.{2})(.{2})(.{2})Z$/, '$1-$2-$3T$4:$5:$6Z');
            const localDateTime = new Date(stringISO8601);
            localDateTime.setSeconds(localDateTime.getSeconds(), expires);
            return localDateTime < new Date();
        };
    }
}
exports.AwsSignature = AwsSignature;
const awsVerify = (options) => new AwsSignature().verify(options);
exports.awsVerify = awsVerify;
//# sourceMappingURL=awsSignature.js.map