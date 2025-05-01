import {EntityCacheStateDiffer} from './entity/entity-cache-state-differ';
import moment from 'moment/moment';
import {Entity} from './entity/model/Entity';
import {EntityCacheStateData} from './entity/entity-cache-state-data';

const {styleText} = require('node:util');

export enum ServerEnvironment {
  DEV = 0,
  TEST = 1,
  PROD = 2
}

export class ServerLoggerSettings {
  public readonly errorColor:string;
  public readonly warningColor:string;
  public readonly infoColor:string;
  public readonly environment:ServerEnvironment;
  public readonly prependDate:boolean;

  // Specific settings for entity cache diff logging
  public readonly specialInfoColor:string;
  public readonly specialSuccessColor:string;
  public readonly specialWarningColor:string;
  public readonly specialErrorColor:string;

  constructor(environment:ServerEnvironment,
              errorColor:string,
              warningColor:string,
              infoColor:string,
              prependDate:boolean,
              specialInfoColor:string,
              specialSuccessColor:string,
              specialWarningColor:string,
              specialErrorColor:string) {
    this.errorColor = errorColor;
    this.warningColor = warningColor;
    this.infoColor = infoColor;
    this.environment = environment;
    this.prependDate = prependDate;
    this.specialInfoColor = specialInfoColor;
    this.specialSuccessColor = specialSuccessColor;
    this.specialWarningColor = specialWarningColor;
    this.specialErrorColor = specialErrorColor;
  }
}

export class ServerLogger {

  protected settings:ServerLoggerSettings;

  // For color strings, see node:util "styleText"
  constructor(settings: ServerLoggerSettings) {
    this.settings = settings;
  }

  // Normal logging
  public logError(message:string, ...args: any[]) {
    console.log(styleText([this.settings.errorColor], this.formatMessage(message)), ...args);
  }
  public logWarning(message:string, ...args: any[]) {
    console.log(styleText([this.settings.warningColor], this.formatMessage(message)), ...args);
  }
  public logInfo(message:string, ...args: any[]) {
    console.log(styleText([this.settings.infoColor], this.formatMessage(message)), ...args);
  }
  public log(data:any, ...args: any[]) {
    console.log(styleText([this.settings.infoColor], this.formatMessage(JSON.stringify(data))), ...args);
  }

  // Special case logging
  public logSpecialError(message:string, ...args: any[]) {
    console.log(styleText([this.settings.specialErrorColor], this.formatMessage(message)), ...args);
  }
  public logSpecialWarning(message:string, ...args: any[]) {
    console.log(styleText([this.settings.specialWarningColor], this.formatMessage(message)), ...args);
  }
  public logSpecialSuccess(message:string, ...args: any[]) {
    console.log(styleText([this.settings.specialSuccessColor], this.formatMessage(message)), ...args);
  }
  public logSpecial(message:string, ...args: any[]) {
    console.log(styleText([this.settings.specialInfoColor], this.formatMessage(message)), ...args);
  }

  // Logs difference of entity cache states (client v.s. server per entity request
  //
  public logStateDiff<T extends Entity<T>>(clientState:EntityCacheStateData<T>, serverState:EntityCacheStateData<T>) {

    let serverStateString = this.stateToString(serverState);
    let clientStateString = this.stateToString(clientState);
    let diff = EntityCacheStateDiffer.stateDataDiff(clientState, serverState);

    this.logSpecial("Server State:  " + serverStateString);
    this.logSpecial("Client State:  " + clientStateString);

    if (diff) {
      this.logSpecialError("Diff State:  (Failed)");
    }
    else {
      this.logSpecialSuccess("Diff State:  (Success)");
    }
  }

  private formatMessage(message:string) {
    return this.settings.prependDate ? moment().format('YYYY-MM-DD hh:mm:ss:SSSS') + "  " + message : message;
  }

  // TODO: FINISH TYPE DECORATORS / SERIALIZATION (Problem adding functions to DTO's)
  private stateToString<T extends Entity<T>>(state:EntityCacheStateData<T>):string {
    return `((${state.repositoryKey}), (${state.entityName}), (${state.filterSearchSettings}), (${state.filteredRecordCapacity}), (${state.unfilteredRecordCapacity}), INVAILD(${state.invalid}))`;
  }
}
