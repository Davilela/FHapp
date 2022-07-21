import { AlertController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastServiceService } from 'src/app/services/toast-service.service';
import { NavegacaoService } from 'src/app/services/navegacao.service';
import { StorageService } from 'src/app/services/storage.service';
import { User } from 'src/app/interface/user';

@Component({
  selector: 'app-rezas',
  templateUrl: './rezas.page.html',
  styleUrls: ['./rezas.page.scss'],
})
export class RezasPage implements OnInit {
  listaRezas = [];
  listaPermanente = [];
  search: string;
  reza: {
    autor: string;
    reza: string;
    titulo: string;
  } = {
    autor: '',
    reza: '',
    titulo: '',
  };
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
    this.listaPermanente = this.listaRezas;
  }

  async filtrar(event) {
    let listaAux = [];
    listaAux = this.listaPermanente;
    this.listaRezas = listaAux;
    let valor = event.target.value;

    if (valor && valor.trim() != '') {
      this.listaRezas = listaAux.filter((item) => {
        return item.titulo.toLowerCase()?.indexOf(valor.toLowerCase()) > -1;
      });
    } else {
      this.listaRezas = this.listaPermanente;
    }
  }

  async recebeRelatorios() {
    await (
      await this.fireService.puxarRezas()
    ).subscribe((listaRelatorios) => {
      let listaAx = [];
      listaRelatorios.forEach((doc: any) => {
        listaAx.push(doc.data());
      });      
      listaAx[0]?.rezas.forEach((element) => {
        this.listaRezas.push(element);
      });
    });
  }

  async adicionarReza() {
    this.alertCriacao();
  }

  async alertCriacao() {
    const alert = await this.alertController.create({
      header: 'Adicionar uma nova reza',
      inputs: [
        {
          name: 'name1',
          type: 'text',
          placeholder: 'Titulo da reza',
        },
        {
          name: 'name3',
          type: 'text',
          placeholder: 'Autor',
        },
        {
          name: 'name2',
          type: 'textarea',
          placeholder: 'Reza',
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
            if (!!bla.name1 && !!bla.name2 && bla.name3) {
              this.reza.reza = bla.name2;
              this.reza.autor = bla.name3;
              this.reza.titulo = bla.name1;
              let lista = { rezas : []};
              this.listaPermanente.push(this.reza);
              this.listaPermanente.forEach((element)=>{
                lista.rezas.push(element);
              });
              console.log(lista);
              
              this.fireService.saveRezas(lista);
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
      header: 'Editar reza',
      inputs: [
        {
          name: 'name1',
          type: 'text',
          value: this.listaPermanente[index]?.titulo,
          placeholder: 'Titulo da reza',
        },
        {
          name: 'name3',
          type: 'text',
          value: this.listaPermanente[index]?.autor,
          placeholder: 'Autor',
        },
        {
          name: 'name2',
          type: 'textarea',
          value: this.listaPermanente[index]?.reza,
          placeholder: 'Reza',
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
            let lista = { rezas : []};
            this.listaPermanente.splice(index, 1);
            console.log(this.listaPermanente);
            
            this.listaPermanente.forEach((element)=>{
              lista.rezas.push(element);
            });
            this.fireService.saveRezas(lista);
          }
        },
        {
          text: 'Confirmar',
          id: 'confirm-button',
          handler: (bla) => {
            if (!!bla.name1 && !!bla.name2 && bla.name3) {
              this.reza.reza = bla.name2;
              this.reza.autor = bla.name3;
              this.reza.titulo = bla.name1;
              let lista = { rezas : []};
              this.listaPermanente[index] = this.reza;
              this.listaPermanente.forEach((element)=>{
                lista.rezas.push(element);
              });
              console.log(lista);
              
              this.fireService.saveRezas(lista);
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
    this.alertEdicao(index);
  }
}
