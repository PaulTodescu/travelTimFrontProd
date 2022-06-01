import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {Chart, registerables} from "chart.js";
import {LodgingService} from "../../../services/lodging/lodging.service";
import {LodgingOffersStatistics} from "../../../entities/lodgingOffersStatistics";
import {HttpErrorResponse} from "@angular/common/http";
import {FoodService} from "../../../services/food/food.service";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {FoodOffersStatistics} from "../../../entities/foodOffersStatistics";
import {AttractionOffersStatistics} from "../../../entities/attractionOffersStatistics";
import {AttractionService} from "../../../services/attraction/attraction.service";
import {ActivityService} from "../../../services/activity/activity.service";
import {ActivityOffersStatistics} from "../../../entities/activityOffersStatistics";

@Component({
  selector: 'app-offers-statistics',
  templateUrl: './offers-statistics.component.html',
  styleUrls: ['./offers-statistics.component.scss']
})
export class OffersStatisticsComponent implements OnInit {

  @ViewChild('myChart') chart:ElementRef | undefined;

  showLoadingSpinner: boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      offerCategory: string,
    },
    private lodgingService: LodgingService,
    private foodService: FoodService,
    private attractionService: AttractionService,
    private activityService: ActivityService) {
    this.getOffersStatistics(this.data.offerCategory);
  }

  public getOffersStatistics(offersCategory: string): void {
    if (offersCategory === 'lodging') {
      this.getLodgingOffersStatistics();
    } else if (offersCategory === 'food & beverage') {
      this.getFoodOffersStatistics();
    } else if (offersCategory === 'attractions') {
      this.getAttractionOffersStatistics();
    } else if (offersCategory === 'activities') {
      this.getActivityOffersStatistics();
    }
  }

  public getLodgingOffersStatistics() {
    this.lodgingService.getLodgingOffersStatistics().subscribe(
      (response: LodgingOffersStatistics) => {
        setTimeout(() => {
          this.showLoadingSpinner = false;
          this.showLodgingOffersStatisticsGraph(response);
        }, 1000);
      }, (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public getFoodOffersStatistics() {
    this.foodService.getFoodOffersStatistics().subscribe(
      (response: FoodOffersStatistics) => {
        setTimeout(() => {
          this.showLoadingSpinner = false;
          this.showFoodOffersStatisticsGraph(response);
          }, 1000);
      }, (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public getAttractionOffersStatistics() {
    this.attractionService.getAttractionOffersStatistics().subscribe(
      (response: AttractionOffersStatistics) => {
        setTimeout(() => {
          this.showLoadingSpinner = false;
          this.showAttractionOffersStatisticsGraph(response);
        }, 1000);
      }, (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public getActivityOffersStatistics() {
    this.activityService.getActivityOffersStatistics().subscribe(
      (response: ActivityOffersStatistics) => {
        setTimeout(() => {
          this.showLoadingSpinner = false;
          this.showActivityOffersStatisticsGraph(response);
        }, 1000);
      }, (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public showLodgingOffersStatisticsGraph(statistics: LodgingOffersStatistics): void {
    Chart.register(...registerables);
    new Chart('statistic-charts', {
      type: 'bar',
      data: {
        labels: ['Average Views', 'Your Average Views', 'Average Price (RON)',
          'Your Average Price (RON)', 'Average Suggested Price (RON)'],
        datasets: [{
          data: [
            statistics.averageOffersViews,
            statistics.averageUserOffersViews,
            statistics.averageOffersPrice,
            statistics.averageUserOffersPrice,
            statistics.averageRequestedOffersPrice
          ],
          backgroundColor: [
            '#d9d7ca',
            '#d9d7ca',
            '#d9d7ca',
            '#d9d7ca',
            '#d9d7ca',
          ],
          hoverBackgroundColor: '#bfbdb2'
        }]
      },
      options: {
        plugins: {
          legend: {
            display: false
          }},
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  public showFoodOffersStatisticsGraph(statistics: FoodOffersStatistics): void {
    Chart.register(...registerables);
    new Chart('statistic-charts', {
      type: 'bar',
      data: {
        labels: ['Average Views', 'Your Average Views'],
        datasets: [{
          data: [
            statistics.averageOffersViews,
            statistics.averageUserOffersViews,
          ],
          backgroundColor: [
            '#d9d7ca',
            '#d9d7ca'
          ],
          hoverBackgroundColor: '#bfbdb2'
        }]
      },
      options: {
        plugins: {
          legend: {
            display: false
          }},
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  public showAttractionOffersStatisticsGraph(statistics: AttractionOffersStatistics): void {
    Chart.register(...registerables);
    new Chart('statistic-charts', {
      type: 'bar',
      data: {
        labels: ['Average Views', 'Your Average Views', 'Average Ticket Price (RON)', 'Your Average Ticket Price (RON)'],
        datasets: [{
          data: [
            statistics.averageOffersViews,
            statistics.averageUserOffersViews,
            statistics.averageOffersTicketsPrice,
            statistics.averageUserOffersTicketsPrice
          ],
          backgroundColor: [
            '#d9d7ca',
            '#d9d7ca',
            '#d9d7ca',
            '#d9d7ca',
          ],
          hoverBackgroundColor: '#bfbdb2'
        }]
      },
      options: {
        plugins: {
          legend: {
            display: false
          }},
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  public showActivityOffersStatisticsGraph(statistics: ActivityOffersStatistics): void {
    Chart.register(...registerables);
    new Chart('statistic-charts', {
      type: 'bar',
      data: {
        labels: ['Average Views', 'Your Average Views', 'Average Ticket Price (RON)', 'Your Average Ticket Price (RON)'],
        datasets: [{
          data: [
            statistics.averageOffersViews,
            statistics.averageUserOffersViews,
            statistics.averageOffersTicketsPrice,
            statistics.averageUserOffersTicketsPrice
          ],
          backgroundColor: [
            '#d9d7ca',
            '#d9d7ca',
            '#d9d7ca',
            '#d9d7ca',
          ],
          hoverBackgroundColor: '#bfbdb2'
        }]
      },
      options: {
        plugins: {
          legend: {
            display: false
          }},
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  ngOnInit(): void {
  }

}
