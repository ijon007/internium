import { useRef } from "react";

/** Keeps the last non-null value so a sheet can finish its exit animation. */
export function useRetained<T>(value: T | null): T | null {
  const ref = useRef(value);
  if (value !== null) ref.current = value;
  return ref.current;
}
