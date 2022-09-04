import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as d3 from "d3";

@Component({
  selector: 'app-chart-experiment',
  templateUrl: './chart-experiment.component.html',
  styleUrls: ['./chart-experiment.component.css']
})
export class ChartExperimentComponent implements OnInit {

  @ViewChild('svgcontainer') container!: ElementRef;

  width!: number

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    console.log("ngAfterViewInit", this.container.nativeElement.offsetWidth);
    this.width = this.container.nativeElement.offsetWidth


    // this.drawPath()
    this.drawBall()
  }

  drawPath() {
    function gen() {
      let data = [];
      for (let i = 0, v = 2; i < 50; ++i) {
        v += Math.random() - 0.5;
        v = Math.max(Math.min(v, 4), 0);
        data.push({step: i, value: v});
      }
      return data
    }

    const svgContainer = d3.select(".svgcontainer");
    let width = this.width/2
    let svg = svgContainer
      .append("svg:svg")
      .attr("width", width)
      .attr("height", 200)

    let walk = gen()

    let xMapper: any = (obj: any) => obj['step']
    let yMapper: any = (obj: any) => obj['value']

    let walkX = d3.scaleLinear()
      .domain([0, 49])
      .range([10, width - 10])

    let walkY = d3.scaleLinear()
      .domain([0, 4])
      .range([200 - 10, 10])

    let line: any = d3.line()
      .x(d => walkX(xMapper(d)))
      .y(d => walkY(yMapper(d)))

    console.log(walk)
    console.log(line(walk))

    svg
      .append("path")
      .data(gen())
      .attr("d", line(walk))
      .attr("stroke", "black")
      .attr("fill", "none")

    let shuffled = d3.shuffle(walk.slice());
    console.log("shuffled", shuffled)
    svg
      .append("path")
      .data(gen())
      .attr("d", line(shuffled))
      .attr("stroke", "black")
      .attr("fill", "none")
      .attr('stroke-width', "0.3")

  }

  drawBall() {
    const svgContainer = d3.select(".svgcontainer");
    let width = this.width/2
    let svg = svgContainer
      .append("svg:svg")
      .attr("width", width)
      .attr("height", 1000)


    function gen() {
      let vx = width / 2, vy = 250;
      const data = [];
      for (let i = 0; i < 1000; i++) {
        // Random walk with large or small steps.
        const l = Math.random() < 0.05 ? 100 : 10;
        data.push({
          step: i,
          x: vx += l * (Math.random() - 0.5),
          y: vy += l * (Math.random() - 0.5)
        });
      }
      return data
    }
    let walk = gen()
    console.log(walk)


    let xMapper: any = (obj: any) => obj['x']
    let yMapper: any = (obj: any) => obj['y']

    let X:number[] = d3.map(walk, xMapper)
    let Y:number[] = d3.map(walk, yMapper)

    console.log("Y", Y)
    console.log("extent", d3.extent(Y))
    let yExtent: any = d3.extent(Y)
    let xExtent:any = d3.extent(X)

    let walkX = d3.scaleLinear()
      .domain(xExtent)
      .range([10, width - 10])

    let walkY = d3.scaleLinear()
      .domain(yExtent)
      .range([1000 - 10, 10])

    let footballLine: any = d3.line().x(d=> walkX(xMapper(d))).y( d=>walkY(yMapper(d)))

    console.log(footballLine(walk))

    svg
      .append("path")
      // .data([gen()])
      .attr("d", footballLine(walk))
      .attr("stroke", "black")
      .attr("fill", "none")

  }
}
