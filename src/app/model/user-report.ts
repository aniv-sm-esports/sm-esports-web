
export enum UserReportType {
  Info = 'Informational',
  ChatBanWarning = 'Chat Ban Warning',
  ChatBan = 'Banned From Chat',
  SiteWarning = 'Site Ban Warning',
  SiteBan = 'Banned From Site'
}

export class UserReport {
  public userId: number = -1;
  public reportType: UserReportType = UserReportType.Info;
  public reportChatRoomId: number = -1;
  public reportChatId: number = -1;
  public message: string = '';

  public static fromChat(userId:number, reportType: UserReportType, reportChatRoomId:number, reportChatId:number, message:string){
    let result = new UserReport();

    result.userId = userId;
    result.reportType = reportType;
    result.reportChatRoomId = reportChatRoomId;
    result.reportChatId = reportChatRoomId;
    result.message = message;

    return result;
  }
}
