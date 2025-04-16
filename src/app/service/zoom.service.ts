import {Inject, Injectable, NgZone, PLATFORM_ID} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {ZoomInfo} from '../model/view/zoom.model';

@Injectable({
  providedIn: 'root'
})
export class ZoomService {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  // Deferred importing of Zoom to avoid "self is not defined" pre-rendering issues
  // until the config is understood.
  //
  startCall(zoomInfo: ZoomInfo, zone:NgZone) {
    if (isPlatformBrowser(this.platformId)) {

      // Initialize and use Zoom SDK here
      import('@zoom/meetingsdk').then(api => {

        // Initialize and use ZoomMtg here
        zone.runOutsideAngular(() => {

          api.ZoomMtg.init({
              leaveUrl: zoomInfo.leaveUrl,
              patchJsMedia: true,
              leaveOnPageUnload: true,
              success: (success: any) => {
                console.log(success)
                api.ZoomMtg.join({
                  signature: zoomInfo.signature,
                  sdkKey: zoomInfo.sdkKey,
                  meetingNumber: zoomInfo.meetingNumber,
                  passWord: zoomInfo.password,
                  userName: zoomInfo.userName,
                  userEmail: zoomInfo.userEmail,
                  tk: zoomInfo.registrantToken,
                  zak: zoomInfo.zakToken,

                  success: (success: any) => {
                    console.log(success)
                  },

                  error: (error: any) => {
                    console.log(error)
                  }
                })
              },
              error: (error: any) => {
                console.log(error)
              }
            });
          });

      }).catch(err => {
        console.error("Failed to load Zoom SDK", err);
      });
    }
  }
}
