export function getStorageItem<T>(key: string): T | undefined {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : undefined;
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

export function setStorageItem<T>(key: string, value: T): T | undefined {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return value;
  } catch (error) {
    console.log(error);
    return undefined;
  }
}
