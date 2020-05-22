import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-percentage',
  templateUrl: './percentage.component.html',
  styleUrls: ['./percentage.component.sass']
})
export class PercentageComponent implements OnInit {

  @Input() 
  public percentage: number;
  public isPercentageLow(): boolean {
    return this.percentage <= 50;
  }
  public isPercentageMedium(): boolean {
    return this.percentage > 50 && this.percentage <= 75;
  }
  public isPercentageHigh(): boolean {
    return this.percentage > 75;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
