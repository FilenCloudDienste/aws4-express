# aws4-express
This library is about to create on security layer of your API using well defined comunication standard known as AWS Signature V4.

We provide Express middleware handler `awsVerify` for validation your `AWS Signature V4` with your access and secret pair of key. So, your web app can mimic AWS services, and you can use benefits from already well-defined standard to securing your web API.

At this moment, library is based on general version of aws4 signature:
[Authenticating Requests (AWS Signature Version 4)](https://docs.aws.amazon.com/AmazonS3/latest/API/sig-v4-authenticating-requests.html)

### Beta stage
Until we hit >=1.x.x, there could be possible breaking changes on minor changes.
Use at least 0.8.0 version.

## Install


```shell
npm install aws4-express
```

## Use

There are prepared helpers to handle the original body with any changes, because if you change a single character, your request won't be valid anymore.

If you use express parsers like `express.raw()` or `express.json()` or `express.urlencoded` you can attach with handler `rawBodyFromVerify`. You can also write own stream parser or use our `rawBodyFromStream`.

```typescript
  import express from 'express';
  import { awsVerify, rawBodyFromVerify, rawBodyFromStream } from 'aws4-express';

  const app = express();
  // whenever you may need to get original body string and you case
  // when json parser u may use like this
  app.use(
    express.json({
      type: '*/*',
      verify: rawBodyFromVerify,
    }),
  );

  // or when json parser u may use like this
  app.use(
    express.raw({
      type: '*/*',
      verify: rawBodyFromVerify,
    })
  );

  // or when url encoded body u may use like this
  app.use(
    express.urlencoded({
      extended: true,
      type: '*/*',
      verify: rawBodyFromVerify,
    }),
  );

  // or events on when json parser u may use like this
  app.use(rawBodyFromStream);

  // main handler to authorization incomming requests:
  app.use(awsVerify({
    secretKey: (message, req, res, next) => {
      // fetch secret key from your storage key/secret pairs (sql, nosql, memory)
      // you have to provide your own secret provider here.
      // retrun string | undefined

      return getMySecretByKey(message.accessKey),
    }
  }));

  // your routers ...
  app.all('*', ...);
  app.get('/get', ...);
  app.post('/post', ...);

  return app;
```

## Example:

- [simpleIntegration.ts](/src/examples/simpleIntegration.ts)

## Features:

- [x] General implementation standard: aws4 signature.
- [x] Fully customized.
- [x] No strict rules on services, regions you can name it as you want as long your signing client support this.
- [x] Single chunk request
- [x] Tests with client: [aws4](https://www.npmjs.com/package/aws4)
- [ ] Query headers x-amz-*,
- [ ] Multiple chunks (no x-amz-decoded-content-length)

## Supported headers:

- `authorization` - [required] must have in proper format: **Authorization: AWS4-HMAC-SHA256
Credential=`ACCESS_KEY`/`DATE`/`REGION`/`SERVICE`/`TYPE_REQUEST`,
SignedHeaders=< SIGNED_HEADERS>,
Signature=`SIGNATURE`** :
  * `ACCESS_KEY` - any text without whitespaces and slashes (/) - Only have to do is handle distribution of access_key, secret_key and these keys have to be accessible on the server side.
  * `DATE` - is part of X-AMZ-DATE: in format YYYYMMDD.
  * `REGION` - any thing you need in this place or use something from [amz regions](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.RegionsAndAvailabilityZones.html).
  * `SERVICE` - any thing you need in this place or 'execute-api' for sake of simplicity.
  * `TYPE_REQUEST` - you can use your variations instead  of standard 'aws4_request'.
  * `SIGNED_HEADERS` - all signed headers - more headers mean harder to temper request. Required headers at this moment: *host:x-amz-date*
  * `SIGNATURE` - calculated signature based on [Authenticating Requests (AWS Signature Version 4)](https://docs.aws.amazon.com/AmazonS3/latest/API/sig-v4-authenticating-requests.html)
- `x-amz-date` - [required] must have in request to valid request signature
- `x-amz-content-sha256` - [optional] you can attach precalculated hash. When X-Amz-Content-Sha256 is sent we skip calculating hash from body. This way is less secure and recommended use at least with `X-Amz-Expires`.
  * There can provide your validation whenever you want handle this header `onBeforeParse` or `onAfterParse`.
  * You can also send `UNSIGNED-PAYLOAD` instead of sha-256 signature - this cloud speed up your bigger request, but signature will be same as long as headers remain same.
  * You can put your signature (most client don't include these headers) - should be calculated in this way:
    ```
    crypto.createHash('sha256').update(data, 'utf8').digest('hex')
    ```
- `x-amz-expires` - [optional] - format: `YYYY-mm-ddTHH:MM:SS`. If you want valid your request for a period of time and don't want to reuse signature when time is up.

Pull Requests are welcome.

## Documentation

```typescript
// FIX ME: create link do .d.ts file
```

### awsVerify:

#### Complete options configuration for `awsVerify`:
```typescript
express.use(awsVerify({
  secretKey: (message: AwsIncomingMessage, req: Request, res: Response, next: NextFunction) => Promise<string | undefined> | string | undefined;
  headers?: (headers: Dictionary) => Promise<Dictionary> | Dictionary;
  enabled?: (req: Request) => Promise<boolean> | boolean;
  onMissingHeaders?: (req: Request, res: Response, next: NextFunction) => Promise<void> | void;
  onSignatureMismatch?: (req: Request, res: Response, next: NextFunction) => Promise<void> | void;
  onExpired?: (req: Request, res: Response, next: NextFunction) => Promise<void> | void;
  onBeforeParse?: (req: Request, res: Response, next: NextFunction) => Promise<boolean> | boolean;
  onAfterParse?: (
    message: AwsIncomingMessage,
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<boolean> | boolean;
  onSuccess?: (
    message: AwsIncomingMessage | undefined,
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void> | void;
}))
```

#### Default values for all optional configuration for `awsVerify`:
```typescript
  {
      enabled: () => true,
      headers: (req) => req.headers,
      onExpired: (res) => {
        res.status(401).send('Request is expired');
      },
      onMissingHeaders: (res) => {
        res.status(400).send('Required headers are missing');
      },
      onSignatureMismatch: (res) => {
        res.status(401).send('The signature does not match');
      },
      onBeforeParse: () => true,
      onAfterParse: () => true,
      onSuccess: () => next()
  }
```


