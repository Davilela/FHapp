import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { User } from 'src/app/interface/user';
import { FirebaseService } from 'src/app/services/firebase.service';
import { NavegacaoService } from 'src/app/services/navegacao.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToastServiceService } from 'src/app/services/toast-service.service';

@Component({
  selector: 'app-frases',
  templateUrl: './frases.page.html',
  styleUrls: ['./frases.page.scss'],
})
export class FrasesPage implements OnInit {
  listaFrases = [];
  listaPermanente = [];
  search: string;
  
  user = {} as User;
  constructor(
    private fireService: FirebaseService,
    private route: ActivatedRoute,
    public alertController: AlertController,
    private toast: ToastServiceService,
    private nav: NavegacaoService,
    private store: StorageService
  ) {
    this.route.params.subscribe(() => {
      this.store.getStorage().then((resp) => {
        if (resp == null) {
          this.nav.navegarPara('home');
        }
        let userIntermediario = JSON.parse(resp);
        this.user.nome = userIntermediario.nome;
        this.user.email = userIntermediario.email;
        this.user.adm = userIntermediario.adm;
      });
    });
  }

  async ngOnInit() {
    await this.recebeRelatorios();
    this.listaPermanente = this.listaFrases;
  }

  async filtrar(event) {
    let listaAux = [];
    listaAux = this.listaPermanente;
    this.listaFrases = listaAux;
    let valor = event.target.value;

    if (valor && valor.trim() != '') {
      this.listaFrases = listaAux.filter((item) => {
        return item.autor.toLowerCase()?.indexOf(valor.toLowerCase()) > -1;
      });
    } else {
      this.listaFrases = this.listaPermanente;
    }
  }

  async recebeRelatorios() {
    await (
      await this.fireService.puxarFrases()
    ).subscribe((listaRelatorios) => {
      let listaAx = [];
      listaRelatorios.forEach((doc: any) => {
        listaAx.push(doc.data());
      });      
      listaAx[0]?.frases.forEach((element) => {
        this.listaFrases.push(element);
      });
    });
  }

  async adicionarReza() {
    this.alertCriacao();
  }

  async alertCriacao() {
    const alert = await this.alertController.create({
      header: 'Adicionar uma nova frase',
      inputs: [
        {
          name: 'name1',
          type: 'text',
          placeholder: 'Autor',
        },
        {
          name: 'name2',
          type: 'textarea',
          placeholder: 'Frase',
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
              autor: string;
              frase: string;
            } = {
              autor: '',
              frase: ''
            };
            if (!!bla.name1 && !!bla.name2) {
              
              aux.autor = bla.name1;
              aux.frase = bla.name2;
              let lista = { frases : []};
              this.listaPermanente.push(aux);
              this.listaPermanente.forEach((element)=>{
                lista.frases.push(element);
              });
              console.log(lista);
              
              this.fireService.saveFrases(lista);
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

  async alertEdicao(index) {
    const alert = await this.alertController.create({
      header: 'Editar frase',
      inputs: [
        {
          name: 'name1',
          type: 'text',
          value: this.listaPermanente[index]?.autor,
          placeholder: 'Autor',
        },
        {
          name: 'name2',
          type: 'textarea',
          value: this.listaPermanente[index]?.frase,
          placeholder: 'Frase',
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
            let lista = { frases : []};
            this.listaPermanente.splice(index, 1);
            console.log(this.listaPermanente);
            
            this.listaPermanente.forEach((element)=>{
              lista.frases.push(element);
            });
            this.fireService.saveFrases(lista);
          }
        },
        {
          text: 'Confirmar',
          id: 'confirm-button',
          handler: (bla) => {
            let frase: {
              autor: string;
              frase: string;
            } = {
              autor: '',
              frase: '',
            };
            if (!!bla.name1 && !!bla.name2) {
              frase.frase = bla.name2;
              frase.autor = bla.name1;
              let lista = { frases : []};
              this.listaPermanente[index] = frase;
              this.listaPermanente.forEach((element)=>{
                lista.frases.push(element);
              });
              console.log(lista);
              
              this.fireService.saveFrases(lista);
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

  editarReza(index) {
    console.log(index);
    
    this.alertEdicao(index);
  }
}
