import { Request as Aws4Request, Credentials as Aws4Credentials } from 'aws4';
import { AwsVerifyOptions } from '../../awsSignature';
export declare const credentialsPairsExample: Record<string, string>;
export declare const getAwsVerifyOptionsExample: (sampleData?: Partial<AwsVerifyOptions>) => AwsVerifyOptions;
export declare const getCredentialsExample: (sampleData?: Partial<Aws4Credentials>) => Aws4Credentials;
export declare const getExample: (sampleData?: Partial<Aws4Request>) => Aws4Request;
export declare const postExample: (sampleData?: Partial<Aws4Request>) => Aws4Request;
