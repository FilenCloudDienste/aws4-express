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
const sinon_1 = __importDefault(require("sinon"));
const headers_1 = require("../headers");
const exampleData_1 = require("./helpers/exampleData");
const multiParserRequest_1 = require("./helpers/multiParserRequest");
describe('awsVerify', () => {
    let sandbox;
    let clock;
    beforeEach(() => {
        sandbox = sinon_1.default.createSandbox();
        clock = sinon_1.default.useFakeTimers(new Date('2023-01-01T00:00:00Z'));
    });
    afterEach(() => {
        sandbox.restore();
        clock.restore();
    });
    after(() => { });
    it('should validate GET request with aws4 signature', () => __awaiter(void 0, void 0, void 0, function* () {
        const optionsAwsVerify = (0, exampleData_1.getAwsVerifyOptionsExample)();
        const optionsAwsSigned = (0, exampleData_1.getExample)();
        const credentials = (0, exampleData_1.getCredentialsExample)();
        yield (0, multiParserRequest_1.multiParserRequest)(optionsAwsVerify, optionsAwsSigned, credentials, 200);
    }));
    it('should validate POST request with aws4 signature', () => __awaiter(void 0, void 0, void 0, function* () {
        const optionsAwsVerify = (0, exampleData_1.getAwsVerifyOptionsExample)();
        const optionsAwsSigned = (0, exampleData_1.postExample)();
        const credentials = (0, exampleData_1.getCredentialsExample)();
        yield (0, multiParserRequest_1.multiParserRequest)(optionsAwsVerify, optionsAwsSigned, credentials, 200);
    }));
    it('should validate PUT request with aws4 signature', () => __awaiter(void 0, void 0, void 0, function* () {
        const optionsAwsVerify = (0, exampleData_1.getAwsVerifyOptionsExample)();
        const optionsAwsSigned = (0, exampleData_1.postExample)();
        const credentials = (0, exampleData_1.getCredentialsExample)();
        yield (0, multiParserRequest_1.multiParserRequest)(optionsAwsVerify, optionsAwsSigned, Object.assign({}, credentials), 200);
    }));
    it('should validate DELETE request with aws4 signature', () => __awaiter(void 0, void 0, void 0, function* () {
        const optionsAwsVerify = (0, exampleData_1.getAwsVerifyOptionsExample)();
        const optionsAwsSigned = (0, exampleData_1.postExample)();
        const credentials = (0, exampleData_1.getCredentialsExample)();
        yield (0, multiParserRequest_1.multiParserRequest)(optionsAwsVerify, optionsAwsSigned, credentials, 200);
    }));
    it('should validate GET request with aws4 signature with credentials available on server side', () => __awaiter(void 0, void 0, void 0, function* () {
        const optionsAwsVerify = (0, exampleData_1.getAwsVerifyOptionsExample)();
        const options = (0, exampleData_1.getExample)();
        const keys = Object.keys(exampleData_1.credentialsPairsExample).map((k) => ({
            accessKey: k,
            secretKey: exampleData_1.credentialsPairsExample[k],
        }));
        yield Promise.all(keys.map((k) => (0, multiParserRequest_1.multiParserRequest)(optionsAwsVerify, options, { accessKeyId: k.accessKey, secretAccessKey: k.secretKey }, 200)));
    }));
    it('should validate GET request with aws4 signature with reversed querystring', () => __awaiter(void 0, void 0, void 0, function* () {
        const optionsAwsVerify = (0, exampleData_1.getAwsVerifyOptionsExample)();
        const options = (0, exampleData_1.getExample)({
            path: '/get?z=1&y=1000&x=test&s=1000',
        });
        const credentials = (0, exampleData_1.getCredentialsExample)({});
        yield (0, multiParserRequest_1.multiParserRequest)(optionsAwsVerify, options, credentials, 200);
    }));
    it('should not validate request with aws4 signature incorrect credentials', () => __awaiter(void 0, void 0, void 0, function* () {
        const optionsAwsVerify = (0, exampleData_1.getAwsVerifyOptionsExample)();
        const options = (0, exampleData_1.getExample)();
        yield (0, multiParserRequest_1.multiParserRequest)(optionsAwsVerify, options, { accessKeyId: 'xyz', secretAccessKey: 'test' }, 401);
        yield (0, multiParserRequest_1.multiParserRequest)(optionsAwsVerify, options, { accessKeyId: 'test', secretAccessKey: 'test1' }, 401);
        yield (0, multiParserRequest_1.multiParserRequest)(optionsAwsVerify, options, { accessKeyId: '1', secretAccessKey: '2' }, 401);
        yield (0, multiParserRequest_1.multiParserRequest)(optionsAwsVerify, options, { accessKeyId: '1', secretAccessKey: undefined }, 401);
    }));
    it('should validate request with aws4 body unsigned with UNSIGNED-PAYLOAD', () => __awaiter(void 0, void 0, void 0, function* () {
        const optionsAwsVerify = (0, exampleData_1.getAwsVerifyOptionsExample)();
        const optionsAwsSigned = (0, exampleData_1.postExample)({
            headers: Object.assign(Object.assign({}, (0, exampleData_1.postExample)().headers), { 'x-amz-content-sha256': 'UNSIGNED-PAYLOAD' }),
        });
        const credentials = (0, exampleData_1.getCredentialsExample)();
        yield (0, multiParserRequest_1.multiParserRequest)(optionsAwsVerify, optionsAwsSigned, credentials, 200);
    }));
    it('should validate request with aws4 with time greater than now', () => __awaiter(void 0, void 0, void 0, function* () {
        const optionsAwsVerify = (0, exampleData_1.getAwsVerifyOptionsExample)();
        const optionsAwsSigned = (0, exampleData_1.postExample)({
            headers: Object.assign(Object.assign({}, (0, exampleData_1.postExample)().headers), { [headers_1.Headers.XAmzExpires]: '60', [headers_1.Headers.XAmzDate]: '20230202T000000Z' }),
        });
        const credentials = (0, exampleData_1.getCredentialsExample)();
        yield (0, multiParserRequest_1.multiParserRequest)(optionsAwsVerify, optionsAwsSigned, credentials, 200);
    }));
    it('should validate request with aws4 with time equal now', () => __awaiter(void 0, void 0, void 0, function* () {
        const optionsAwsVerify = (0, exampleData_1.getAwsVerifyOptionsExample)();
        const optionsAwsSigned = (0, exampleData_1.postExample)({
            headers: Object.assign(Object.assign({}, (0, exampleData_1.postExample)().headers), { [headers_1.Headers.XAmzExpires]: '60', [headers_1.Headers.XAmzDate]: '20230101T000100Z' }),
        });
        const credentials = (0, exampleData_1.getCredentialsExample)();
        yield (0, multiParserRequest_1.multiParserRequest)(optionsAwsVerify, optionsAwsSigned, credentials, 200);
    }));
    it('should not validate request with aws4 with time lesser than now', () => __awaiter(void 0, void 0, void 0, function* () {
        const optionsAwsVerify = (0, exampleData_1.getAwsVerifyOptionsExample)();
        const optionsAwsSigned = (0, exampleData_1.postExample)({
            headers: Object.assign(Object.assign({}, (0, exampleData_1.postExample)().headers), { [headers_1.Headers.XAmzExpires]: '60', [headers_1.Headers.XAmzDate]: '20220101T000000Z' }),
        });
        const credentials = (0, exampleData_1.getCredentialsExample)();
        yield (0, multiParserRequest_1.multiParserRequest)(optionsAwsVerify, optionsAwsSigned, credentials, 401);
    }));
    it('should validate request with aws4 on ignore validation', () => __awaiter(void 0, void 0, void 0, function* () {
        const optionsAwsVerify = (0, exampleData_1.getAwsVerifyOptionsExample)({
            enabled: () => false,
        });
        const optionsAwsSigned = (0, exampleData_1.postExample)();
        const credentials = (0, exampleData_1.getCredentialsExample)();
        yield (0, multiParserRequest_1.multiParserRequest)(optionsAwsVerify, optionsAwsSigned, credentials, 200);
    }));
    it('should validate request with aws4 when original host was replaced by routers inside your network', () => __awaiter(void 0, void 0, void 0, function* () {
        const optionsAwsVerify = (0, exampleData_1.getAwsVerifyOptionsExample)({
            headers: (headers) => {
                headers.host = headers['x-forwarded-host'];
                return headers;
            },
        });
        const optionsAwsSigned = (0, exampleData_1.postExample)();
        const credentials = (0, exampleData_1.getCredentialsExample)();
        const afterSignedRequest = Object.assign(Object.assign({}, optionsAwsSigned), { host: 'nginx.local.corporate.router', headers: Object.assign(Object.assign({}, optionsAwsSigned.headers), { host: 'nginx.local.corporate.router', 'x-forwarded-host': optionsAwsSigned.host }) });
        yield (0, multiParserRequest_1.multiParserRequest)(optionsAwsVerify, optionsAwsSigned, credentials, 200, afterSignedRequest);
    }));
    it('should not validate request with aws4 with replaced host', () => __awaiter(void 0, void 0, void 0, function* () {
        const optionsAwsVerify = (0, exampleData_1.getAwsVerifyOptionsExample)({});
        const optionsAwsSigned = (0, exampleData_1.postExample)();
        const credentials = (0, exampleData_1.getCredentialsExample)();
        const afterSignedRequest = Object.assign(Object.assign({}, optionsAwsSigned), { host: 'nginx.local.corporate.router', headers: Object.assign(Object.assign({}, optionsAwsSigned.headers), { host: 'nginx.local.corporate.router', 'x-forwarded-host': optionsAwsSigned.host }) });
        yield (0, multiParserRequest_1.multiParserRequest)(optionsAwsVerify, optionsAwsSigned, credentials, 401, afterSignedRequest);
    }));
    it('should not validate request with incorrect authorization header', () => __awaiter(void 0, void 0, void 0, function* () {
        const optionsAwsVerify = (0, exampleData_1.getAwsVerifyOptionsExample)({});
        const optionsAwsSigned = (0, exampleData_1.postExample)();
        const credentials = (0, exampleData_1.getCredentialsExample)();
        const strangeAuthorizationHeaders = [
            'AWS4-HMAC-SHA256 Credential=xyz/20230208/eu-central-1/execute-api/aws4_request, SignedHeaders=accept-encoding;cache-control;content-length;content-type;host;user-agent;x-amz-date, Signature=0230022437e5f1b668997ede2e55d4b00c7a3af802d000a2788d7b3c057503a4',
            'AWS4-HMAC-SHA256 Credential=test/2011/us-east-1/execute-api/aws4_request, SignedHeaders=accept-encoding;cache-control;content-length;content-type;host;user-agent;x-amz-date, Signature=0230022437e5f1b668997ede2e55d4b00c7a3af802d000a2788d7b3c057503a4',
            'AWS4-HMAC-SHA256',
            'AWS4-HMAC-SHA256 Credential=xyz',
            'AWS4-HMAC-SHA256 Credential=xyz/20230208',
            'AWS4-HMAC-SHA256 Credential=xyz/20230208/eu-central-1',
            'AWS4-HMAC-SHA256 Credential=xyz/20230208/eu-central-1/execute-api',
            'AWS4-HMAC-SHA256 Credential=xyz/20230208/eu-central-1/execute-api/aws4_request',
            'AWS4-HMAC-SHA256 Credential=xyz/20230208/eu-central-1/execute-api/aws4_request, SignedHeaders=accept-encoding;cache-control',
        ];
        yield Promise.all(strangeAuthorizationHeaders.map((modifiedAuthorization) => __awaiter(void 0, void 0, void 0, function* () {
            return yield (0, multiParserRequest_1.multiParserRequest)(optionsAwsVerify, optionsAwsSigned, credentials, 401, undefined, modifiedAuthorization);
        })));
    }));
    it('should not validate request with aws4 onBeforeParse when limit api', () => __awaiter(void 0, void 0, void 0, function* () {
        const optionsAwsVerify = (0, exampleData_1.getAwsVerifyOptionsExample)({
            onBeforeParse: (_req, res, _next) => {
                res.status(429).send('Api limit');
                return false;
            },
        });
        const optionsAwsSigned = (0, exampleData_1.postExample)();
        const credentials = (0, exampleData_1.getCredentialsExample)();
        yield (0, multiParserRequest_1.multiParserRequest)(optionsAwsVerify, optionsAwsSigned, credentials, 429);
    }));
    it('should not validate request with aws4 onAfterParse when limit api', () => __awaiter(void 0, void 0, void 0, function* () {
        const optionsAwsVerify = (0, exampleData_1.getAwsVerifyOptionsExample)({
            onAfterParse: (_message, _req, res, _next) => {
                res.status(429).send('Api limit');
                return false;
            },
        });
        const optionsAwsSigned = (0, exampleData_1.postExample)();
        const credentials = (0, exampleData_1.getCredentialsExample)();
        yield (0, multiParserRequest_1.multiParserRequest)(optionsAwsVerify, optionsAwsSigned, credentials, 429);
    }));
    it('should not validate request with aws4 onSuccess something goes wrong and need to notify user', () => __awaiter(void 0, void 0, void 0, function* () {
        const optionsAwsVerify = (0, exampleData_1.getAwsVerifyOptionsExample)({
            onSuccess: (_message, _req, res, _next) => {
                res.status(500).send('Server error');
            },
        });
        const optionsAwsSigned = (0, exampleData_1.postExample)();
        const credentials = (0, exampleData_1.getCredentialsExample)();
        yield (0, multiParserRequest_1.multiParserRequest)(optionsAwsVerify, optionsAwsSigned, credentials, 500);
    }));
    it('should not validate request with aws4 onExpired header', () => __awaiter(void 0, void 0, void 0, function* () {
        const optionsAwsVerify = (0, exampleData_1.getAwsVerifyOptionsExample)({
            onExpired: (_req, res, _next) => {
                res.status(408).send('Request expired.');
            },
        });
        const optionsAwsSigned = (0, exampleData_1.postExample)({
            headers: Object.assign(Object.assign({}, (0, exampleData_1.postExample)().headers), { [headers_1.Headers.XAmzExpires]: '60', [headers_1.Headers.XAmzDate]: '20220101T000000Z' }),
        });
        const credentials = (0, exampleData_1.getCredentialsExample)();
        yield (0, multiParserRequest_1.multiParserRequest)(optionsAwsVerify, optionsAwsSigned, credentials, 408);
    }));
    it('should not validate request with aws4 missing authorization and xAmzDate', () => __awaiter(void 0, void 0, void 0, function* () {
        const optionsAwsVerify = (0, exampleData_1.getAwsVerifyOptionsExample)({
            onMissingHeaders: (_req, res, _next) => {
                res.status(417).send('Expectation failed');
            },
        });
        const optionsAwsSigned = (0, exampleData_1.postExample)();
        const credentials = (0, exampleData_1.getCredentialsExample)();
        const afterSignedRequest = Object.assign(Object.assign({}, optionsAwsSigned), { headers: Object.assign(Object.assign({}, optionsAwsSigned.headers), { 'X-Amz-Date': '' }) });
        yield (0, multiParserRequest_1.multiParserRequest)(optionsAwsVerify, optionsAwsSigned, credentials, 417, afterSignedRequest, '');
    }));
    it('should not validate request with aws4 mismatch signature', () => __awaiter(void 0, void 0, void 0, function* () {
        const optionsAwsVerify = (0, exampleData_1.getAwsVerifyOptionsExample)({
            onSignatureMismatch: (_req, res, _next) => {
                res.status(400).send('Invalid Signature');
            },
        });
        const optionsAwsSigned = (0, exampleData_1.postExample)();
        const credentials = (0, exampleData_1.getCredentialsExample)();
        const authorization = 'AWS4-HMAC-SHA256 Credential=test/2011/us-east-1/execute-api/aws4_request, SignedHeaders=accept-encoding;cache-control;content-length;content-type;host;user-agent;x-amz-date, Signature=0230022437e5f1b668997ede2e55d4b00c7a3af802d000a2788d7b3c057503a4';
        yield (0, multiParserRequest_1.multiParserRequest)(optionsAwsVerify, optionsAwsSigned, credentials, 400, undefined, authorization);
    }));
});
//# sourceMappingURL=awsVerify.spec.js.map