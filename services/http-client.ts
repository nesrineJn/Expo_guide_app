import { HttpClientAbstract } from '@gofiled/react-ui';
import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { CONSTANTS } from "@/utils/constants"
import { idpStoragePersister } from '../utils/offlineStorage';

/**
 *
 */

export class BaseHttpClient extends HttpClientAbstract {
  constructor() {
    super(CONSTANTS.APP_CONFIG.API_URL);
  }
  handleRequest(config: InternalAxiosRequestConfig<any>): InternalAxiosRequestConfig<any> {


    const jwtResponse = idpStoragePersister.getTokenResponse();
    if (jwtResponse) {
      config.headers!['Authorization'] = jwtResponse.access_token;
    }
    return config;
  }
  handleResponse(response: AxiosResponse<any, any>) {
    // if (__DEV__) {
    //   const { method, url, params } = response.config;
    //   const queryParams = params ? `?${new URLSearchParams(params).toString()}` : '';
    //   const fullUrl = `${url}${queryParams}`;

    //   logger.log(`request [${method}]: ${fullUrl} ===> status: [${response.status}]`);
    // }
    return response.data;
  }
}

export const baseHttpClient = new BaseHttpClient();
