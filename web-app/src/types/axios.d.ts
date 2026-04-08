import "axios";

declare module "axios" {
    export interface AxiosRequestConfig {
        _retry?: boolean;
        skipAuthRefresh?: boolean;
  ***REMOVED***

    export interface InternalAxiosRequestConfig {
        _retry?: boolean;
        skipAuthRefresh?: boolean;
  ***REMOVED***
}
