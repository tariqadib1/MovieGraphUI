import { Component } from '@angular/core';
import ActorMasterData from '../assets/json/ActorsMasterData.json';
import AllGraphData from '../assets/json/ActorMovieRatingsData.json';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MovieGraphUI';

  isMobileDevice: boolean = window.navigator.userAgent.toLowerCase().includes("mobi");
  actors: string[] = [];
  selectedActor: string;
  filteredActors: string[] = [];
  movieData: any;
  chartData: any;
  options: any;
  showNoDataMessage: boolean = false;
  sortedBy = "Year";
  movieCount: number = 0;
  sortingOptions: SelectItem[] = [];

  ngOnInit() {
    for (let actor of ActorMasterData) {
      this.actors.push(actor.Name);
    }
    this.options = {barValueSpacing: 10,
      scales: {
        xAxes: [{ ticks: { beginAtZero: true, min: 0, max: 10 } }],
        yAxes: [{ ticks: { autoSkip: false } }]
      }
    }
    this.sortingOptions.push({label:'Year', value:'Year'});
    this.sortingOptions.push({label:'Rating', value:'Rating'});
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

  sort() {
    
    let graphLabels = []
    let graphDataset = []

    if(this.sortedBy == "Year")
      this.movieData.MovieDetails.sort((a, b) => { return a.Year - b.Year });
    else
      this.movieData.MovieDetails.sort((a, b) => { return b.MovieRating - a.MovieRating });

    for (let movieDetail of this.movieData.MovieDetails) {
      graphLabels.push(movieDetail.MovieName + " (" + movieDetail.Year + ")");
      graphDataset.push(movieDetail.MovieRating);
    }
    this.chartData = {
      labels: graphLabels,
      datasets: [
        {
          label: this.movieData.ActorName,
          data: graphDataset,
          fill: false,
          borderColor: '#1E88E5',
          backgroundColor: '#42A5F5',
        }
      ]
    }
  }

  doOnSelect(event) 
  {
    this.movieCount = 0;
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
        this.movieData = graphData;
        this.movieCount = graphLabels.length;
        this.chartData = {
          labels: graphLabels,
          datasets: [
            {
              label: graphData.ActorName,
              data: graphDataset,
              fill: false,
              borderColor: '#1E88E5',
              backgroundColor: '#42A5F5',
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
