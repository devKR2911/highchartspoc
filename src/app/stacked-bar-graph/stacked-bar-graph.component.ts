import { Component, OnInit } from '@angular/core';

import * as Highcharts from 'highcharts';

import graphdata from './data.json';

declare var require: any;
const Boost = require('highcharts/modules/boost');
const noData = require('highcharts/modules/no-data-to-display');
const More = require('highcharts/highcharts-more');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);

@Component({
  selector: 'app-stacked-bar-graph',
  templateUrl: './stacked-bar-graph.component.html',
  styleUrls: ['./stacked-bar-graph.component.scss']
})
export class StackedBarGraphComponent implements OnInit {
  constructor() {}
  public itemsPerScreen = { id: 0, value: 5 };
  public buttonArray = [];
  public visibleData = [];
  public chart;

  public graphOptions = [
    { id: 0, value: 5 },
    { id: 1, value: 10 },
    { id: 2, value: 15 }
  ];

  public options: any = {
    chart: {
      type: 'column',
      plotBorderColor: '#e6e6e6',
      plotBorderWidth: 1
    },

    title: {
      text: '7. Pension Plan'
    },

    xAxis: {
      tickWidth: 1,
      tickmarkPlacement: 'on',
      gridLineWidth: 1,
      lineColor: 'transparent',
      title: {
        text: 'Aika'
      },
      offset: 20,
      categories: [],
      labels: {
        formatter: function() {
          let ret = this.value,
            len = ret.length;
          if (len > 6) {
            ret = ret.slice(0, 6) + '<br/>' + ret.slice(6, len);
          }

          if (len > 25) {
            ret = ret.slice(0, 25) + '...';
          }
          return ret;
        },
        y: 25
      }
    },

    yAxis: {
      allowDecimals: false,
      min: 0,
      tickWidth: 1,
      gridLineWidth: 1,
      title: {
        text: 'Euroa'
      },
      labels: {
        formatter: function() {
          return this.value;
        }
      }
    },

    tooltip: {
      formatter: function() {
        return (
          '<b>' +
          this.x +
          '</b><br/>' +
          this.series.name +
          ': ' +
          this.y +
          '<br/>' +
          'Total: ' +
          this.point.stackTotal
        );
      }
    },

    plotOptions: {
      column: {
        stacking: 'normal',
        pointPadding: 0,
        borderWidth: 0
      }
    },

    series: []
  };

  public onPagination = function(index) {
    this.visibleData = graphdata.slice(
      this.itemsPerScreen.value * index,
      (index + 1) * this.itemsPerScreen.value
    );
    this.parseData(true);
  };

  public onChange = function(bool) {
    const totalCount = graphdata.length;
    const buttonCount = Math.ceil(totalCount / this.itemsPerScreen.value);
    this.buttonArray = [];
    for (let i = 0; i < buttonCount; i++) {
      this.buttonArray.push(i);
    }
    this.onPagination(0);
    this.parseData(bool);

    // this.rebindGraph();
  };

  public parseData = function(bool) {
    const categories = [];
    const pensionData = { name: 'Pension', data: [], color: '#ff5622' };
    const salaryData = { name: 'Salary', data: [], color: '#9013fe' };
    const extraPensionData = {
      name: 'Extra Pension',
      data: [],
      color: '#feab00'
    };
    this.visibleData.forEach(item => {
      categories.push(item.date);
      pensionData.data.push(item.value.Pension);
      salaryData.data.push(item.value.Salary);
      extraPensionData.data.push(item.value.ExtraPension);
    });
    const series = [pensionData, salaryData, extraPensionData];
    this.options.series = series;
    this.options.xAxis.categories = categories;
    // this.chart.redraw();
    if (bool && this.chart) {
      this.chart.update(this.options);
    }
  };

  public rebindGraph = function() {};

  ngOnInit() {
    this.onChange(false);
    this.chart = Highcharts.chart('container', this.options);
  }
}
