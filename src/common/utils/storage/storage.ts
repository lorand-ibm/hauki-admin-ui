import { useState } from 'react';

type StorageType = 'session';

export default <T>({
  key,
  initialValue,
  type = 'session',
}: {
  key: string;
  initialValue: T;
  type?: StorageType;
}): [T, (value: T) => void] => {
  const storageApi: Storage =
    type === 'session' ? window.sessionStorage : window.localStorage;

  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = storageApi.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });
  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: T): void => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };
  return [storedValue, setValue];
};
