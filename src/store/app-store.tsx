/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useRef,
  useCallback,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import appState from './app-state';
import type { AppState, StoreApi } from '../types/state';

const StoreContext = createContext<StoreApi | null>(null);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const store = useRef<AppState>(appState);
  const subscribers = useRef<Set<() => void>>(new Set());
  const get = useCallback(() => store.current, []);

  const set = useCallback((value: Partial<AppState>) => {
    store.current = { ...store.current, ...value };
    subscribers.current.forEach((callback) => callback());
  }, []);

  const subscribe = useCallback((callback: () => void) => {
    subscribers.current.add(callback);
    return () => subscribers.current.delete(callback);
  }, []);

  const api: StoreApi = {
    get,
    set,
    subscribe,
  };

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
};

/**
 * Hook to select a slice of the store state.
 * @param selector A function that takes the AppState and returns a derived value (S).
 * @returns The selected state value (S).
 */
export const useSelector = <S,>(selector: (state: AppState) => S): S => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useSelector must be used within a StoreProvider');
  }

  const selectedState = useSyncExternalStore(store.subscribe, () =>
    selector(store.get())
  );

  return selectedState;
};

/**
 * Hook to get the dispatch (set) function.
 * This function is stable across renders.
 * @returns The set function to update the store.
 */
export const useDispatch = () => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useDispatch must be used within a StoreProvider');
  }
  return store.set;
};
