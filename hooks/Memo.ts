import * as React from 'react'
import { getStorage, } from '..'
import { DataCache, MemorizeOptions } from '../types'
import { days_between } from '../useFull';
const useMomorize = function <T>(key: string, daysToSave: number, defaultValue?: T, props?: Omit<MemorizeOptions, "daysToSave">) {
    const [item, setItem] = React.useState(defaultValue as T);
    const localStorage = React.useRef(props?.storage || getStorage());
    const init = React.useRef(false);
    React.useEffect(() => {
        (async () => {
            let data = await localStorage.current.has(key) ? await localStorage.current.get(key) : undefined;
            if (data && defaultValue) {
                if (days_between(new Date(data.date)) >= daysToSave)
                    data = undefined;
            }

            if (!data && defaultValue) {
                {
                    await localStorage.current.delete(key); 
                    await localStorage.current.set(key, { data: defaultValue, date: new Date() } as DataCache);
                    await setItem(defaultValue)
                }
            } else if (data) setItem(data.data);

            init.current = true;
        })();
    }, []);

    React.useEffect(() => {
        if (!init.current)
            return;
        (async () => {
             await localStorage.current.delete(key); 
            if (item)
                await localStorage.current.set(key, { data: item, date: new Date() } as DataCache);
        })();
    }, [item])

    return [item, setItem];
}

export default useMomorize;

