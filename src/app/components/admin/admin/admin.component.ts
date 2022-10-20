import { Component, OnInit } from '@angular/core';
import {AdminService} from '../../../services/admin/admin.service';
import {Ticket} from '../../../models/authentification/ticket';
import { Clipboard } from '@angular/cdk/clipboard';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
 winner: any;
 ticket: Ticket;
 color = 'primary';
    constructor(private  adminService: AdminService, private clipboard: Clipboard) {
  }

  ngOnInit(): void {
  }
  getWinner(): void {
        this.color = 'primary';
        this.adminService.getWinner().subscribe({
      next: (win) => {
      this.winner = win;
      },
      error: () => {
          this.winner = null;
      }});
  }
    getTicket(): void {
        this.color = 'primary';
        this.adminService.getTicketNumber().subscribe({
            next: (ticket) => {
                this.ticket = ticket.data;
            },
            error: () => {
                this.ticket = null;
            }});
    }
    copyticket(): void {
        this.clipboard.copy(this.ticket.ticket);
        this.color = 'warn';

    }
}
