import { Context, createContext, useContext } from 'react';

export type AppContextProps = {
  hasReferrer: boolean;
  closeAppWindow: () => void;
};

export const AppContext: Context<{}> = createContext({});

export function useAppContext(): Partial<AppContextProps> {
  return useContext(AppContext);
}
