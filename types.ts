export type DataCache = {
    date: Date,
    data: any
}

export type IStorage = {
    set: (file: string, value: DataCache, encryptionKey?: string) => Promise<void>;
    get: (file: string, encryptionKey?: string) => Promise<DataCache | null>;
    has: (file: string) => Promise<boolean>;
    delete: (...files: string[]) => Promise<void>;
    getFiles: (files?: string[]) => Promise<readonly string[]>;
}

export type MemorizeOptions = {
    isDebug?: boolean
    storage?: IStorage,
    daysToSave: number,
    keyModifier?: (target: any, key: string) => string,
    validator?: (params: any) => boolean,
    encryptionKey?: string
}
