export declare const rpcUrls: {
    "1": string;
    "56": string;
    "43114": string;
    "42161": string;
    "31337": string;
    "8453": string;
};
export declare let feeConverterAddresses: {
    "1": string;
    "56": string;
    "43114": string;
    "42161": string;
    "31337": string;
    "8453": string;
};
export declare let portalContractAddresses: {
    "1": string;
    "56": string;
    "43114": string;
    "42161": string;
    "31337": string;
    "8453": string;
};
export declare const networkConfigs: {
    readonly "1": {
        readonly rpcUrl: string;
        readonly feeConverterAddress: string;
        readonly portalContractAddress: string;
    };
    readonly "56": {
        readonly rpcUrl: string;
        readonly feeConverterAddress: string;
        readonly portalContractAddress: string;
    };
    readonly "43114": {
        readonly rpcUrl: string;
        readonly feeConverterAddress: string;
        readonly portalContractAddress: string;
    };
    readonly "42161": {
        readonly rpcUrl: string;
        readonly feeConverterAddress: string;
        readonly portalContractAddress: string;
    };
    readonly "31337": {
        readonly rpcUrl: string;
        readonly feeConverterAddress: string;
        readonly portalContractAddress: string;
    };
    readonly "8453": {
        readonly rpcUrl: string;
        readonly feeConverterAddress: string;
        readonly portalContractAddress: string;
    };
};
export declare const feeConverterABI: string[];
export declare const portalABI: string[];
export type SupportedChainIds = keyof typeof networkConfigs;
