import { formatISO, parseISO } from "date-fns";
import { DateString, DateTimeString } from "./model";

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

export function formatDate(date: Date): DateString {
  return formatISO(date, { representation: "date" }) as DateString;
}

export function formatDateTime(date: Date): DateTimeString {
  return formatISO(date, { representation: "complete" }) as DateTimeString;
}

export function parseDate(dateString: DateString | DateTimeString): Date {
  return parseISO(dateString);
}

export function downloadJSON(data: string, fileName: string) {
  // Create an invisible A element
  const a = document.createElement("a");
  a.style.display = "none";
  document.body.appendChild(a);

  // Set the HREF to a Blob representation of the data to be downloaded
  a.href = window.URL.createObjectURL(
    new Blob([data], { type: "application/json" })
  );

  // Use download attribute to set set desired file name
  a.setAttribute("download", fileName);

  // Trigger the download by simulating click
  a.click();

  // Cleanup
  window.URL.revokeObjectURL(a.href);
  document.body.removeChild(a);
}
