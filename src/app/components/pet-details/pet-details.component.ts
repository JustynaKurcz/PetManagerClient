import {Component, OnInit} from '@angular/core';
import {CardModule} from "primeng/card";
import {AccordionModule} from "primeng/accordion";
import {TableModule} from "primeng/table";
import {PetDetailsDto} from "../../models/pets/pet-details-dto";
import {PetsService} from "../../services/pets/pets.service";
import {ActivatedRoute} from "@angular/router";
import {HealthRecordsService} from "../../services/health-records/health-records.service";
import {DatePipe} from "@angular/common";
import {TabViewModule} from "primeng/tabview";
import {BadgeModule} from "primeng/badge";
import {DividerModule} from "primeng/divider";
import {ChipModule} from "primeng/chip";
import {TimelineModule} from "primeng/timeline";
import {TagModule} from "primeng/tag";
import {AvatarModule} from "primeng/avatar";
import {PrimengImports} from "../../constants/primeng-imports";

@Component({
  selector: 'app-pet-details',
  standalone: true,
  imports: [
    CardModule,
    AccordionModule,
    TableModule,
    DatePipe,
    TabViewModule,
    BadgeModule,
    DividerModule,
    ChipModule,
    TimelineModule,
    TagModule,
    AvatarModule,
    PrimengImports
  ],
  providers: [PetsService, HealthRecordsService],
  templateUrl: './pet-details.component.html',
  styleUrl: './pet-details.component.css'
})
export class PetDetailsComponent implements OnInit {
  pet!: PetDetailsDto;

  healthRecord = {
    appointments: [
      {
        title: 'Badanie kontrolne',
        appointmentDate: '2024-03-01',
        diagnosis: 'Stan ogólny dobry. Zalecana suplementacja witamin.',
        notes: 'Pacjent aktywny, dobry apetyt. Kontynuacja obecnej diety.'
      },
      {
        title: 'Kontrola stomatologiczna',
        appointmentDate: '2024-01-20',
        diagnosis: 'Kamień nazębny, zalecane czyszczenie.',
        notes: 'Umówiono termin zabiegu czyszczenia na następny miesiąc.'
      },
      {
        title: 'Problemy skórne',
        appointmentDate: '2023-12-10',
        diagnosis: 'Łagodne podrażnienie skóry w okolicy łap.',
        notes: 'Przepisano maść przeciwzapalną. Stosować 2 razy dziennie przez 7 dni.'
      },
      {
        title: 'Badanie krwi',
        appointmentDate: '2023-11-25',
        diagnosis: 'Wszystkie parametry w normie.',
        notes: 'Zalecana kontrola za 6 miesięcy.'
      },
      {
        title: 'Szczepienie przypominające',
        appointmentDate: '2023-10-15',
        diagnosis: 'Wykonano szczepienie przeciwko wściekliźnie. Brak reakcji alergicznych.',
        notes: 'Następne szczepienie za rok. Pacjent dobrze zniósł zabieg.'
      },
      {
        title: 'Profilaktyka przeciwpasożytnicza',
        appointmentDate: '2023-09-01',
        diagnosis: 'Podano preparat przeciwko pasożytom wewnętrznym.',
        notes: 'Kolejne odrobaczanie za 3 miesiące. Zalecono regularne stosowanie preparatu przeciwkleszczowego.'
      },
      {
        title: 'USG jamy brzusznej',
        appointmentDate: '2023-08-10',
        diagnosis: 'Badanie USG bez zmian patologicznych. Narządy wewnętrzne prawidłowe.',
        notes: 'Badanie kontrolne wykonane ze względu na okresowe wymioty. Zalecono dietę lekkostrawną.'
      },
      {
        title: 'Kontrola ortopedyczna',
        appointmentDate: '2023-07-15',
        diagnosis: 'Łagodne objawy dysplazji stawu biodrowego. Stan stabilny.',
        notes: 'Zalecono suplementację glukozaminy i kwasów omega-3. Umiarkowana aktywność fizyczna.'
      },
      {
        title: 'Zabieg chirurgiczny',
        appointmentDate: '2023-06-20',
        diagnosis: 'Usunięcie niewielkiego guza skórnego z okolicy karku. Wynik histopatologiczny łagodny.',
        notes: 'Kontrola pooperacyjna za tydzień. Zmiana opatrunku co 2 dni.'
      }
    ],
    "vaccinations": [
      {
        "name": "Szczepienie przeciw wściekliźnie",
        "vaccinationDate": "2023-12-15",
        "nextVaccinationDate": "2024-12-15"
      },
      {
        "name": "Szczepionka wieloskładnikowa DHPPI (nosówka, parwowiroza, zapalenie wątroby, parainfluenza)",
        "vaccinationDate": "2024-01-20",
        "nextVaccinationDate": "2025-01-20"
      },
      {
        "name": "Szczepienie przeciw boreliozie",
        "vaccinationDate": "2024-03-15",
        "nextVaccinationDate": "2025-03-15"
      },
      {
        "name": "Szczepienie przeciw leptospirozie",
        "vaccinationDate": "2024-04-20",
        "nextVaccinationDate": "2025-04-20"
      }
    ]
  };

  constructor(
    private petsService: PetsService,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    const petId = this.route.snapshot.paramMap.get('petId');
    if (petId) {
      this.loadPetDetails(petId);
    } else {
      console.error('PetId not found in URL parameters.');
    }
  }


  loadPetDetails(petId: string): void {
    this.petsService.getPetDetails(petId).subscribe({
      next: (response) => {
        this.pet = response;
      },
      error: (error) => {
        console.error('Błąd podczas pobierania szczegółów zwierzęcia:', error);
      }
    });
  }

  getVaccinationStatus(nextDate: string): 'success' | 'warning' | 'danger' {
    const today = new Date();
    const nextVaccinationDate = new Date(nextDate);
    const diffTime = nextVaccinationDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return 'danger';
    } else if (diffDays <= 30) {
      return 'warning';
    }
    return 'success';
  }

  getVaccinationStatusLabel(nextDate: string): string {
    const status = this.getVaccinationStatus(nextDate);
    switch (status) {
      case 'danger':
        return 'Przeterminowane';
      case 'warning':
        return 'Wkrótce';
      case 'success':
        return 'Aktualne';
      default:
        return 'Aktualne';
    }
  }

  showDiagnosis(appointment: any) {
    // Implement dialog or tooltip logic here
    console.log('Show diagnosis:', appointment.diagnosis);
  }

}
