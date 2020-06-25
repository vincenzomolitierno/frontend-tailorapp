import { MatDialogConfig, MatDialog } from '@angular/material';
import { ActionConfirmDummyComponent } from './action-confirm-dummy/action-confirm-dummy.component';

export class ActionConfirm {
    constructor(dialog: MatDialog) {

    }

    public static openActionConfirmDialog(titolo: string, messaggio: string) {

        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
          titolo: titolo, 
          messaggio: messaggio,
        };

        // const dialogRef = dialog.open(ActionConfirmDummyComponent, dialogConfig);
    }
}