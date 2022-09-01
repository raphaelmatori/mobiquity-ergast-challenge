import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Item } from "./models/item.interface";

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
})
export class ListComponent {
  @Input() items: Item[] = [];
  @Input() displayFetchNext: boolean = false;
  @Output() selectedItemCallback: EventEmitter<string> = new EventEmitter();

  selectedItem(id: string): void {
    this.selectedItemCallback.emit(id);
  }
}
