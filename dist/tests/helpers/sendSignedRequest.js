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
exports.sendSignedRequest = exports.parsers = exports.methods = void 0;
const express_1 = __importDefault(require("express"));
const supertest_1 = __importDefault(require("supertest"));
const aws4_1 = require("aws4");
const __1 = require("../..");
exports.methods = ['get', 'post', 'put', 'delete'];
exports.parsers = ['json', 'urlencoded', 'raw', 'custom', 'none'];
const expressApp = (optionsAwsVerify, optionsExpress) => {
    var _a;
    const routePath = (_a = optionsExpress.path.substring(0, optionsExpress.path.indexOf('?'))) !== null && _a !== void 0 ? _a : '/';
    const app = (0, express_1.default)();
    switch (optionsExpress.parser) {
        case 'json': {
            app.use(express_1.default.json({
                type: '*/*',
                verify: __1.rawBodyFromVerify,
            }));
            break;
        }
        case 'urlencoded': {
            app.use(express_1.default.urlencoded({
                extended: true,
                type: '*/*',
                verify: __1.rawBodyFromVerify,
            }));
            break;
        }
        case 'raw': {
            app.use(express_1.default.raw({
                type: '*/*',
                verify: __1.rawBodyFromVerify,
            }));
            break;
        }
        case 'none': {
            break;
        }
        case 'custom': {
            app.use(__1.rawBodyFromStream);
            break;
        }
        default: {
            throw new Error('Parser not implemented');
        }
    }
    app.use((0, __1.awsVerify)(optionsAwsVerify));
    app.all(routePath, optionsExpress.testRouter);
    return app;
};
const sendSignedRequest = (optionsAwsVerify, optionsAwsSigned, optionsExpress, aws4Credentials, expectedHttpCode, afterSignedRequest, afterAuthorizationSignature) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    const signedRequest = (0, aws4_1.sign)(optionsAwsSigned, aws4Credentials);
    const modifiedRequest = Object.assign(Object.assign(Object.assign({}, signedRequest), afterSignedRequest), { headers: Object.assign(Object.assign(Object.assign({}, signedRequest.headers), afterSignedRequest === null || afterSignedRequest === void 0 ? void 0 : afterSignedRequest.headers), { ['Authorization']: afterAuthorizationSignature !== null && afterAuthorizationSignature !== void 0 ? afterAuthorizationSignature : (_a = signedRequest.headers) === null || _a === void 0 ? void 0 : _a.Authorization }) });
    const method = (_c = (_b = optionsAwsSigned.method) === null || _b === void 0 ? void 0 : _b.toLowerCase()) !== null && _c !== void 0 ? _c : 'NOT IMPLEMENTED';
    yield (0, supertest_1.default)(expressApp(optionsAwsVerify, Object.assign({ parser: 'json', path: (_d = optionsAwsSigned.path) !== null && _d !== void 0 ? _d : '/', testRouter: (req, res, _next) => {
            res.send(req.query);
        } }, optionsExpress)))[method]((_e = optionsAwsSigned.path) !== null && _e !== void 0 ? _e : '/')
        .set((_f = modifiedRequest.headers) !== null && _f !== void 0 ? _f : {})
        .send(optionsAwsSigned.body)
        .expect(expectedHttpCode);
    return (_g = modifiedRequest.headers) === null || _g === void 0 ? void 0 : _g.Authorization;
});
exports.sendSignedRequest = sendSignedRequest;
//# sourceMappingURL=sendSignedRequest.js.map