import { Component } from '@angular/core';
import ActorMasterData from '../assets/json/ActorsMasterData.json';
import AllGraphData from '../assets/json/ActorMovieRatingsData.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'MovieGraphUI';

  isMobileDevice: boolean = window.navigator.userAgent.toLowerCase().includes("mobi");
  actors: string[] = [];
  selectedActor: string;
  filteredActors: string[] = [];
  chartData: any;
  options: any;
  showNoDataMessage: boolean = false;

  ngOnInit() {
    for (let actor of ActorMasterData) {
      this.actors.push(actor.Name);
    }
    this.options = {
      scales: {
        yAxes: [{ ticks: { beginAtZero: true, min: 0, max: 10 } }]
      }
    }
  }

  filterActors(event) {
    this.filteredActors = [];
    let query = event.query;
    for (let i = 0; i < this.actors.length; i++) {
      let actor = this.actors[i];
      if (actor.toLowerCase().indexOf(query.toLowerCase()) != -1) {
        this.filteredActors.push(actor);
      }
    }
  }

  onClear() {
    this.selectedActor = "";
    this.filteredActors = [];
    //this.chartData = null;
  }

  doOnSelect(event) 
  {
    this.selectedActor = event;
    for (let graphData of AllGraphData) {
      if (graphData.ActorName == this.selectedActor) {
        this.showNoDataMessage = false;
        let graphLabels = []
        let graphDataset = []

        for (let movieDetail of graphData.MovieDetails) {
          graphLabels.push(movieDetail.MovieName + " (" + movieDetail.Year + ")");
          graphDataset.push(movieDetail.MovieRating);
        }

        this.chartData = {
          labels: graphLabels,
          datasets: [
            {
              label: graphData.ActorName,
              data: graphDataset,
              fill: false,
              borderColor: '#4bc0c0'
            }
          ]
        }
        return;
      }
    }
    this.showNoDataMessage = true;
    this.chartData = null;
    //Record actor name in json so that we can add it to the list
  }

}
