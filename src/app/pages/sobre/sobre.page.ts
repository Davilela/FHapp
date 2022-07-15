import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { User } from 'src/app/interface/user';
import { FirebaseService } from 'src/app/services/firebase.service';
import { NavegacaoService } from 'src/app/services/navegacao.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToastServiceService } from 'src/app/services/toast-service.service';

@Component({
  selector: 'app-sobre',
  templateUrl: './sobre.page.html',
  styleUrls: ['./sobre.page.scss'],
})
export class SobrePage implements OnInit {
  conta : {
    email: string,
    senha: string,
    nome: string
  } = {
    email: '',
    senha: '',
    nome: ''
  }
  listaContas: any = [];

  user = {} as User;
  constructor(
    private nav: NavegacaoService,
    private store: StorageService,
    private route: ActivatedRoute,
    public alertController: AlertController,
    private toast: ToastServiceService,
    private fireService: FirebaseService,
  ) {
    this.route.params.subscribe(() => {
      this.store.getStorage().then((resp) => {
        if (resp == null) {
          this.nav.navegarPara('home');
        }
        console.log(resp);

        let userIntermediario = JSON.parse(resp);
        this.user.nome = userIntermediario.nome;
        this.user.email = userIntermediario.email;
        this.user.adm = userIntermediario.adm;
      });
    });
   }

   adicionarConta(){
    this.alertEdicao();
   }

   async alertEdicao() {
    const alert = await this.alertController.create({
      header: 'Adicionar uma nova conta',
      inputs: [
        {
          name: 'name3',
          type: 'text',
          placeholder: 'Nome do aplicativo',
        },
        {
          name: 'name1',
          type: 'text',
          placeholder: 'Email',
        },
        {
          name: 'name2',
          type: 'text',
          placeholder: 'Senha',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          id: 'cancel-button',
        },
        {
          text: 'Confirmar',
          id: 'confirm-button',
          handler: (bla) => {
            if (!!bla.name1 && !!bla.name2 && !!bla.name3) {
              this.conta.senha= bla.name2;
              this.conta.email = bla.name1;
              this.conta.nome = bla.name3;
              console.log(this.conta);
              this.fireService.saveConta(this.conta).then(
                this.listaContas.push(this.conta)
              );
              this.conta = {nome: '', email: '', senha: ''};
            }else{
              this.toast.showToast("Entre com os dados para fazer essas operação!!")
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async alertEdicaoConta() {
    const alert = await this.alertController.create({
      header: 'Editar a conta',
      inputs: [
        {
          name: 'name3',
          type: 'text',
          placeholder: 'Nome do aplicativo',
        },
        {
          name: 'name1',
          type: 'text',
          placeholder: 'Email',
        },
        {
          name: 'name2',
          type: 'text',
          placeholder: 'Senha',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          id: 'cancel-button',
        },
        {
          text: 'Confirmar',
          id: 'confirm-button',
          handler: (bla) => {
            if (!!bla.name1 && !!bla.name2 && !!bla.name3) {
              this.conta.senha= bla.name2;
              this.conta.email = bla.name1;
              this.conta.nome = bla.name3;
              console.log(this.conta);
              this.fireService.saveConta(this.conta).then(
                this.listaContas.push(this.conta)
              );
              this.conta = {nome: '', email: '', senha: ''};
            }else{
              this.toast.showToast("Entre com os dados para fazer essas operação!!")
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async editarConta(){
    this.alertEdicaoConta();
  }

  async ngOnInit() {
    await	(await this.fireService.puxarContas()).subscribe((listaRelatorios) => {
      listaRelatorios.forEach((doc: any) => {
        this.listaContas.push(doc.data());
      });
      console.log(this.listaContas);
      
    });
}
}