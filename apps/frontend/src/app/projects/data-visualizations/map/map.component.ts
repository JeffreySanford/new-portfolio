import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { from } from 'rxjs';

type GeoJsonProperties = { [key: string]: any };

interface GeoFeature extends d3.ExtendedFeature<d3.GeoGeometryObjects, GeoJsonProperties> {
  properties: {
    name: string;
  };
}

interface FeatureCollection {
  type: 'FeatureCollection';
  features: GeoFeature[];
}

@Component({
  selector: 'app-map-chart',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit {
  @ViewChild('chart') private chartContainer: ElementRef | undefined;

  private emptyDataset: GeoFeature[] = [];
  private usMapDataUrl = 'https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json';

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    console.log('Step 1: Map chart initialized');
  }

  ngAfterViewInit(): void {
    console.log('Step 2: View initialized');
    setTimeout(() => {
      if (this.chartContainer) {
        this.createUSMap();
      }
    }, 0);
  }

  private createUSMap(): void {
    console.log('Step 3: Creating US Map');
    const element = this.chartContainer?.nativeElement;
    const width = 960;
    const height = 600;

    const svgElement = this.renderer.createElement('svg', 'svg');
    this.renderer.setAttribute(svgElement, 'width', `${width}`);
    this.renderer.setAttribute(svgElement, 'height', `${height}`);
    this.renderer.appendChild(element, svgElement);

    const svg = d3.select<SVGSVGElement, unknown>(svgElement);

    console.log('Step 4: Adding title and description');
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .attr('class', 'title')
      .text('Zoomable U.S. Map with D3.js v7');

    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 60)
      .attr('text-anchor', 'middle')
      .attr('class', 'description')
      .text('Explore the U.S. by zooming in and out. Map created with D3.js v7 and TopoJSON data.');

    console.log('Step 5: Setting up projection');
    const projection = d3.geoAlbersUsa()
      .scale(1000)
      .translate([width / 2, height / 2 + 40]);

    const path: d3.GeoPath<any, GeoFeature> = d3.geoPath().projection(projection);

    console.log('Step 6: Fetching U.S. map data');
    from(d3.json<FeatureCollection>(this.usMapDataUrl))
      .subscribe({
        next: (data: FeatureCollection | undefined): void => {
          if (!data) {
            console.error('No data received.');
            return;
          }

          console.log('Step 7: Data received:', data);

          const g = svg.append('g');

          console.log('Step 8: Rendering states');
          g.selectAll<SVGPathElement, GeoFeature>('path')
            .data(data.features || this.emptyDataset)
            .enter()
            .append('path')
            .attr('d', (d: GeoFeature) => {
              console.log(`Step 9: Rendering state: ${d.properties.name}`);
              return path(d) as string;
            })
            .attr('fill', '#69b3a2')
            .attr('stroke', 'black');

          console.log('Step 10: All states rendered');
        },
        error: (error) => {
          console.error('Error loading U.S. map data:', error);
        }
      });
  }
}