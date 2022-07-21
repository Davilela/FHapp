import { ToastServiceService } from 'src/app/services/toast-service.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { NavegacaoService } from 'src/app/services/navegacao.service';
import { StorageService } from 'src/app/services/storage.service';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/interface/user';
import { TouchSequence } from 'selenium-webdriver';

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
    let geralAux = [];
    await (
      await this.fireService.puxarRegrasGeral()
    ).subscribe((listaRelatorios) => {
      listaRelatorios.forEach((doc: any) => {
        geralAux.push(doc.data());
      });
      geralAux[0]?.regras.forEach((element) => {
        this.listaGeral.push(element);
      });
    });


    let bixosAux = [];
    await (
      await this.fireService.puxarRegrasBixos()
    ).subscribe((listaRelatorios) => {
      listaRelatorios.forEach((doc: any) => {
        bixosAux.push(doc.data());
      });
      bixosAux[0]?.regras.forEach((element) => {
        this.listaBixo.push(element);
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
                let lista = { regras : []};
                this.listaBixo.push(aux);
                this.listaBixo.forEach((element)=>{
                lista.regras.push(element);
                });
                this.fireService.saveRegraBixo(lista);
              }
              else if(this.bixo == true){
                let lista = { regras : []};
                this.listaGeral.push(aux);
                this.listaGeral.forEach((element)=>{
                lista.regras.push(element);
                });
                this.fireService.saveRegraGeral(lista);
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

  
  async alertEdicao2(index) {
    const alert = await this.alertController.create({
      header: 'Editar regra',
      inputs: [
        {
          name: 'name1',
          type: 'text',
          value: this.listaRegras[index].titulo,
          placeholder: 'Nome da regra',
        },
        {
          name: 'name2',
          type: 'text',
          value: this.listaRegras[index].punicao,
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
          text: 'Deletar',
          id: 'cancel-button',
          handler: (bla) => {
            if (this.bixo == false) {
              let lista = { regras : []};
              this.listaBixo.splice(index, 1);
              this.listaBixo.forEach((element)=>{
              lista.regras.push(element);
              });
              this.fireService.saveRegraBixo(lista);
            }
            else if (this.bixo == true) {
              let lista = { regras : []};
              this.listaGeral.splice(index, 1);
              this.listaGeral.forEach((element)=>{
              lista.regras.push(element);
              });
              this.fireService.saveRegraGeral(lista);
            }
          }
        },
        {
          text: 'Confirmar',
          id: 'confirm-button',
          handler: (bla) => {
            let regra: {
              punicao: string;
              titulo: string;
            } = {
              punicao: '',
              titulo: '',
            };
            if (!!bla.name1 && !!bla.name2) {
              regra.titulo = bla.name1;
              regra.punicao = bla.name2;
              if (this.bixo == false) {
                let lista = { regras : []};
                this.listaBixo[index] = regra;
                this.listaBixo.forEach((element)=>{
                lista.regras.push(element);
                });
                this.fireService.saveRegraBixo(lista);
              }
              else if (this.bixo == true) {
                let lista = { regras : []};
                this.listaGeral[index] = regra;
                this.listaGeral.forEach((element)=>{
                lista.regras.push(element);
                });
                this.fireService.saveRegraGeral(lista);
              }
            } else {
              this.toast.showToast(
                'Entre com os dados para fazer essas operação!!'
              );
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async editar(index){
    if(this.user.adm == 'adm'){
    this.alertEdicao2(index);
    }
  }
}
