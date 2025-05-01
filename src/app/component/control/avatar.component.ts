import {Component, Input} from '@angular/core';
import {NgIf, NgOptimizedImage, NgStyle} from '@angular/common';
import { AppService } from '../../service/app.service';
import {ChatBoxComponent} from './chatbox.component';
import {RouterLink} from '@angular/router';
import {WaCanvas2d, WaCanvasFillStrokeStyles, WaCanvasPath, WaCanvasPath2d} from '@ng-web-apis/canvas';
import {Config, colors, uniqueNamesGenerator} from 'unique-names-generator';
import {User} from '../../../server/entity/model/User';
import {Size} from '../../model/utility/size.model';

export enum AvatarSize {
  Small = 'Small',
  Medium = 'Medium',
  Large = 'Large'
}

@Component({
  selector: "sm-esports-avatar",
  templateUrl: "../template/control/avatar.component.html",
  imports: [
    NgOptimizedImage,
    NgStyle,
    ChatBoxComponent,
    RouterLink,
    NgIf,
    WaCanvas2d,
    WaCanvasPath,
    WaCanvasPath2d,
    WaCanvasFillStrokeStyles
  ]
})
export class AvatarComponent {

  @Input({required:true}) user!: User;
  @Input() size: AvatarSize = AvatarSize.Small;

  protected AvatarSize = AvatarSize;

  // Avatar for mock user accounts (can also use this for new users)
  protected mockUserPath2D:Path2D = new Path2D();
  protected readonly sizeBase = Size.from(150, 200);
  protected readonly mockUserColor:string = 'green';

  constructor(protected readonly appService: AppService) {

    // User Mock Account(s):  (Using: unique-names-generator)
    const config: Config = {
      dictionaries: [colors]
    };

    this.mockUserColor = uniqueNamesGenerator(config);
  }

  ngAfterViewInit() {
    if (!this.user.PictureUrl ||
         this.user.PictureUrl.trim() === '') {
      let size = this.getSize();

      this.drawAvatar(size.width, size.height);
    }
  }

  getSize() {
    switch (this.size) {
      case AvatarSize.Small:
        return Size.scaled(this.sizeBase.width, this.sizeBase.height, 0.33);
      case AvatarSize.Medium:
        return Size.scaled(this.sizeBase.width, this.sizeBase.height, 0.66);
      case AvatarSize.Large:
      default:
        return this.sizeBase;
    }
  }

  drawAvatar(width: number, height: number) {

    // Github Like:
    // - Symmetric
    // - 5 equal sections (in both x, and y)
    // - Random Color
    // - Random Fill
    //

    // Div number must be odd
    let divNumber = 9;
    let midNumber = 5;
    let spatialSet:Map<string, boolean> = new Map();

    // Leave one cell margin
    for (let indexX = 1; indexX < divNumber - 1; indexX++) {
      for (let indexY = 1; indexY < divNumber - 1; indexY++) {

        let key:string = indexX.toString() + indexY.toString();
        let set:boolean = false;
        let xPos = (width / divNumber) * indexX;
        let yPos = (height / divNumber) * indexY;
        let divWidth = (width / divNumber);
        let divHeight = (height / divNumber);

        // Before Meridian + Meridian
        if (indexX < midNumber) {
          if (Math.random() < 0.5) {
            set = true;
          }
        }

        // After Meridian
        else {
          let delta = (indexX - midNumber + 1) * 2;
          key = (indexX - delta).toString() + indexY.toString();
          set = spatialSet.get(key) || false;
        }

        // Finally, draw the current rect
        if (set) {
          this.mockUserPath2D.rect(xPos, yPos, divWidth, divHeight);
        }

        spatialSet.set(key, set);
      }
    }
  }
}
