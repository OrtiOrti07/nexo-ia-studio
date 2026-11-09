"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/**
 * El año se lee solo en el navegador: así no queda fijado en el HTML
 * prerenderizado (Cache Components no permite `new Date()` durante el prerender).
 */
export function CurrentYear() {
  const year = useSyncExternalStore(
    noop,
    () => new Date().getFullYear(),
    () => null,
  );
  return year === null ? null : <span>{year}</span>;
}
