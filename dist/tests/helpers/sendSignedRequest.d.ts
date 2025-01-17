import { NextFunction, Request, Response } from 'express';
import { Request as Aws4Request, Credentials as Aws4Credentials } from 'aws4';
import { AwsVerifyOptions } from '../..';
export declare const methods: readonly ["get", "post", "put", "delete"];
export type MethodTypes = (typeof methods)[number];
export declare const parsers: readonly ["json", "urlencoded", "raw", "custom", "none"];
export type ParserTypes = (typeof parsers)[number];
export interface ExpressAppOptions {
    parser: ParserTypes;
    path: string;
    testRouter: (req: Request, res: Response, next: NextFunction) => void;
}
export declare const sendSignedRequest: (optionsAwsVerify: AwsVerifyOptions, optionsAwsSigned: Aws4Request, optionsExpress: Partial<ExpressAppOptions>, aws4Credentials: Aws4Credentials, expectedHttpCode: number, afterSignedRequest?: Aws4Request, afterAuthorizationSignature?: string) => Promise<string | string[] | undefined>;
