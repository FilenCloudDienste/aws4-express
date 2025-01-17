"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postExample = exports.getExample = exports.getCredentialsExample = exports.getAwsVerifyOptionsExample = exports.credentialsPairsExample = void 0;
const headers_1 = require("../../headers");
const awsOptions = {
    service: 'execute-api',
    region: 'eu-central-1',
};
exports.credentialsPairsExample = {
    xyz: 'xyz',
    test: 'test',
    test1: 'test1',
    test2: 'test2',
    test3: 'test3',
};
const getAwsVerifyOptionsExample = (sampleData = {}) => Object.assign({
    secretKey: (message) => exports.credentialsPairsExample[message.accessKey],
}, sampleData);
exports.getAwsVerifyOptionsExample = getAwsVerifyOptionsExample;
const getCredentialsExample = (sampleData = {}) => Object.assign({
    accessKeyId: 'xyz',
    secretAccessKey: 'xyz',
}, sampleData);
exports.getCredentialsExample = getCredentialsExample;
const getExample = (sampleData = {}) => Object.assign({
    region: awsOptions.region,
    service: awsOptions.service,
    host: 'my.web.domain.xyz.123567890',
    path: '/query/test?id=testvalue',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip',
        [headers_1.Headers.XAmzDate]: '20230201T065635Z',
        header: 'value',
    },
}, sampleData);
exports.getExample = getExample;
const postExample = (sampleData = {}) => Object.assign({
    region: awsOptions.region,
    service: awsOptions.service,
    host: 'my.web.domain.xyz.123567890',
    path: '/command/test?id=testvalue&val1=1&val2=2',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip',
        [headers_1.Headers.XAmzDate]: '20230201T065635Z',
        header: 'value',
    },
    body: JSON.stringify({
        test1: 'test1',
        test2: {
            test3: {
                test4: 'test4',
                test5: 'test5',
                test6: ['test6', 'test6'],
                test7: ['test7', 'test7', 'test7'],
            },
            test8: 'test8',
        },
        test9: 'test9',
        test10: false,
        test11: true,
    }),
}, sampleData);
exports.postExample = postExample;
//# sourceMappingURL=exampleData.js.map