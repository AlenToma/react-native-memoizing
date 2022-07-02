import Memorize from "./attributes/Memorize";
import { DataCache, IStorage } from "./types";
import Storage from "./cl/Storage";
import useMomorize from './hooks/Memo'

//export default RNMemoizing;
const GlobalStorage = new Storage();
const getStorage = () => GlobalStorage;
export {
    Memorize,
    getStorage,
    useMomorize
};
export type {
    DataCache,
    IStorage
};

