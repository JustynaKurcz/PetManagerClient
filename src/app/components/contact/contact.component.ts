import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  contactInfo = {
    phone: '+48 531 032 552',
    email: 'kontakt@petmanager.pl',
    linkedin: 'https://www.linkedin.com/in/justynakurcz/',
    location: 'Tarnów, Polska',
    availableHours: '8:00 - 16:00',
    companyName: 'Menedżer Zwierząt Domowych ',
    description: 'Projekt powstał z połączenia pasji do programowania oraz miłości do zwierząt. Skontaktuj się ze mną, aby dowiedzieć się więcej o aplikacji.'
  };

  openLinkedIn(): void {
    window.open(this.contactInfo.linkedin, '_blank');
  }
}
