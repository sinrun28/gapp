import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';

@Injectable()
export class InMemoryDataService implements InMemoryDbService {

  constructor() { }

  createDb() {
    let data = [
      {
        id: 1,
        name: 'Current Data',
        val: [ {name: 'Current Data', val: 127}, {name: 'Old Data', val:117}, {name: 'New Data', val: 10} ]
      },
      {
        id: 2,
        name: 'Number of Compartment',
        val: 21
      },
      {
        id: 3,
        name: 'Pie-No of Containers',
        val: [35, 20, 30, 15]
      },
      {
        id: 4,
        name: 'Bar-No of Containers',
        val: [4000, 2000, 1900, 1500, 1400, 1300, 1200, 1000, 800, 700, 600, 500, 400, 300, 200, 100]
      },
      {
        id: 5,
        name: 'Bar-Total Divisions',
        val: [0, 70, 90, 60, 100]
      },
      {
        id: 6,
        name: 'ERP Active Users',
        val: { ho: 127, mumbai: 99, sing: 10, chennai: 101, dubai: 87 }
      },
      {
        id: 7,
        name: 'ERP Access Locations',
        val: [ [-34.397, 150.644], [-30.397, 150.644], [-20.397, 140.644], [-31.397, 130.644], [-21.397, 120.644] ]
      },
      {
        id: 8,
        name: 'Vouchers Usage',
        val: [0, 70, 90, 60, 100]
      },
      {
        id: 9,
        name: 'Users using Bio Auth',
        val: 20
      },
      {
        id: 10,
        name: 'Users using ID Cards',
        val: 109
      },
      {
        id: 11,
        name: 'Trackers Deployed',
        val: 150
      },
      {
        id: 12,
        name: 'Real time data points',
        val: 11
      },
      {
        id: 13,
        name: 'File Approved Today',
        val: [23.35, 23.46, 37.07, 24.1, 31.54, 24.97, 31.52, 27.01, 27.27, 24.45, 26.26, 23.2]
      },
      {
        id: 14,
        name: 'Container Forwarding Approved',
        val: 2
      },
      {
        id: 15,
        name: 'Packages unloaded',
        val: [ {name: 'Packages loaded', val: 127}, {name: 'Packages unloaded', val:349}, {name: 'total Packages', val: 476} ]
      },
      {
        id: 16,
        name: 'No of Containers',
        val: [35, 20, 30, 15]
      },
      {
        id: 17,
        name: 'No of Packages',
        val: [35, 20, 30, 15]
      },
      {
        id: 18,
        name: 'On Field Officers',
        val: 9
      },
      {
        id: 19,
        name: 'Security Setting Updates',
        val: [
          {event: 'User', name: 'pramod sharma', action: 'deleted', date: 'Yesterday, 19:20'},
          {event: 'Added', name: 'rohan patil', action: 'to group Staff', date: 'Today, 11:34'},
          {event: 'Saw', name: 'vinay gupta', action: 'password', date: 'Today, 13:03'},
          {event: 'User', name: 'pramod sharma', action: 'deleted', date: 'Yesterday, 19:20'}
        ]
      },
      {
        id: 20,
        name: 'Crane Usage',
        val: [ {name: 'rajesh', val: '22'}, {name: 'rohan', val: '10'} ]
      },
      {
        id: 21,
        name: 'untitled',
        val: {clients: '3', partners: '7'}
      }
    ];

    let views = [
      {
        name: 'Default View',
        values: {
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
        }
      },
      {
        name: 'mini View',
        values: {
          currentData: {name:'Current Data',                                  on:true, x:0, y:0},
          numberOfCompartmentUsers: {name:'Number of Compartment Users',      on:true, x:0, y:4},
          numberOfContainers: {name:'Number of Containers',                   on:true, x:2, y:0},
          totalDivisions: {name:'Total Divisions',                            on:true, x:8, y:0},
          ERPActiveUsers: {name:'ERP Active Users',                           on:true, x:8, y:6},
          ERPAccessLocations: {name:'ERP Access Locations',                   on:true, x:0, y:9},
          vouchersUsage: {name:'Vouchers Usage',                              on:false, x:8, y:11},
          usersUsingBoiAuth: {name:'Users using Bio Auth',                    on:false, x:0, y:16},
          usersUsingIdCards: {name:'Users using ID Cards',                    on:false, x:2, y:16},
          trackersDeployed: {name:'Trackers Deployed',                        on:false, x:4, y:16},
          realTimeDataPoints: {name:'Real time data points',                  on:false, x:6, y:16},
          fileApprovedToday: {name:'File Approved Today',                     on:false, x:0, y:20},
          containerForwardingApproved: {name:'Container Forwarding Approved', on:false, x:8, y:17},
          packagesUnloaded: {name:'Packages loaded',                          on:false, x:8, y:22},
          numberOfContainersLoaded: {name:'Number of Containers Loaded',      on:false, x:10, y:17},
          onFieldOfficers: {name:'On field Officers',                         on:false, x:0, y:26},
          securitySettingsUpdates: {name:'Security Setting Updates',          on:false, x:2, y:26},
          craneUsage: {name:'Crane Usage',                                    on:false, x:8, y:26},
          unlabledData: {name:'Unlabled Data',                                on:false, x:10, y:26},
        }
      }
    ]

    return { data, views };
  }

}
