import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { getPortfolioData, updatePortfolioSection } from '../utils/dataManager';

const DataContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const usePortfolio = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error('usePortfolio must be used within a DataProvider');
    return context;
};

/**
 * Loads the portfolio once and shares it with the whole app.
 *
 * saveSection() updates the UI optimistically, writes to the database, and
 * rolls the UI back if the write fails. It resolves to true/false so callers
 * can tell the user what really happened.
 */
export const DataProvider = ({ children }) => {
    const [data, setData] = useState(null);
    const dataRef = useRef(null);

    const commit = useCallback((next) => {
        dataRef.current = next;
        setData(next);
    }, []);

    useEffect(() => {
        let cancelled = false;
        getPortfolioData().then((loaded) => {
            if (!cancelled) commit(loaded);
        });
        return () => {
            cancelled = true;
        };
    }, [commit]);

    const saveSection = useCallback(async (key, value) => {
        const previous = dataRef.current?.[key];
        commit({ ...dataRef.current, [key]: value });
        const ok = await updatePortfolioSection(key, value, { rollbackOnFailure: true });
        if (!ok) commit({ ...dataRef.current, [key]: previous });
        return ok;
    }, [commit]);

    // Replace everything (used after import / reset, which reload the page anyway).
    const replaceAll = useCallback((next) => commit(next), [commit]);

    if (!data) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-100" role="status" aria-live="polite">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
                <span className="sr-only">Loading</span>
            </div>
        );
    }

    return (
        <DataContext.Provider value={{ data, saveSection, replaceAll }}>
            {children}
        </DataContext.Provider>
    );
};
