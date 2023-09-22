import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `<div>Hello {{value}}</div>`,
})
export class AppComponent {
  value = 'World';
  constructor(private httpClient: HttpClient) {

  }

  ngOnInit() {
    this.httpClient.get('/api/products/v1/products?store_id=BCH768&last_modified=2023-03-01T6:00%2B12:00').subscribe(data => console.log(data))
  }
}
