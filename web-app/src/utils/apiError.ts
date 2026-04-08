import axios from "axios";

interface ApiProblemDetails {
    detail?: string;
}

export function getApiErrorMessage(error: unknown, fallbackMessage: string): string {
    if (axios.isAxiosError<ApiProblemDetails>(error)) {
        const detail = error.response?.data?.detail;

        if (typeof detail === "string" && detail.trim().length > 0) {
            return detail;
      ***REMOVED***

        if (typeof error.message === "string" && error.message.trim().length > 0) {
            return error.message;
      ***REMOVED***
  ***REMOVED***

    if (error instanceof Error && error.message.trim().length > 0) {
        return error.message;
  ***REMOVED***

    return fallbackMessage;
}
