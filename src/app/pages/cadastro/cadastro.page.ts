import { ToastServiceService } from './../../services/toast-service.service';
import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { User } from 'src/app/interface/user';
import { FirebaseService } from 'src/app/services/firebase.service';
import { NavegacaoService } from 'src/app/services/navegacao.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage implements OnInit {
  contaExiste: boolean = false;
  user = {} as User;
  userAtual = {} as User;
  senha;
  adm;
  constructor(
    private firebaseService: FirebaseService,
    private nav: NavegacaoService,
    public alertController: AlertController,
    private toast: ToastServiceService
  ) {
  }

  ngOnInit() {
    
  }

  public realizarCadastro() {
    if (!!this.user.nome && !!this.user.email  && !!this.senha) {
      //setando as infromações do basicas do usuário
      this.user.adm = 'nadm';
      this.user.nome = this.user.nome
        .split(' ')
        .map((name) => {
          return name[0].toUpperCase() + name.substring(1).toLowerCase();
        })
        .join(' ');
      let resp = this.firebaseService
        .signUp(this.user, this.senha)
        .then(() => {
          if (resp != null) {
            console.log('cadastrou');
            this.nav.navegarPara('principal');
          }
        })
        .catch(() => {
          this.toast.showToast('Erro ao cadastrar!');
        });
    } else {
      this.toast.showToast(
        'Cadastro não realizado, está faltando informações!'
      );
    }
  }
}