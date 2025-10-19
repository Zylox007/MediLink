import { Component, OnInit } from '@angular/core';
import { Patient } from '../patient';
import { ActivatedRoute } from '@angular/router';
import { PatientService } from '../patient-service';

@Component({
  selector: 'app-acc-dashboard',
  imports: [],
  templateUrl: './acc-dashboard.html',
  styleUrl: './acc-dashboard.css'
})
export class AccDashboard implements OnInit{
  user: Patient | null = null;
  id: number | null = null;
  constructor(private route: ActivatedRoute,private patientService: PatientService) {}

  ngOnInit(): void {
    this.id = this.route.parent?.snapshot.params['idp'];
    this.loadPatientData();
  }

  loadPatientData() {
    if (this.id !== null) {
      this.patientService.getPatientById(this.id).subscribe(response => {
        if (response.success) {
          this.user = response.patient as Patient;
        }
      });
    }
  }
}
