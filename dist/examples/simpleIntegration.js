"use strict";
/**
 * This example simplifies the integration of the aws4-express middleware into an express application.
 * It demonstrates how to use the awsVerify middleware to authorize incoming requests.
 * The example uses the express.json() middleware to parse the incoming request body.
 * NOTE: aws4 is pretty strict about incoming request headers, so you may need to adjust the headers in your requests.
 * NOTE: the code in this example is for demonstration purposes only and should not be used in production.
 */
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
const express_1 = __importDefault(require("express"));
const aws4_1 = require("aws4");
// FIX ME: change to aws4-express
const index_1 = require("../index"); // 'aws4-express';
const app = (0, express_1.default)();
// whenever you may need to get original body string and you case
// when json parser u may use like this
app.use(express_1.default.json({
    verify: index_1.rawBodyFromVerify,
}));
app.use(index_1.rawBodyFromStream);
const getMySecretByKey = (key) => {
    // fetch secret key from your storage key/secret pairs (sql, nosql, memory)
    // you have to provide your own secret provider here.
    // retrun string | undefined
    const yourSecretsStorage = {
        xyz: 'xyz',
        test: 'test',
        test1: 'test1',
        test2: 'test2',
        test3: 'test3',
    };
    return yourSecretsStorage[key];
};
// main handler to authorization incomming requests:
app.use((0, index_1.awsVerify)({
    enabled: (_req) => true,
    secretKey: (message, _req, _res, _next) => 
    // fetch secret key from your storage key/secret pairs (sql, nosql, memory)
    // you have to provide your own secret provider here.
    // retrun string | undefined
    getMySecretByKey(message.accessKey),
}));
// your routers ...
app.all('*', (req, res, __) => {
    res.send(`${req.method} request through awsVerify middleware`);
});
if (require.main === module) {
    const port = 3000;
    const host = 'localhost';
    app.listen(port, 'localhost', () => __awaiter(void 0, void 0, void 0, function* () {
        // lets test it
        console.info('Testing...');
        // create initial request params
        const params = {
            region: 'eu-central-1',
            service: 'execute-api',
            path: '/',
            method: 'POST',
            host: `${host}:${port}`, // always and should be the same as incomming host
            headers: {
                'Content-Type': 'application/json', // always
            },
            body: JSON.stringify({ id: '123' }),
        };
        // sign params
        (0, aws4_1.sign)(params, {
            accessKeyId: 'xyz',
            secretAccessKey: 'xyz',
        });
        // send request with signed params to express server
        try {
            const response = yield fetch(`http://${host}:${port}`, {
                method: 'POST',
                headers: Object.assign({}, params.headers),
                body: params.body,
            });
            console.info(`HTTP CODE: ${response.status}`);
            console.info(yield response.text());
            process.exit(0);
        }
        catch (e) {
            console.error(e);
            process.exit(1);
        }
    }));
    console.info(`Server started on port ${port}`);
}
//# sourceMappingURL=simpleIntegration.js.map