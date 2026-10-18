import { ERROR_MESSAGES, FALLBACK_ERROR_MESSAGE } from '@/constants/error-messages';
import { isApiError } from '@/lib/api-error';
import type { FieldPath, FieldValues, UseFormSetError } from 'react-hook-form';

export function getErrorMessage(error: unknown): string {
  if (!isApiError(error)) return FALLBACK_ERROR_MESSAGE;
  const message = ERROR_MESSAGES[error.code] ?? FALLBACK_ERROR_MESSAGE;
  if (error.code === 'RATE_LIMITED' && error.retryAfter) {
    return `${message} (retry in ${error.retryAfter}s)`;
  }
  return message;
}

export function applyFormError<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  fields: readonly FieldPath<T>[],
): void {
  if (isApiError(error)) {
    const fieldErrors = error.details.filter((detail) => detail.field && fields.includes(detail.field as FieldPath<T>));
    fieldErrors.forEach((detail) => setError(detail.field as FieldPath<T>, { message: detail.message }));
    if (fieldErrors.length > 0) return;
  }
  setError('root', { message: getErrorMessage(error) });
}
