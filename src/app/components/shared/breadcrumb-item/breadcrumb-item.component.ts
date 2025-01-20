import {Component, Input} from '@angular/core';
import {RouterLink} from "@angular/router";
import {NgForOf, NgIf} from "@angular/common";

interface BreadcrumbItem {
  label: string;
  link: string;
  icon?: string;
}

@Component({
  selector: 'app-breadcrumb-item',
  standalone: true,
  imports: [
    RouterLink,
    NgForOf,
    NgIf
  ],
  templateUrl: './breadcrumb-item.component.html',
  styleUrl: './breadcrumb-item.component.css'
})
export class BreadcrumbItemComponent {
  @Input() items: BreadcrumbItem[] = [];
}

