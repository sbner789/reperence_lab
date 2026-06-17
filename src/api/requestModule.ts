import { axiosInstance } from './axiosInstance';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

interface ApiRequestOptions extends AxiosRequestConfig {
  params?: Record<string, any>;
  data?: Record<string, any>;
}

export const requestModule = {
  get: async <T = any>(url: string, params?: Record<string, any>, options?: ApiRequestOptions): Promise<T> => {
    const response: AxiosResponse<T> = await axiosInstance.get(url, { params, ...options });
    return response.data;
  },
  post: async <T = any>(url: string, data?: Record<string, any>, options?: ApiRequestOptions): Promise<T> => {
    const response: AxiosResponse<T> = await axiosInstance.post(url, data, options);
    return response.data;
  },
  put: async <T = any>(url: string, data?: Record<string, any>, options?: ApiRequestOptions): Promise<T> => {
    const response: AxiosResponse<T> = await axiosInstance.put(url, data, options);
    return response.data;
  },
  delete: async <T = any>(url: string, params?: Record<string, any>, options?: ApiRequestOptions): Promise<T> => {
    const response: AxiosResponse<T> = await axiosInstance.delete(url, { params, ...options });
    return response.data;
  },
};
