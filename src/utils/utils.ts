export function get<K, V>(map: Map<K, V>, key: K, defaultValue?: V): V {
  const value = map.get(key);
  if (value !== undefined) {
    return value;
  } else {
    if (defaultValue) {
      return defaultValue;
    } else {
      throw new Error(`Key ${key} not found in map!`);
    }
  }
}
