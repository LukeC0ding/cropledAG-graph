import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Chart, LineController, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';

Chart.register(LineController, CategoryScale, LinearScale, PointElement, LineElement, Title);

import {formatNumber} from "@angular/common";

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements AfterViewInit {

  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

  public chart: any;
  public intesity = 80;
  private dragging: any = null;

  ngAfterViewInit() {
    this.chart = new Chart("MyChart", {
      type: 'line',

      data: {// values on X-Axis
        labels: [],
        datasets: [
          {
            label: "Color A",
            data: [],
            backgroundColor: 'green',
            borderColor: '#3cba9f',
          },
          {
            label: "Color B",
            data: [],
            backgroundColor: 'pink',
            borderColor: '#ff6384',
          },
          {
            label: "Color C",
            data: [],
            backgroundColor: 'yellow',
            borderColor: '#ffcd56',
          }
        ]
      },
      options: {
        aspectRatio:2.5,
        onClick: (event) => {
          let elements = this.chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);
          if (elements.length) {
            this.dragging = elements[0];
          }
        },
        scales: {
          y: {
            min: 0,
            max: 100,
            ticks: {
              stepSize: 10
            }
          }
        },
      },
    });
    for(let i = 0; i <= 24; i++) {
      const value = formatNumber(i, "en-US", "2.0") + ":00"
      this.chart.data.labels.push(value);
      //Random Number between 40 and 70

      this.chart.data.datasets[0].data.push(Math.floor(Math.random() * 5) * 5 + 50);
      this.chart.data.datasets[1].data.push(Math.floor(Math.random() * 5) * 5 + 50);
      this.chart.data.datasets[2].data.push(Math.floor(Math.random() * 5) * 5 + 50);
    }

    this.canvas.nativeElement.addEventListener('mousedown', (event) => {
      this.dragging = this.chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true)[0] || null;
    });

    this.canvas.nativeElement.addEventListener('mousemove', (event) => {
      if (this.dragging) {
        let yScale = this.chart.scales.y;
        let dataset = this.chart.data.datasets[this.dragging.datasetIndex].data;
        dataset[this.dragging.index] = yScale.getValueForPixel(event.offsetY);
        this.chart.update();
      }
    });

    this.canvas.nativeElement.addEventListener('mouseup', () => {
      this.dragging = null;
    });
  }

  getColors(): any[] {
    console.log(this.chart.data.datasets)
    return this.chart.data.datasets
  }

}
