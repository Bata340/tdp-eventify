import { createContext, useContext } from 'react';

const useContextFactory = (name, context) => {
    return () => {
        const ctx = useContext(context);
        if (ctx === undefined) {
            throw new Error(`use${name}Context debe usarse dentro del ${name}ContextProvider`)
        }

        return ctx;
    }
}

export const GlobalAuthContext = createContext();
export const GlobalAuthActionsContext = createContext();

export const useGlobalAuthContext = useContextFactory('GlobalAuthContext', GlobalAuthContext);
export const useGlobalAuthActionsContext = useContextFactory('GlobalAuthActionsContext', GlobalAuthActionsContext);