import { AlertController } from '@ionic/angular';
import { ToastServiceService } from 'src/app/services/toast-service.service';
import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string;
  senha: string;

  constructor(
    private fireService: FirebaseService,
    private toastService: ToastServiceService,
    private alertController: AlertController,
    private afAuth: AngularFireAuth,
  ) {}

  ngOnInit() {}

  async redefinir() {
    const alert = await this.alertController.create({
      header: 'Confirmar redefinição de senha',
      message: 'Tem certeza que deseja redefinir a senha?',
      inputs: [
        {
          name: 'emailr',
          type: 'text',
          placeholder: 'Digite seu Email',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'Cancelar',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          },
        },
        {
          text: 'Confirmar!',
          handler: (alertData) => {
            this.recuperarSenha(alertData.emailr)
              .then(() => {
                this.toastService.showToast(
                  'Um email de recuperação foi enviado para a caixa de entrada do email ' +
                    alertData.emailr,
                  3000
                );
              })
              .catch((e) => {
                this.toastService.showToast(e.message, 3000);
              });
          },
        },
      ],
    });

    await alert.present();
  }

  recuperarSenha(email: any) {
    return this.afAuth.sendPasswordResetEmail(email);
  }

  async realizarLogin() {
    this.fireService.loginWithEmail(this.email, this.senha);
  }
}