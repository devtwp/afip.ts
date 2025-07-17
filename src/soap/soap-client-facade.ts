import { resolve } from "path";
import { Client, createClientAsync } from "soap";
import { SoapClientParams } from "../types";
import * as https from 'https';


export class SoapClientFacade {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private construct() { }

  /**
   * Geth the path for the WSDL file stored on the WSDL folder.
   *
   * @param wsdlFile
   * @param forceFolderPath
   * @returns Path of wsdl file
   */
  private static getWsdlPath(
    wsdlFile: string,
    forceFolderPath?: string
  ): string {
    return resolve(forceFolderPath ?? resolve(__dirname, "wsdl/"), wsdlFile);
  }

  public static async create<T extends Client>({
    wsdl,
    options,
  }: SoapClientParams): Promise<T> {

    const weakDHAgent = new https.Agent({
      rejectUnauthorized: false,
      minVersion: 'TLSv1',
      secureOptions: 0x20,
    });
    
    const soapOptions = {
      ...options,
      wsdl_options: {
        ...options?.wsdl_options,
        agent: weakDHAgent,
      },
    };

    return (await createClientAsync(
      SoapClientFacade.getWsdlPath(wsdl),
      soapOptions
    )) as T;
  }
}
