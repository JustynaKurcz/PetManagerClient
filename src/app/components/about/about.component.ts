import { Component } from '@angular/core';
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  projectInfo = {
    title: 'Menedżer Zwierząt Domowych',
    author: 'Justyna Kurcz',
    university: 'Akademia Tarnowska',
    faculty: 'Wydział Politechniczny',
    year: '2025',
    supervisor: 'mgr inż. Tomasz Gądek',
    technologies: [
      { name: 'C#',  icon: 'fas fa-code' },
      { name: 'ASP.NET Core', icon: 'fas fa-server' },
      { name: 'Angular', icon: 'fab fa-angular' },
      { name: 'TypeScript', icon: 'fab fa-js' },
      { name: 'PostgreSQL', icon: 'fas fa-database' },
      { name: 'Azure Blob Storage', icon: 'fas fa-cloud' }
    ],
    features: [
      { title: 'Zarządzanie profilami zwierząt', icon: 'fas fa-paw' },
      { title: 'Harmonogram wizyt i szczepień', icon: 'fas fa-calendar-alt' },
      { title: 'Historia zdrowia pupila', icon: 'fas fa-notes-medical' },
      { title: 'Powiadomienia email o zbliżających się terminach', icon: 'fas fa-bell' }
    ]
  };
}
