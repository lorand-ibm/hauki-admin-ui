interface StorageValue {
  [key: string]:
    | string
    | number
    | boolean
    | ReadonlyArray<string>
    | ReadonlyArray<number>
    | ReadonlyArray<boolean>
    | undefined
    | null;
}

const storeItem = <T>({
  key,
  value,
}: {
  key: string;
  value: T;
}): T | undefined => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return value;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return undefined;
  }
};

const removeItem = (key: string): void => window.localStorage.removeItem(key);

export const localStorage = {
  storeItem,
  removeItem,
};

export default localStorage;
