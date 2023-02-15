import { AfterViewInit, Component, OnInit } from '@angular/core';
declare var YT: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.player = new YT.Player('youtube-player', {
        videoId: this.videoId,
        playerVars: {
          controls: 0,
          disablekb: 0,
          modestbranding: 0,
          rel: 0,
          showinfo: 0,
        },
        events: {
          onStateChange: (event: any) => {
            if (event.data == YT.PlayerState.PLAYING) {
              this.isPlaying = true;
            } else {
              this.isPlaying = false;
            }
          },
          onReady: (event) => this.onPlayerReady(event),
        },
      });
    }, 1000);
  }

  expression = false

  markerSelect;

  videoId = 'GYAB4Td62zI';
  markers = [
    { time: '0:05', label: 'Primer marcador' },
    { time: '0:10', label: 'Segundo marcador' },
    { time: '2:10', label: 'Tercer marcador' },
  ];
  currentTime = '00:00:00';
  isPlaying = false;

  player: any;
  intervalId: any;

  ngOnInit() {
    // Inicializar el reproductor de YouTube
  }

  onPlayerReady(event) {
    this.addMarkers();
  }

  updateTime() {
    const currentTime = this.player.getCurrentTime();
    this.currentTime = this.formatTime(currentTime);

    const progress = (currentTime / this.player.getDuration()) * 100;
    const progressBar = document.querySelector('.progress') as HTMLElement;
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    for (let marker of this.markers) {
      const markerTime = this.timeToSeconds(marker.time);
      if (Math.abs(currentTime - markerTime) < 0.5) {

        console.log('marker=>',marker)
        this.player.pauseVideo();
        this.expression = true
        this.markerSelect = marker
        clearInterval(this.intervalId);
      }
    }
  }

  formatTime(time) {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time - hours * 3600) / 60);
    const seconds = Math.floor(time - hours * 3600 - minutes * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  addMarkers() {
    const duration = this.player.getDuration();
    const timeline = document.querySelector('.progress-bar');
    const markersContainer = document.querySelector('.markers');
    for (let marker of this.markers) {
      const markerTime = this.timeToSeconds(marker.time);
      const markerPosition = (markerTime / duration) * 100;
      const markerElement = document.createElement('i');
      markerElement.setAttribute('class', 'fas fa-map-marker-alt');
      markerElement.setAttribute(
        'style',
        `left: calc(${markerPosition}% - 2px); color: green; width: 20px;     position: absolute;
      height: 30px;
      margin-top: -12px;`
      );
      markerElement.setAttribute('title', marker.label + ' ' + marker.time);

      markerElement.addEventListener('click', () => {
        this.jumpToTime(marker.time);
      });
      markersContainer.appendChild(markerElement);
    }
  }

  jumpToTime(time: string) {
    // Saltar a un momento específico del video
    const seconds = this.timeToSeconds(time);
    this.player.seekTo(seconds);
    this.player.playVideo();
    this.player.pauseVideo();
    this.currentTime = this.formatTime(seconds);
    this.updateTime();
  }

  togglePlayback() {
    // Reproducir o pausar el video
    if (this.isPlaying) {
      this.player.pauseVideo();
      clearInterval(this.intervalId);
    } else {
      this.player.playVideo();
      this.expression = false
      this.intervalId = setInterval(() => {
        this.updateTime();
      }, 1000);
    }
  }

  timeToSeconds(time: string): number {
    // Convertir un tiempo en formato "mm:ss" a segundos
    const parts = time.split(':');
    const minutes = parseInt(parts[0]);
    const seconds = parseInt(parts[1]);
    return minutes * 60 + seconds;
  }
}
