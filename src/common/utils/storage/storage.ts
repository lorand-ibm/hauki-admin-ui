// https://gist.github.com/Junscuzzy/59598636c81071fd8c66af092fb02a09

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
