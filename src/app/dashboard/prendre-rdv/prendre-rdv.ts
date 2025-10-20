import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Medecin } from '../list-med/medecin';
import { MedecinService } from '../list-med/MedecinService';
import { PatientService } from '../patient-service';

@Component({
  selector: 'app-prendre-rdv',
  imports: [FormsModule],
  templateUrl: './prendre-rdv.html',
  styleUrl: './prendre-rdv.css'
})
export class PrendreRdv implements OnInit {
  id: number | null = null;
  idm: number | null = null;
  medecins: Medecin[] = [];
  selectedMedecinId!: number;
  selectedDate!: string;
  selectedHeure!: string;
  statut: string = 'En attente';
  minDate: string = '';
  constructor(private route: ActivatedRoute,private medecinService: MedecinService, private patientService: PatientService) {}

  ngOnInit(): void {
    this.id = Number(this.route.parent?.snapshot.params['idp']);
    this.idm = Number(this.route.snapshot.params['idm']);
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }
  submitRdv(): void {
  // Vérifier que tous les champs obligatoires sont remplis
  if (!this.idm) {
    console.error('Aucun médecin sélectionné');
    return;
  }
  if (!this.selectedDate) {
    console.error('Date manquante');
    return;
  }
  if (!this.selectedHeure) {
    console.error('Heure manquante');
    return;
  }
  if (this.id === null) {
    console.error('ID du patient manquant');
    return;
  }

  // Construire l'objet Rendezvous
  const newRdv = {
    idMedecin: this.idm,
    idPatient: this.id,
    date: this.selectedDate,
    heure: this.selectedHeure,
    statut: 'prévu'
  };

  // Appel au service
  this.patientService.prendreRdv(newRdv).subscribe({
    next: (res : any) => {
      console.log('Réponse du serveur :', res);
      if (res.success) {
        console.log('Rendez-vous créé avec succès :', res.rendezvous);
        alert('Votre rendez-vous a été pris !');
        // Optionnel : redirection ou reset du formulaire
      } else {
        console.error('Erreur lors de la création du rendez-vous');

      }
    },
    error: (err) => {
       alert(err.error.message || 'Une erreur est survenue lors de la prise de rendez-vous.');
      console.error('Erreur serveur :', err);
    }
  });
}
}
