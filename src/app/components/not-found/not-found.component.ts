import {Component} from '@angular/core';
import {RouterLink} from "@angular/router";
import {PrimengImports} from "../../constants/primeng-imports";

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [...PrimengImports, RouterLink],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent {
}
