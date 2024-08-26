import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tile-container',
  templateUrl: './tile-container.component.html',
  styleUrls: ['./tile-container.component.scss'],
})
export class TileContainerComponent implements OnInit {
  charts = [
    { 
      name: 'Bar', 
      component: 'app-bar-chart', 
      data: [
        { date: 'January', value1: 150, value2: 200, value3: 180 },
        { date: 'February', value1: 200, value2: 180, value3: 220 },
        { date: 'March', value1: 250, value2: 230, value3: 210 },
        // Add more points as needed
      ] 
    },
    { 
      name: 'Line', 
      component: 'app-line-chart', 
      data: [
        { date: new Date('2024-01-01'), series1: 500, series2: 600, series3: 700 },
        { date: new Date('2024-02-01'), series1: 550, series2: 620, series3: 680 },
        { date: new Date('2024-03-01'), series1: 580, series2: 640, series3: 720 },
        // Add more points as needed
      ] 
    },
    { 
      name: 'Fintech', 
      component: 'app-fintech-chart', 
      data: [
        { task: 'Buy AAPL', startTime: new Date('2024-01-10'), endTime: new Date('2024-01-12') },
        { task: 'Sell TSLA', startTime: new Date('2024-01-15'), endTime: new Date('2024-01-18') },
        { task: 'Buy AMZN', startTime: new Date('2024-02-01'), endTime: new Date('2024-02-03') },
        // Add more tasks as needed
      ] 
    },
    { 
      name: 'Map', 
      component: 'app-geo-chart', 
      data: [
        { name: 'Restaurant A', coordinates: [40.7128, -74.0060], city: 'New York', state: 'NY' },
        { name: 'Restaurant B', coordinates: [34.0522, -118.2437], city: 'Los Angeles', state: 'CA' },
        { name: 'Restaurant C', coordinates: [41.8781, -87.6298], city: 'Chicago', state: 'IL' },
        // Add more locations as needed
      ] 
    }
  ];

  expandedTileIndex: number | null = null;

  ngOnInit(): void {

  }

  openTile(index: number): void {
    console.log(`Tile clicked: ${this.charts[index].name}`);
    this.expandedTileIndex = this.expandedTileIndex === index ? null : index;
  }
}
