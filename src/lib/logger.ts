import { Constants } from "./constants";

export enum LogTypes {
  CRITICAL="CRITICAL",
  ERROR="ERROR",
  INFO="INFO",
}


export class Logger {
  public static Log = (type: LogTypes, message: string, data?: unknown) => {
    if (Constants.InDev) {
      if(!data){
        console.log(`[${type}] ${message}`);
      }

      console.log(`[${type}] ${message}`, JSON.stringify(data, null, " "));
    }
  }

  public static Critical = (message: string, data?: unknown) => {
    Logger.Log(LogTypes.CRITICAL, message, data);
    // Potential to send critical logs to db or other service
  };
  
  public static Error = (message: string, data?: unknown) => {
    Logger.Log(LogTypes.ERROR, message, data);
    // Potential to send error logs to db or other service
  };

  public static Info = (message: string, data?: unknown) => {
    Logger.Log(LogTypes.INFO, message, data)
  };
}