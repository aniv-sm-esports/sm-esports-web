
export enum NotifyType {
  Permanent = 'Permanent',
  Temporary = 'Temporary'
}

export enum NotifySeverity {
  Info = 'Info',
  Warning = 'Warning',
  Error = 'Error'
}

export class NotifyModel {
  public id: number;
  public name: string;
  public type: NotifyType;
  public severity: NotifySeverity;

  constructor(){
    this.id = -1;
    this.name = '';
    this.type = NotifyType.Permanent;
    this.severity = NotifySeverity.Info;
  }

  public static default() {
    return new NotifyModel();
  }

  public static from(name: string, type:NotifyType, severity:NotifySeverity): NotifyModel {
    let result = new NotifyModel();
    result.id = 0;
    result.name = name;
    result.type = type;
    result.severity = severity;
    return result;
  }
}
