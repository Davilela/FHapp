import { ToastServiceService } from 'src/app/services/toast-service.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { NavegacaoService } from 'src/app/services/navegacao.service';
import { StorageService } from 'src/app/services/storage.service';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/interface/user';

@Component({
  selector: 'app-penal',
  templateUrl: './penal.page.html',
  styleUrls: ['./penal.page.scss'],
})
export class PenalPage implements OnInit {
  listaRegras = [];
  bixo: boolean = true;
  listaBixo = [];
  listaGeral = [];
  regra: {
    punicao: string;
    titulo: string;
  } = {
    punicao: '',
    titulo: '',
  };
  user = {} as User;
  constructor(
    private fireService: FirebaseService,
    public alertController: AlertController,
    private toast: ToastServiceService,
    private nav: NavegacaoService,
    private store: StorageService,
    private route: ActivatedRoute,
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

  async ngOnInit() {
    this.recebeRelatorios();
    console.log(this.listaRegras);
    console.log(this.listaBixo);
    this.listaRegras = this.listaGeral;
  }

  async recebeRelatorios() {
    await (
      await this.fireService.puxarRegrasGeral()
    ).subscribe((listaRelatorios) => {
      listaRelatorios.forEach((doc: any) => {
        this.listaGeral.push(doc.data());
      });
    });

    await (
      await this.fireService.puxarRegrasBixos()
    ).subscribe((listaRelatorios) => {
      listaRelatorios.forEach((doc: any) => {
        this.listaBixo.push(doc.data());
      });
    });
  }

  mudarGeral() {
    this.bixo = false;
    this.listaRegras = this.listaBixo;
    console.log(this.listaRegras);
  }
  mudarBixo() {
    this.bixo = true;
    this.listaRegras = this.listaGeral;
  }

  adicionarRegra() {
    this.alertEdicao();
  }

  async alertEdicao() {
    const alert = await this.alertController.create({
      header: 'Adicionar uma nova regra',
      inputs: [
        {
          name: 'name1',
          type: 'text',
          placeholder: 'Nome da regra',
        },
        {
          name: 'name2',
          type: 'text',
          placeholder: 'Valor da punição',
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
            let aux : {
              punicao: string;
              titulo: string;
            } = {
              punicao: '',
              titulo: ''
            };
            if (!!bla.name1 && !!bla.name2) {
              aux.punicao = bla.name2;
              aux.titulo = bla.name1;
              if (this.bixo == false) {
                this.listaBixo[0].regras?.push(aux);
                this.fireService.saveRegraBixo(this.listaBixo[0]);
                console.log("Entrou no bixos");
              }
              else if(this.bixo == true){
                this.listaGeral[0].regras?.push(aux);
                this.fireService.saveRegraGeral(this.listaGeral[0]);
                console.log("Entrou no geral");
              }
            }else{
              this.toast.showToast("Entre com os dados para fazer essas operação!!")
            }
          },
        },
      ],
    });
    await alert.present();
  }
}
