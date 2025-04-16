import {Component, Inject, NgZone} from '@angular/core';
import {DOCUMENT, NgStyle} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {ZoomService} from '../service/zoom.service';
import {ZoomInfo} from '../model/view/zoom.model';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'zoom',
  imports: [
    FormsModule
  ],
  templateUrl: './template/zoom.component.html'
})
export class ZoomComponent {

  public meetingInfo: ZoomInfo = ZoomInfo.default();

  constructor(public httpClient: HttpClient,  @Inject(DOCUMENT) document: any, protected ngZone: NgZone, private zoomService: ZoomService) {

  }

  ngOnInit() {
    //this.zoomService.initZoom();
  }

  startMeeting() {
    this.httpClient.post(this.meetingInfo.authEndpoint, {
      meetingNumber: this.meetingInfo.meetingNumber,
      role: this.meetingInfo.role
    }).subscribe((data: any) => {

      if(data.signature) {

        console.log(data.signature);

        // Set to meeting info
        this.meetingInfo = data.signature;

        // TODO: See about avoiding DOM issues
        document.getElementById('zmmtg-root')!.style.display = 'block';

        // -> ZoomService -> import @zoom/meetingsdk
        //
        this.zoomService.startCall(this.meetingInfo, this.ngZone);

      } else {
        console.log(data)
      }
    })
  }
}
