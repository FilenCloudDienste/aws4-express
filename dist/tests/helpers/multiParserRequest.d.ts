import { Request as Aws4Request, Credentials as Aws4Credentials } from 'aws4';
import { AwsVerifyOptions } from '../..';
export declare const multiParserRequest: (optionsAwsVerify: AwsVerifyOptions, optionsAwsSigned: Aws4Request, aws4Credentials: Aws4Credentials, expectedHttpCode: number, afterSignedRequest?: Aws4Request, afterAuthorizationSignature?: string) => Promise<void>;
