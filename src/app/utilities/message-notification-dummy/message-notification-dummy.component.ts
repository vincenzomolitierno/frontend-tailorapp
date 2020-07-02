import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-message-notification-dummy',
  templateUrl: './message-notification-dummy.component.html',
  styleUrls: ['./message-notification-dummy.component.css']
})
export class MessageNotificationDummyComponent implements OnInit {

  titolo: string = "empty";
  messaggio: string = "empty";

  constructor(
    public dialogRef: MatDialogRef<MessageNotificationDummyComponent>,
    @Inject(MAT_DIALOG_DATA) data
    ) {
    this.titolo = data.titolo;    
    this.messaggio = data.messaggio;    

   }

  ngOnInit() {
    document.getElementById('message').innerText = this.messaggio;
  }
}
