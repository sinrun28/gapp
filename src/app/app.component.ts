import { Component, Inject, AfterViewInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { Chart } from 'chart.js';

declare var $:any;
declare var _:any;
declare var google:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  views:any;      // <-- contains all the views from the API
  viewNames = []; // <-- contains all view names from the API || used for selecting views
  viewItems = []; // <-- contains all view itesm that are not visible || used for the add widget
  currentView_name:string;
  currentView_values = {
    currentData: {name:'Current Data',                                  on:true, x:0, y:0},
    numberOfCompartmentUsers: {name:'Number of Compartment Users',      on:true, x:0, y:4},
    numberOfContainers: {name:'Number of Containers',                   on:true, x:2, y:0},
    totalDivisions: {name:'Total Divisions',                            on:true, x:8, y:0},
    ERPActiveUsers: {name:'ERP Active Users',                           on:true, x:8, y:6},
    ERPAccessLocations: {name:'ERP Access Locations',                   on:true, x:0, y:9},
    vouchersUsage: {name:'Vouchers Usage',                              on:true, x:8, y:11},
    usersUsingBoiAuth: {name:'Users using Bio Auth',                    on:true, x:0, y:16},
    usersUsingIdCards: {name:'Users using ID Cards',                    on:true, x:2, y:16},
    trackersDeployed: {name:'Trackers Deployed',                        on:true, x:4, y:16},
    realTimeDataPoints: {name:'Real time data points',                  on:true, x:6, y:16},
    fileApprovedToday: {name:'File Approved Today',                     on:true, x:0, y:20},
    containerForwardingApproved: {name:'Container Forwarding Approved', on:true, x:8, y:17},
    packagesUnloaded: {name:'Packages loaded',                          on:true, x:8, y:22},
    numberOfContainersLoaded: {name:'Number of Containers Loaded',      on:true, x:10, y:17},
    onFieldOfficers: {name:'On field Officers',                         on:true, x:0, y:26},
    securitySettingsUpdates: {name:'Security Setting Updates',          on:true, x:2, y:26},
    craneUsage: {name:'Crane Usage',                                    on:true, x:8, y:26},
    unlabledData: {name:'Unlabled Data',                                on:true, x:10, y:26},
  };

  isCustomize = false;
  isAddWidget = false;
  gsHeight:number;  // <-- saves the height of the default grid

  apiData = {
    currentData: [],
    currentData_width: 0,
    currentData_height: 0,
    numberOfCompartment: 0,
    erpUsers: { ho:0, mumbai:0, sing:0, chennai:0, dubai:0 },
    latLang: [],
    bioAuth: 0,
    idCards: 0,
    trackersDeployed: 0,
    realtimeData: 0,
    containerApproved: 0,
    packagesUnloaded: [],
    packagesUnloaded_width: 0,
    packagesUnloaded_height: 0,
    fieldOfficers: 0,
    securityUpdates: [],
    craneUsage: [],
    craneUsage_width: 0,
    craneUsage_height: 0,
    untitled: { clients:0, partners:0 }
  }

  map:any;
  markers = [];

  pieChart1; pieChart2; pieChart3;
  barChart1; barChart2; barChart3; barChart4;



  constructor( private http:HttpClient ) {}

  ngAfterViewInit() {
    var views = this.http.get('api/views').subscribe( (res) => this.resolveViews(res) );

    var api = Observable.timer(0, 10000).subscribe(() => {
      this.http.get('api/data')
        .pipe(
          catchError( this.handleError('getHeroes', []) )
        )
        .subscribe( res => this.resolveApi(res) )
    });

    $(document).ready( () => { this.charts(); this.initMap(); this.changeView() } );

    $(window).on('load resize', () => { this.initExp(); this.initWidgetCustomize(); });

    $('#grid1').gridstack({
      animate: true,
      disableResize: true,
      disableDrag: true
    });
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }



  charts() {
    this.pieChart1 = new Chart($('#pie-chart1'), {
      type: 'pie',
      data: {
        labels: ["Red", "Blue", "Yellow", "Green"],
        datasets: [{
          label: '# of Containers',
          data: [0, 0, 0, 0],
          backgroundColor: ['#4f81bcd1', '#c0504ed1', '#9bbb58d1', '#8165a2d1'],
          hoverBackgroundColor: ['#4f81bc', '#c0504e', '#9bbb58', '#8165a2']
        }]
      },
      options: {
        legend: {
          position: 'right'
        }
      }
    });

    this.barChart1 = new Chart($('#bar-chart1'), {
      type: 'bar',
      data: {
        labels: ['x1','x2','x3','x4','x5','x6','x7','x8','x9','x10','x11','x12','x13','x14','x15','x16'],
        datasets: [{
          label: '# of Container',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          backgroundColor: ['#e83323d1', '#ea642bd1', '#ef9d38d1', '#f7d247d1', '#f9fe53d1', '#b0de45d1', '#67d33ed1', '#428fcfd1', '#2052d1d1', '#2b17d0d1', '#2b17d0d1', '#ce2e74d1', '#764cecd1', '#ddddddd1', '#999999d1', '#333333d1'],
          hoverBackgroundColor: ['#e83323', '#ea642b', '#ef9d38', '#f7d247', '#f9fe53', '#b0de45', '#67d33e', '#428fcf', '#2052d1', '#2b17d0', '#2b17d0', '#ce2e74', '#764cec', '#dddddd', '#999999', '#333333']
        }]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
            ticks: {
              max: 4500
            }
          }]
        }
      }
    });

    this.barChart2 = new Chart($('#bar-chart2'), {
      type: 'horizontalBar',
      data: {
        labels: ['0', '01', '02', '03', '04'],
        datasets: [{
          label: 'Total Regions',
          data: [0, 0, 0, 0, 0],
          backgroundColor: ['#fff', '#494e8dd1', '#4387a2d1', '#55af8ad1', '#87bc55d1'],
          hoverBackgroundColor: ['#fff', '#494e8d', '#4387a2', '#55af8a', '#87bc55']
        }]
      },
      options: {
        scales: {
          xAxes: [{
            ticks: {
              max: 100,
              min: 0,
              stepSize: 10,
              callback: function(value, index, values) {
                return value + '%';
              }
            },
            gridLines: {
              borderDash: [2, 2, 2],
              color: 'rgba(0,0,0,0.3)'
            },
            position: 'top'
          }],
          yAxes: [{
            ticks: {
              callback: function(value, index, values) {
                if(value == 0) { return null };
                return value
              },
              mirror: true,
              fontColor: '#000',
              fontSize: 20,
              padding: -10
            }
          }]
        },
        legend: {
          display: false
        }
      }
    });

    this.barChart3 = new Chart($('#bar-chart3'), {
      type: 'horizontalBar',
      data: {
        labels: ['0', '01', '02', '03', '04'],
        datasets: [{
          label: 'Vouchers Usage',
          data: [0, 0, 0, 0, 0],
          backgroundColor: ['#fff', '#494e8dd1', '#4387a2d1', '#55af8ad1', '#87bc55d1'],
          hoverBackgroundColor: ['#fff', '#494e8d', '#4387a2', '#55af8a', '#87bc55']
        }]
      },
      options: {
        scales: {
          xAxes: [{
            ticks: {
              max: 100,
              min: 0,
              stepSize: 10,
              callback: function(value, index, values) {
                return value + '%';
              }
            },
            gridLines: {
              borderDash: [2, 2, 2],
              color: 'rgba(0,0,0,0.3)'
            },
            position: 'top'
          }],
          yAxes: [{
            ticks: {
              callback: function(value, index, values) {
                if(value == 0) { return null };
                return value
              },
              mirror: true,
              fontColor: '#000',
              fontSize: 20,
              padding: -10
            }
          }]
        },
        legend: {
          display: false
        }
      }
    })

    this.barChart4 = new Chart($('#bar-chart4'), {
      type: 'bar',
      data: {
        labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        datasets: [{
          label: 'File Approved',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          backgroundColor: ['#8a9db0d1', '#a68934d1', '#a68934d1', '#a66d45d1', '#306566d1', '#883d3ad1', '#5e3a64d1', '#4c612dd1', '#7e7928d1', '#306892d1', '#641918d1', '#716484d1'],
          hoverBackgroundColor: ['#8a9db0', '#a68934', '#a68934', '#a66d45', '#306566', '#883d3a', '#5e3a64', '#4c612d', '#7e7928', '#306892', '#641918', '#716484']
        }]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
            ticks: {
              max: 40,
              min: 0,
              callback: function(value, index, values) {
                return value + 'M'
              }
            }
          }]
        }
      }
    });

    this.pieChart2 = new Chart($('#pie-chart2'), {
      type: 'pie',
      data: {
        labels: ["Loaded", "Unloaded", "Rejected", "Wasted"],
        datasets: [{
          label: '# of Containers',
          data: [0, 0, 0, 0],
          backgroundColor: ['#4f81bcd1', '#c0504ed1', '#9bbb58d1', '#8165a2d1'],
          hoverBackgroundColor: ['#4f81bc', '#c0504e', '#9bbb58', '#8165a2']
        }]
      },
      options: {
        legend: {
          display: false
        }
      }
    });

    this.pieChart3 = new Chart($('#pie-chart3'), {
      type: 'pie',
      data: {
        labels: ["Loaded", "Unloaded", "Rejected", "Wasted"],
        datasets: [{
          label: '# of Containers',
          data: [0, 0, 0, 0],
          backgroundColor: ['#4f81bcd1', '#c0504ed1', '#9bbb58d1', '#8165a2d1'],
          hoverBackgroundColor: ['#4f81bc', '#c0504e', '#9bbb58', '#8165a2']
        }]
      },
      options: {
        legend: {
          display: false
        }
      }
    });
  }

  initMap() {
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: -24.397, lng: 130.644 },
      zoom: 4,
      streetViewControl: false
    });

    // resolves the inability to drag the map without dragging the widget
    // Depricated - Replaced by customize button
    // $('#map').hover(
    //   () => $('.grid-stack').data('gridstack').disable(),
    //   () => $('.grid-stack').data('gridstack').movable('.grid-stack-item', true)
    // );
  }

  initExp() {
    this.apiData.currentData_width = $('.grid-stack-item').find('.grid-stack-item-content[data-current-data]').width()
    this.apiData.currentData_height = $('.grid-stack-item').find('.grid-stack-item-content[data-current-data]').height()

    this.apiData.packagesUnloaded_width = $('.grid-stack-item').find('.grid-stack-item-content[data-packages-unloaded]').width()
    this.apiData.packagesUnloaded_height = $('.grid-stack-item').find('.grid-stack-item-content[data-packages-unloaded]').height()

    this.apiData.craneUsage_width = $('.grid-stack-item').find('.grid-stack-item-content[data-crane-usage]').width()
    this.apiData.craneUsage_height = $('.grid-stack-item').find('.grid-stack-item-content[data-crane-usage]').height()

    //click event on horizontal expansion elements
    $('.grid-stack-item').find('.grid-stack-item-content[data-exp-width]').find('.exp').on('click', function(ev) {
      let grid = $('.grid-stack').data('gridstack');
      let el = $(this).parents('.grid-stack-item');
      let expWidth = $(this).parents('.grid-stack-item-content').data('exp-width');
      let orgnWidth = $(this).parents('.grid-stack-item-content').data('orgn-width');

      //needs to expand
      if($(this).hasClass('icon-expand')) {
        $(this).removeClass('icon-expand').addClass('icon-compress');
        // $(this).parents('.grid-stack-item-content').css('overflow-x', 'scroll');
        grid.resize(el, expWidth*orgnWidth);

      //needs to contract
      } else {
        $(this).removeClass('icon-compress').addClass('icon-expand');
        // $(this).parents('.grid-stack-item-content').css('overflow-x', 'hidden');
        grid.resize(el, orgnWidth);
      }
    });
  }

  resolveViews(res) {
    this.views = res;
    _.forEach(res, (view) => this.viewNames.push(view.name))
    this.currentView_name = this.viewNames[0];
    this.getViewValues();
    this.getViewItems();
  }

  getViewValues() {
    this.currentView_values = _.find(this.views, {name:this.currentView_name}).values;
  }

  getViewItems() {
    this.viewItems = _.filter(this.currentView_values, (val) => !val.on);
  }

  resolveApi(res) {
    $('#preloader').addClass('hidden');

    _.forEach(res, data => {

      switch (data.name) {
        case 'Current Data':
          this.apiData.currentData = data.val;
          break;

        case 'Number of Compartment':
          this.apiData.numberOfCompartment = data.val;
          break;

        case 'Pie-No of Containers':
          this.pieChart1.data.datasets[0].data = data.val;
          this.pieChart1.update();
          break;

        case 'Bar-No of Containers':
          this.barChart1.data.datasets[0].data = data.val;
          this.barChart1.update();
          break;

        case 'Bar-Total Divisions':
          this.barChart2.data.datasets[0].data = data.val;
          this.barChart2.update();
          break;

        case 'ERP Active Users':
          this.apiData.erpUsers = data.val;
          break;

        case 'ERP Access Locations':
          this.apiData.latLang = data.val;
          this.updateMarkers();
          break;

        case 'Vouchers Usage':
          this.barChart3.data.datasets[0].data = data.val;
          this.barChart3.update();
          break;

        case 'Users using Bio Auth':
          this.apiData.bioAuth = data.val;
          break;

        case 'Users using ID Cards':
          this.apiData.idCards = data.val;
          break;

        case 'Trackers Deployed':
          this.apiData.trackersDeployed = data.val;
          break;

        case 'Real time data points':
          this.apiData.realtimeData = data.val;
          break;

        case 'File Approved Today':
          this.barChart4.data.datasets[0].data = data.val;
          this.barChart4.update();
          break;

        case 'Container Forwarding Approved':
          this.apiData.containerApproved = data.val;
          break;

        case 'Packages unloaded':
          this.apiData.packagesUnloaded = data.val;
          break;

        case 'No of Containers':
          this.pieChart2.data.datasets[0].data = data.val;
          this.pieChart2.update();
          break;

        case 'No of Packages':
          this.pieChart3.data.datasets[0].data = data.val;
          this.pieChart3.update();
          break;

        case 'On Field Officers':
          this.apiData.fieldOfficers = data.val;
          break;

        case 'Security Setting Updates':
          this.apiData.securityUpdates = data.val;
          break;

        case 'Crane Usage':
          this.apiData.craneUsage = data.val;
          break;

        case 'untitled':
          this.apiData.untitled = data.val;
          break;

        default:
          console.error('API data is not structured as it was designed for this app')
          console.log( data.name )
          break;
      }

    });
  }

  updateMarkers() {
    for(let i=0; i<this.markers.length; i++) {
      this.markers[i].setMap(null);
    }
    this.markers = []

    for(let i=0; i<this.apiData.latLang.length; i++) {
      let marker = new google.maps.Marker({
        position: new google.maps.LatLng( this.apiData.latLang[i][0], this.apiData.latLang[i][1] ),
        map: this.map,
        label: (i+1).toString()
      });

      this.markers.push(marker);
    }
  }

  // clicking the customize page button
  customizePage() {
    this.isCustomize = !this.isCustomize;

    if(this.isCustomize) {
      $('.grid-stack').data('gridstack').movable('.grid-stack-item', true);
    } else {
      $('.grid-stack').data('gridstack').disable();
    }

  }

  // change view, change view name, and moving widgets
  changeView() {
    let self = this;

    $('#viewsController').on('change', function() {
      self.currentView_name = $(this).val();
      $('#preloader').removeClass('hidden');
      self.customizePage();
      self.getViewValues();
      self.getViewItems();
    })

    $('.currentViewName').bind("DOMSubtreeModified", () => {
      self.forcePosition();
      $('#preloader').addClass('hidden');
    });

    $('.grid-stack').on('change', function(event, items) {
      if(self.isCustomize) {
        _.forEach(items, (item) => {
          switch ( item.el[0] ) {
            case $('.grid-stack-item[data-currentData]')[0]:
              self.currentView_values.currentData.x = item.x;
              self.currentView_values.currentData.y = item.y;
              break;

            case $('.grid-stack-item[data-numberOfCompartmentUsers]')[0]:
              self.currentView_values.numberOfCompartmentUsers.x = item.x;
              self.currentView_values.numberOfCompartmentUsers.y = item.y;
              break;

            case $('.grid-stack-item[data-numberOfContainers]')[0]:
              self.currentView_values.numberOfContainers.x = item.x;
              self.currentView_values.numberOfContainers.y = item.y;
              break;

            case $('.grid-stack-item[data-totalDivisions]')[0]:
              self.currentView_values.totalDivisions.x = item.x;
              self.currentView_values.totalDivisions.y = item.y;
              break;

            case $('.grid-stack-item[data-ERPActiveUsers]')[0]:
              self.currentView_values.ERPActiveUsers.x = item.x;
              self.currentView_values.ERPActiveUsers.y = item.y;
              break;

            case $('.grid-stack-item[data-ERPAccessLocations]')[0]:
              self.currentView_values.ERPAccessLocations.x = item.x;
              self.currentView_values.ERPAccessLocations.y = item.y;
              break;

            case $('.grid-stack-item[data-vouchersUsage]')[0]:
              self.currentView_values.vouchersUsage.x = item.x;
              self.currentView_values.vouchersUsage.y = item.y;
              break;

            case $('.grid-stack-item[data-usersUsingBoiAuth]')[0]:
              self.currentView_values.usersUsingBoiAuth.x = item.x;
              self.currentView_values.usersUsingBoiAuth.y = item.y;
              break;

            case $('.grid-stack-item[data-usersUsingIdCards]')[0]:
              self.currentView_values.usersUsingIdCards.x = item.x;
              self.currentView_values.usersUsingIdCards.y = item.y;
              break;

            case $('.grid-stack-item[data-trackersDeployed]')[0]:
              self.currentView_values.trackersDeployed.x = item.x;
              self.currentView_values.trackersDeployed.y = item.y;
              break;

            case $('.grid-stack-item[data-realTimeDataPoints]')[0]:
              self.currentView_values.realTimeDataPoints.x = item.x;
              self.currentView_values.realTimeDataPoints.y = item.y;
              break;

            case $('.grid-stack-item[data-fileApprovedToday]')[0]:
              self.currentView_values.fileApprovedToday.x = item.x;
              self.currentView_values.fileApprovedToday.y = item.y;
              break;

            case $('.grid-stack-item[data-containerForwardingApproved]')[0]:
              self.currentView_values.containerForwardingApproved.x = item.x;
              self.currentView_values.containerForwardingApproved.y = item.y;
              break;

            case $('.grid-stack-item[data-packagesUnloaded]')[0]:
              self.currentView_values.packagesUnloaded.x = item.x;
              self.currentView_values.packagesUnloaded.y = item.y;
              break;

            case $('.grid-stack-item[data-numberOfContainersLoaded]')[0]:
              self.currentView_values.numberOfContainersLoaded.x = item.x;
              self.currentView_values.numberOfContainersLoaded.y = item.y;
              break;

            case $('.grid-stack-item[data-onFieldOfficers]')[0]:
              self.currentView_values.onFieldOfficers.x = item.x;
              self.currentView_values.onFieldOfficers.y = item.y;
              break;

            case $('.grid-stack-item[data-securitySettingsUpdates]')[0]:
              self.currentView_values.securitySettingsUpdates.x = item.x;
              self.currentView_values.securitySettingsUpdates.y = item.y;
              break;

            case $('.grid-stack-item[data-craneUsage]')[0]:
              self.currentView_values.craneUsage.x = item.x;
              self.currentView_values.craneUsage.y = item.y;
              break;

            case $('.grid-stack-item[data-unlabledData]')[0]:
              self.currentView_values.unlabledData.x = item.x;
              self.currentView_values.unlabledData.y = item.y;
              break;

            default:
              break;
          }
        })
      }
    })
  }

  //Depricated - Saved for later
  gridDestroy() {
    this.gsHeight = $('.grid-stack').height();
    $('.grid-stack').removeClass().addClass('grid-stack');
    $('.grid-stack').removeAttr('style');
    $('.grid-stack').removeAttr('data-gs-current-height');
    $('.grid-stack-item').removeClass().addClass('grid-stack-item');
    $('.grid-stack-item-content').removeClass().addClass('grid-stack-item-content');
    $('.grid-stack-item').children('.ui-resizable-handle').remove();
  }

  forcePosition() {
    let grid = $('.grid-stack').data('gridstack');

    grid.move($('.grid-stack-item[data-currentData]'), this.currentView_values.currentData.x, this.currentView_values.currentData.y);
    grid.move($('.grid-stack-item[data-numberOfCompartmentUsers]'), this.currentView_values.numberOfCompartmentUsers.x, this.currentView_values.numberOfCompartmentUsers.y);
    grid.move($('.grid-stack-item[data-numberOfContainers]'), this.currentView_values.numberOfContainers.x, this.currentView_values.numberOfContainers.y);
    grid.move($('.grid-stack-item[data-totalDivisions]'), this.currentView_values.totalDivisions.x, this.currentView_values.totalDivisions.y);
    grid.move($('.grid-stack-item[data-ERPActiveUsers]'), this.currentView_values.ERPActiveUsers.x, this.currentView_values.ERPActiveUsers.y);
    grid.move($('.grid-stack-item[data-ERPAccessLocations]'), this.currentView_values.ERPAccessLocations.x, this.currentView_values.ERPAccessLocations.y);
    grid.move($('.grid-stack-item[data-vouchersUsage]'), this.currentView_values.vouchersUsage.x, this.currentView_values.vouchersUsage.y);
    grid.move($('.grid-stack-item[data-usersUsingBoiAuth]'), this.currentView_values.usersUsingBoiAuth.x, this.currentView_values.usersUsingBoiAuth.y);
    grid.move($('.grid-stack-item[data-usersUsingIdCards]'), this.currentView_values.usersUsingIdCards.x, this.currentView_values.usersUsingIdCards.y);
    grid.move($('.grid-stack-item[data-trackersDeployed]'), this.currentView_values.trackersDeployed.x, this.currentView_values.trackersDeployed.y);
    grid.move($('.grid-stack-item[data-realTimeDataPoints]'), this.currentView_values.realTimeDataPoints.x, this.currentView_values.realTimeDataPoints.y);
    grid.move($('.grid-stack-item[data-fileApprovedToday]'), this.currentView_values.fileApprovedToday.x, this.currentView_values.fileApprovedToday.y);
    grid.move($('.grid-stack-item[data-containerForwardingApproved]'), this.currentView_values.containerForwardingApproved.x, this.currentView_values.containerForwardingApproved.y);
    grid.move($('.grid-stack-item[data-packagesUnloaded]'), this.currentView_values.packagesUnloaded.x, this.currentView_values.packagesUnloaded.y);
    grid.move($('.grid-stack-item[data-numberOfContainersLoaded]'), this.currentView_values.numberOfContainersLoaded.x, this.currentView_values.numberOfContainersLoaded.y);
    grid.move($('.grid-stack-item[data-onFieldOfficers]'), this.currentView_values.onFieldOfficers.x, this.currentView_values.onFieldOfficers.y);
    grid.move($('.grid-stack-item[data-securitySettingsUpdates]'), this.currentView_values.securitySettingsUpdates.x, this.currentView_values.securitySettingsUpdates.y);
    grid.move($('.grid-stack-item[data-craneUsage]'), this.currentView_values.craneUsage.x, this.currentView_values.craneUsage.y);
    grid.move($('.grid-stack-item[data-unlabledData]'), this.currentView_values.unlabledData.x, this.currentView_values.unlabledData.y);
  }

  // Remove, Open, and Close Widgets
  initWidgetCustomize() {
    let self = this;

    //remove specific widget
    $('.remove').on('click', function(ev) {
      switch ($(this).parents('.grid-stack-item')[0]) {
        case $('.grid-stack-item[data-currentData]')[0]:
          self.currentView_values.currentData.on = false;
          break;

        case $('.grid-stack-item[data-numberOfCompartmentUsers]')[0]:
          self.currentView_values.numberOfCompartmentUsers.on = false;
          break;

        case $('.grid-stack-item[data-numberOfContainers]')[0]:
          self.currentView_values.numberOfContainers.on = false;
          break;

        case $('.grid-stack-item[data-totalDivisions]')[0]:
          self.currentView_values.totalDivisions.on = false;
          break;

        case $('.grid-stack-item[data-ERPActiveUsers]')[0]:
          self.currentView_values.ERPActiveUsers.on = false;
          break;

        case $('.grid-stack-item[data-ERPAccessLocations]')[0]:
          self.currentView_values.ERPAccessLocations.on = false;
          break;

        case $('.grid-stack-item[data-vouchersUsage]')[0]:
          self.currentView_values.vouchersUsage.on = false;
          break;

        case $('.grid-stack-item[data-usersUsingBoiAuth]')[0]:
          self.currentView_values.usersUsingBoiAuth.on = false;
          break;

        case $('.grid-stack-item[data-usersUsingIdCards]')[0]:
          self.currentView_values.usersUsingIdCards.on = false;
          break;

        case $('.grid-stack-item[data-trackersDeployed]')[0]:
          self.currentView_values.trackersDeployed.on = false;
          break;

        case $('.grid-stack-item[data-realTimeDataPoints]')[0]:
          self.currentView_values.realTimeDataPoints.on = false;
          break;

        case $('.grid-stack-item[data-fileApprovedToday]')[0]:
          self.currentView_values.fileApprovedToday.on = false;
          break;

        case $('.grid-stack-item[data-containerForwardingApproved]')[0]:
          self.currentView_values.containerForwardingApproved.on = false;
          break;

        case $('.grid-stack-item[data-packagesUnloaded]')[0]:
          self.currentView_values.packagesUnloaded.on = false;
          break;

        case $('.grid-stack-item[data-numberOfContainersLoaded]')[0]:
          self.currentView_values.numberOfContainersLoaded.on = false;
          break;

        case $('.grid-stack-item[data-onFieldOfficers]')[0]:
          self.currentView_values.onFieldOfficers.on = false;
          break;

        case $('.grid-stack-item[data-securitySettingsUpdates]')[0]:
          self.currentView_values.securitySettingsUpdates.on = false;
          break;

        case $('.grid-stack-item[data-craneUsage]')[0]:
          self.currentView_values.craneUsage.on = false;
          break;

        case $('.grid-stack-item[data-unlabledData]')[0]:
          self.currentView_values.unlabledData.on = false;
          break;

        default:
          break;
      }

      self.getViewItems();
    });

    //open add widget tab
    $('.add').on('click', function(ev) {
      self.isAddWidget = true;
    });

    //close add widget tab
    $('.add-widgets').on('click', function(ev) {
      self.isAddWidget = false;
    })
  }

  addWidget(item) {
    switch (item.name) {
      case 'Current Data':
        this.currentView_values.currentData.on = true;
        break;

      case 'Number of Compartment Users':
        this.currentView_values.numberOfCompartmentUsers.on = true;
        break;

      case 'Number of Containers':
        this.currentView_values.numberOfContainers.on = true;
        break;

      case 'Total Divisions':
        this.currentView_values.totalDivisions.on = true;
        break;

      case 'ERP Active Users':
        this.currentView_values.ERPActiveUsers.on = true;
        break;

      case 'ERP Access Locations':
        this.currentView_values.ERPAccessLocations.on = true;
        break;

      case 'Vouchers Usage':
        this.currentView_values.vouchersUsage.on = true;
        break;

      case 'Users using Bio Auth':
        this.currentView_values.usersUsingBoiAuth.on = true;
        break;

      case 'Users using ID Cards':
        this.currentView_values.usersUsingIdCards.on = true;
        break;

      case 'Trackers Deployed':
        this.currentView_values.trackersDeployed.on = true;
        break;

      case 'Real time data points':
        this.currentView_values.realTimeDataPoints.on = true;
        break;

      case 'File Approved Today':
        this.currentView_values.fileApprovedToday.on = true;
        break;

      case 'Container Forwarding Approved':
        this.currentView_values.containerForwardingApproved.on = true;
        break;

      case 'Packages loaded':
        this.currentView_values.packagesUnloaded.on = true;
        break;

      case 'Number of Containers Loaded':
        this.currentView_values.numberOfContainersLoaded.on = true;
        break;

      case 'On field Officers':
        this.currentView_values.onFieldOfficers.on = true;
        break;

      case 'Security Setting Updates':
        this.currentView_values.securitySettingsUpdates.on = true;
        break;

      case 'Crane Usage':
        this.currentView_values.craneUsage.on = true;
        break;

      case 'Unlabled Data':
        this.currentView_values.unlabledData.on = true;
        break;

      default:
        break;
    }

    this.getViewItems();
  }

  // adding new view
  addView() {
    let newView = prompt('Name your new view', 'new View');

    if(newView != null) {
      let _view = { name: '', values: {} };
      _view.name = newView;
      _view.values = {
        currentData: {name:'Current Data',                                  on:true, x:0, y:0},
        numberOfCompartmentUsers: {name:'Number of Compartment Users',      on:true, x:0, y:4},
        numberOfContainers: {name:'Number of Containers',                   on:true, x:2, y:0},
        totalDivisions: {name:'Total Divisions',                            on:true, x:8, y:0},
        ERPActiveUsers: {name:'ERP Active Users',                           on:true, x:8, y:6},
        ERPAccessLocations: {name:'ERP Access Locations',                   on:true, x:0, y:9},
        vouchersUsage: {name:'Vouchers Usage',                              on:true, x:8, y:11},
        usersUsingBoiAuth: {name:'Users using Bio Auth',                    on:true, x:0, y:16},
        usersUsingIdCards: {name:'Users using ID Cards',                    on:true, x:2, y:16},
        trackersDeployed: {name:'Trackers Deployed',                        on:true, x:4, y:16},
        realTimeDataPoints: {name:'Real time data points',                  on:true, x:6, y:16},
        fileApprovedToday: {name:'File Approved Today',                     on:true, x:0, y:20},
        containerForwardingApproved: {name:'Container Forwarding Approved', on:true, x:8, y:17},
        packagesUnloaded: {name:'Packages loaded',                          on:true, x:8, y:22},
        numberOfContainersLoaded: {name:'Number of Containers Loaded',      on:true, x:10, y:17},
        onFieldOfficers: {name:'On field Officers',                         on:true, x:0, y:26},
        securitySettingsUpdates: {name:'Security Setting Updates',          on:true, x:2, y:26},
        craneUsage: {name:'Crane Usage',                                    on:true, x:8, y:26},
        unlabledData: {name:'Unlabled Data',                                on:true, x:10, y:26},
      };

      this.views.push(_view);
      this.viewNames.push(newView);

      this.currentView_name = newView;
      setTimeout(() => $('#viewsController').val(newView) , 100);
      this.getViewValues();
      this.getViewItems();
    }
  }

  // removing view
  removeView() {
    let self = this;
    let newView = [];

    // stop when only one view is left
    if(this.views.length == 1) { return false }

    // deleting the current view from views
    _.forEach(this.views, function(view) {
      ( view.name == self.currentView_name ) ? false : newView.push(view);
    })
    this.views = newView;

    // changing the current view to the next one
    this.currentView_name = this.views[0].name;
    this.currentView_values = this.views[0].values;
    this.viewNames = [];
    _.forEach(this.views, (view) => this.viewNames.push(view.name));
  }

  // console log the current views
  uploadViews() {
    console.log( this.views )
  }

}
