
export class ZoomInfo {

  public authEndpoint = '';
  public sdkKey = '';
  public meetingNumber = '123456789';
  public password = '';
  public role = 0;
  public userName = 'Angular';
  public userEmail = '';
  public registrantToken = '';
  public zakToken = '';
  public leaveUrl = 'http://localhost:4200';
  public signature = '';

  constructor() {

  }

  public static default(){
    return new ZoomInfo();
  }
}
