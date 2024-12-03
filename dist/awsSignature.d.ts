import { BinaryLike, KeyObject } from 'crypto';
import querystring from 'querystring';
import { NextFunction, Request, Response } from 'express';
export type Dictionary = Record<string, string | string[] | undefined>;
/**
 * Middleware configuration
 */
export interface AwsVerifyOptions {
    /**
     * Callback for secretKey. You have to provide process to get proper secret or return undefined secret.
     *
     * @param message { AwsIncomingMessage }
     * @param req { Request }
     * @param res { Response }
     * @param next { NextFunction }
     * @returns { Promise<string | undefined> | string | undefined } - Should return secretKey on incoming parameters - but if secret is missing which it will be normal case when someone want to guess - you should return undefined;
     */
    secretKey: (message: AwsIncomingMessage, req: Request, res: Response, next: NextFunction) => Promise<string | undefined> | string | undefined;
    /**
     * Callback for changes in incoming headers before it goes through parse process. Help to more sophisticated changes to preserve proper headers.
     *
     * @param headers { Dictionary }
     * @returns { Promise<Dictionary> | Dictionary } - Should return fixed incoming headers
     */
    headers?: (headers: Dictionary) => Promise<Dictionary> | Dictionary;
    /**
     * You can skip aws signature validation.
     *
     * @param req { Request }
     * @returns { Promise<boolean> | boolean } If return false will skip aws validation and go to next middleware.
     */
    enabled?: (req: Request) => Promise<boolean> | boolean;
    /**
     * Custom response on header missing. Validation stops here. Default value `onMissingHeaders: () => {
            res.status(400).send('Required headers are missing');
          },`
     *
     * @param req { Request }
     * @param res { Response }
     * @param next { NextFunction }
     * @returns { Promise<void> | void }
     */
    onMissingHeaders?: (req: Request, res: Response, next: NextFunction) => Promise<void> | void;
    /**
     * Custom response on signature mismatch. Validation stops here. Default value `onSignatureMismatch: () => {
            res.status(401).send('The signature does not match');
          },`
     *
     * @param req { Request }
     * @param res { Response }
     * @param next { NextFunction }
     * @returns { Promise<void> | void }
     */
    onSignatureMismatch?: (req: Request, res: Response, next: NextFunction) => Promise<void> | void;
    /**
     * Custom response on exired time signature. Validation stops here. Default value `onExpired: () => {
            res.status(401).send('Request is expired');
          },`
     *
     * @param req { Request }
     * @param res { Response }
     * @param next { NextFunction }
     * @returns  { Promise<void> | void }
     */
    onExpired?: (req: Request, res: Response, next: NextFunction) => Promise<void> | void;
    /**
     * Custom callback before standard parser comes. On false validation stops here. Default value `onBeforeParse: () => true,`
     *
     * @param req { Request }
     * @param res { Response }
     * @param next { NextFunction }
     * @returns  { Promise<boolean> | boolean } Should return true if you need to let parse request further.
     */
    onBeforeParse?: (req: Request, res: Response, next: NextFunction) => Promise<boolean> | boolean;
    /**
     * Custom callback after standard parser done. On false validation stops here. Default value `onAfterParse: () => true,`
     *
     * @param message { AwsIncomingMessage }
     * @param req { Request }
     * @param res { Response }
     * @param next { NextFunction }
     * @returns  { Promise<boolean> | boolean } Should return true if you need to let parse request further.
     */
    onAfterParse?: (message: AwsIncomingMessage, req: Request, res: Response, next: NextFunction) => Promise<boolean> | boolean;
    /**
     * Last callback after when validation signature is done. You can even stop here process. Default value `onSuccess: () => next()`. Dont forget to return next or next(error) or your validation hangs here.
     *
     * @param req { Request }
     * @param res { Response }
     * @param next { NextFunction }
     * @returns  { Promise<void> | void }
     */
    onSuccess?: (message: AwsIncomingMessage | undefined, req: Request, res: Response, next: NextFunction) => Promise<void> | void;
}
/**
 * Parsed Incomming Message
 */
export interface AwsIncomingMessage {
    /**
     * Incoming authorization headers string. Required.
     */
    authorization: string;
    /**
     * DateTime from incoming header. Required.
     */
    xAmzDate: string;
    /**
     * Additional header to set message exiration time even if signature message is valid. Optional.
     */
    xAmzExpires?: number;
    /**
     * Sha256 + formated hex for body. Empty body has own bodyHash. If there is no need to sign body for performance reason you can put UNSIGNED-PAYLOAD in request headers['x-amz-content-sha256'].
     */
    bodyHash: string;
    /**
     * Request path: /..
     */
    path: string;
    /**
     * Query params as key value dictionary;
     */
    query?: Dictionary;
    /**
     * Http method.
     */
    method: string;
    /**
     * accessKey used to sign this message.
     */
    accessKey: string;
    /**
     * Date used in authorization header.
     */
    date: string;
    /**
     * Region used in authorization header. Here can be any value.
     */
    region: string;
    /**
     * Service used in authorization header. Here can be any value.
     */
    service: string;
    /**
     * For aws4 will be aws4_request. Here can be any value.
     */
    requestType: string;
    /**
     * List of signed headers separated with semicolon.
     */
    signedHeaders: string;
    /**
     * Formated encoded header paris.
     */
    canonicalHeaders: string;
}
export declare class AwsSignature {
    protected message?: AwsIncomingMessage;
    protected options?: AwsVerifyOptions;
    private secretKey?;
    constructor();
    verify: (options: AwsVerifyOptions) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
    protected parse: (req: Request, res: Response, next: NextFunction) => Promise<boolean | void>;
    protected authHeader: () => string;
    protected credentialString: () => string;
    protected signature: () => string;
    protected stringToSign: () => string;
    protected canonicalString: () => string;
    protected parsePath: (url: string) => {
        path: string;
        query: querystring.ParsedUrlQuery | undefined;
    };
    protected canonicalQueryString: () => string;
    protected canonicalURI: () => string;
    protected trimAll: (header: string | string[] | undefined) => string | undefined;
    protected encodeRfc3986: (urlEncodedString: string) => string;
    protected encodeRfc3986Full: (str: string) => string;
    protected hmacHex: (secretKey: BinaryLike | KeyObject, data: string) => string;
    protected hmac: (secretKey: BinaryLike | KeyObject, data: string) => Buffer;
    protected hash: (data: string) => string;
    protected hashBuffer: (data: Buffer) => string;
    protected expires: (dateTime: string, expires: number | undefined) => boolean;
}
export declare const awsVerify: (options: AwsVerifyOptions) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
