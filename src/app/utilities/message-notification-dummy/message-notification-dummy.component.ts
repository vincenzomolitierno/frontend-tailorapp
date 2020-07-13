import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-message-notification-dummy',
  templateUrl: './message-notification-dummy.component.html',
  styleUrls: ['./message-notification-dummy.component.css']
})
export class MessageNotificationDummyComponent implements OnInit {

  messages: any;
  titolo: string = "empty";
  messaggio: string = "empty";
  messaggio2: string = "empty";

  constructor(
    public dialogRef: MatDialogRef<MessageNotificationDummyComponent>,
    @Inject(MAT_DIALOG_DATA) data
    ) {
      this.messages = data;
   }

  ngOnInit() {    
    this.titolo = this.messages.titolo;    
    this.messaggio = this.messages.messaggio;    
    this.messaggio2 = this.messages.messaggio2;    

    document.getElementById('message').innerText = this.messaggio;
  }
}
