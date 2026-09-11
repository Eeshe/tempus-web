import { Component } from '@angular/core';
import { AppModal } from '../../shared/modal/modal';
import { ModalBase } from '../../shared/modal/modal-base';

@Component({
  imports: [AppModal],
  selector: 'app-client-modal',
  styleUrl: './client-modal.css',
  templateUrl: './client-modal.html',
})
export class ClientModal extends ModalBase {

}
