import { Component, OnInit, Input, ElementRef } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss']
})
export class BarComponent implements OnInit {
  @Input() data: { date: string, value1: number, value2: number, value3: number }[] = [];

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.createChart();
  }

  createChart(): void {
    const element = this.el.nativeElement;
    const data = this.data;

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 450 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select(element)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .domain(data.map(d => d.date))
      .range([0, width])
      .padding(0.2);

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => Math.max(d.value1, d.value2, d.value3)) as number])
      .nice()
      .range([height, 0]);

    svg.append('g')
      .call(d3.axisLeft(y));

    svg.selectAll('.bar1')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar1')
      .attr('x', d => x(d.date)!)
      .attr('y', d => y(d.value1))
      .attr('width', x.bandwidth() / 3)
      .attr('height', d => height - y(d.value1))
      .attr('fill', '#69b3a2');

    svg.selectAll('.bar2')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar2')
      .attr('x', d => x(d.date)! + x.bandwidth() / 3)
      .attr('y', d => y(d.value2))
      .attr('width', x.bandwidth() / 3)
      .attr('height', d => height - y(d.value2))
      .attr('fill', '#404080');

    svg.selectAll('.bar3')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar3')
      .attr('x', d => x(d.date)! + (x.bandwidth() * 2) / 3)
      .attr('y', d => y(d.value3))
      .attr('width', x.bandwidth() / 3)
      .attr('height', d => height - y(d.value3))
      .attr('fill', '#ff4d4d');
  }
}
