import {Component, Input} from '@angular/core';
import {NgForOf} from "@angular/common";

interface Feature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-brand-features',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './brand-features.component.html',
  styleUrl: './brand-features.component.css'
})
export class BrandFeaturesComponent {
  @Input() features: Feature[] = [
    {
      icon: '📋',
      title: 'Zarządzanie profilami',
      description: 'Wszystkie informacje o Twoich pupilach w jednym miejscu'
    },
    {
      icon: '💉',
      title: 'Szczepienia i wizyty',
      description: 'Automatyczne przypomnienia o wizytach i szczepieniach'
    },
    {
      icon: '🌐',
      title: 'Aplikacja webowa',
      description: 'Zarządzaj swoimi zwierzętami bez instalacji, bezpośrednio w przeglądarce'
    }
  ];
}
