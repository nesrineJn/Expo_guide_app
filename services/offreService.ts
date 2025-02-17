import { BaseHttpClient } from "./http-client";



export class OffreService extends BaseHttpClient {
  public constructor() {
    super();
  }

  public async getAlloffres(): Promise<any> {
    return this.instance.get(`/offres`);
  }

  public async getoffresById(id: string): Promise<any> {
    return this.instance.get(`/offres/${id}`);
  }
  

}
