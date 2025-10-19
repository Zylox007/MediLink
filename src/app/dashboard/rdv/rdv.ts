import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PatientService } from '../patient-service';
import { Rendezvous } from '../patient';


interface CalendarDay {
  date: Date;
  isToday: boolean;
  otherMonth: boolean;
  appointments: Rendezvous[];
}
@Component({
  selector: 'app-rdv',
  imports: [FormsModule, DatePipe],
  templateUrl: './rdv.html',
  styleUrl: './rdv.css'
})
export class Rdv implements OnInit {
  currentMonth = new Date().getMonth();
  currentYear = new Date().getFullYear();
  daysOfWeek = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];
  calendarDays: CalendarDay[] = [];
  selectedDay: CalendarDay | null = null;

  id: number | null = null;
  rdv: Rendezvous[] = [];

  constructor(private route: ActivatedRoute, private patientService: PatientService) {}

  ngOnInit(): void {
    this.id = this.route.parent?.snapshot.params['idp'];
    this.loadRendezvous();
  }

  loadRendezvous() {
    if (this.id !== null) {
      this.patientService.getRendezvousByPatientId(this.id).subscribe(response => {
        if (response.success) {
          this.rdv = response.rendezvous;
          console.log('Rendezvous fetched successfully:', this.rdv);
          this.generateCalendar();
        }
      });
    }
  }

  generateCalendar() {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    this.calendarDays = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const appointmentsForDay = this.rdv.filter(a => {
        if (!a.date) return false;
        const apptDate = new Date(a.date);
        return apptDate.toDateString() === date.toDateString();
      });

      this.calendarDays.push({
        date,
        isToday: date.toDateString() === new Date().toDateString(),
        otherMonth: date.getMonth() !== this.currentMonth,
        appointments: appointmentsForDay
      });
    }
  }

  previousMonth() {
    this.currentMonth--;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.generateCalendar();
  }

  nextMonth() {
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.generateCalendar();
  }

  selectDay(day: CalendarDay) {
    this.selectedDay = day;
  }

  get currentMonthName(): string {
    return new Date(this.currentYear, this.currentMonth, 1)
      .toLocaleDateString('fr-FR', { month: 'long' });
  }
  annulerRdv(appt: Rendezvous): void {
  if (confirm("Voulez-vous vraiment annuler ce rendez-vous ?")) {
    this.patientService.annulerRendezvous(appt.idRdv!).subscribe({
      next: (res) => {
        alert("Rendez-vous annulé avec succès !");
        this.loadRendezvous();
      },
      error: (err) => console.error("Erreur :", err)
    });
  }
}
  showEditModal = false;
  editDate: string = '';
  editHeure: string = '';
  rdvToEdit: any = null;
  openModal(appt: any) {
  this.showEditModal = true;
  this.rdvToEdit = appt;
  this.editDate = appt.date;
  this.editHeure = appt.heure;
}

closeModal() {
  this.showEditModal = false;
  this.rdvToEdit = null;
}

updateRdv() {
  if (!this.rdvToEdit) return;

  const updatedRdv = {
    ...this.rdvToEdit,
    date: this.editDate,
    heure: this.editHeure,
  };
  console.log('Updating rendez-vous with data:', updatedRdv);

  this.patientService.updateRdv(updatedRdv).subscribe({
    next: res => {
      console.log('Rendez-vous mis à jour:', res);
      this.closeModal();
      this.loadRendezvous(); // 🔄 recharge la liste
    },
    error: err => console.error(err)
  });
}
}
