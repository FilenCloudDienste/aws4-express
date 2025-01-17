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
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiParserRequest = void 0;
const sendSignedRequest_1 = require("./sendSignedRequest");
const multiParserRequest = (optionsAwsVerify, optionsAwsSigned, aws4Credentials, expectedHttpCode, afterSignedRequest, afterAuthorizationSignature) => __awaiter(void 0, void 0, void 0, function* () {
    yield Promise.all(sendSignedRequest_1.parsers
        .filter((p) => p !== 'none')
        .map((p) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, sendSignedRequest_1.sendSignedRequest)(optionsAwsVerify, optionsAwsSigned, { parser: p }, aws4Credentials, expectedHttpCode, afterSignedRequest, afterAuthorizationSignature);
    })));
});
exports.multiParserRequest = multiParserRequest;
//# sourceMappingURL=multiParserRequest.js.map