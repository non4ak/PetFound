import axios from 'axios';

import type { ApiProblemDetails } from '@/types/auth';

export function getApiErrorMessage(error: unknown, fallbackMessage: string): string {
  if (axios.isAxiosError<ApiProblemDetails>(error)) {
    const detail: string | undefined = error.response?.data?.detail;

    if (typeof detail === 'string' && detail.trim().length > 0) {
      return detail;
    }

    if (typeof error.message === 'string' && error.message.trim().length > 0) {
      return error.message;
    }
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return fallbackMessage;
}

export function isUnauthorizedApiError(error: unknown): boolean {
  if (!axios.isAxiosError(error)) {
    return false;
  }

  const statusCode: number | undefined = error.response?.status;

  return statusCode === 400 || statusCode === 401;
}
