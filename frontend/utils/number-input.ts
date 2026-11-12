import type { KeyboardEvent } from 'react';

const SIGN_AND_EXPONENT_KEYS = new Set(['e', 'E', '+', '-']);
const DECIMAL_KEYS = new Set(['.', ',']);

export function blockInvalidNumberKeys(event: KeyboardEvent<HTMLInputElement>, allowDecimal = false) {
  if (SIGN_AND_EXPONENT_KEYS.has(event.key) || (!allowDecimal && DECIMAL_KEYS.has(event.key))) {
    event.preventDefault();
  }
}

export function blockInvalidIntegerKeys(event: KeyboardEvent<HTMLInputElement>) {
  blockInvalidNumberKeys(event, false);
}

export function blockInvalidDecimalKeys(event: KeyboardEvent<HTMLInputElement>) {
  blockInvalidNumberKeys(event, true);
}
