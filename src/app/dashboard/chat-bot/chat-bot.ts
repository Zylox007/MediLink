import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Botservice } from './botservice';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-chat-bot',
  imports: [FormsModule,NgClass],
  templateUrl: './chat-bot.html',
  styleUrl: './chat-bot.css'
})
export class ChatBot implements OnInit {
  id: number | null = null;
  message = '';
  messages: { from: string, text: string }[] = [];
  constructor(private route: ActivatedRoute, private botService: Botservice) {}
  ngOnInit(): void {
    this.id = this.route.parent?.snapshot.params['idp'];
  }
  envoyer() {
    if (!this.message.trim()) return;

    // Afficher le message utilisateur
    this.messages.push({ from: 'user', text: this.message });

    // Appeler le backend
    this.botService.envoyerMessage(this.message).subscribe({
      next: (res) => {
        this.messages.push({ from: 'bot', text: res.reply });
      },
      error: (err) => {
        console.error('Erreur chatbot:', err);
        this.messages.push({ from: 'bot', text: 'Erreur serveur 😢' });
      }
    });

    this.message = '';
  }
}
