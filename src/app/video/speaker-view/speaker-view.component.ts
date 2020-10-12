import {AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import {
  RemoteTrack,
  RemoteAudioTrack,
  RemoteVideoTrack,
} from 'twilio-video';

@Component({
  selector: 'app-speaker-view',
  templateUrl: './speaker-view.component.html',
  styleUrls: ['./speaker-view.component.css']
})
export class SpeakerViewComponent implements OnInit, AfterViewInit {

  @ViewChild('preview', {static: false}) preview: ElementRef;

  isPreviewing = false;
  localInitial: string;

  @Input() track: any;

  @Input('participant')
  set participant(val: any) {
    this.setData(val);
    console.log(val);
  }

  @Input('localParticipant')
  set localParticipant(localParticipant: any) {
    this.setData(localParticipant);
    console.log(localParticipant);
  }
  private isAttachable(track: RemoteTrack): track is RemoteAudioTrack | RemoteVideoTrack {
    return !!track &&
        ((track as RemoteAudioTrack).attach !== undefined ||
            (track as RemoteVideoTrack).attach !== undefined);
  }

  private isDetachable(track: RemoteTrack): track is RemoteAudioTrack | RemoteVideoTrack {
    return !!track &&
        ((track as RemoteAudioTrack).detach !== undefined ||
            (track as RemoteVideoTrack).detach !== undefined);
  }


  constructor(private readonly renderer: Renderer2) { }

  ngOnInit(): void {
    console.log(this.preview);
  }

  ngAfterViewInit() {
    console.log(this.preview);
  }

  setData(localParticipant) {
    if (!!localParticipant) {
      this.localInitial = localParticipant.identity.substring(0, 2);

      localParticipant.videoTracks.forEach( track => {
        console.log(track);
        this.attachRemoteTrack(track);
      });

    }
  }

  private attachRemoteTrack(track: any) {
    if (this.isAttachable(track.track)) {
      this.isPreviewing = true;
      const element = track.track.attach();
      this.renderer.data.id = track.sid ? track.sid : track.trackSid;
      this.renderer.setStyle(element, 'width', '100%');
      console.log(this.preview);
      this.renderer.appendChild(this.preview.nativeElement, element);
    }
  }

}
