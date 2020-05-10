import { Component, OnInit } from '@angular/core';
import { StackStore } from 'src/stores/stack.store';

@Component({
  selector: 'app-stack',
  templateUrl: './stack.component.html',
  styleUrls: ['./stack.component.scss']
})
export class StackComponent implements OnInit {

  constructor(public stackStore: StackStore, ) { }

  ngOnInit(): void {
  }

}
