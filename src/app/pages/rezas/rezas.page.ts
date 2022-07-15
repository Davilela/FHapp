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
  search : string;
  reza: {
    autor: string;
    reza: string;
    titulo: string
  } = {
    autor: '',
    reza: '',
    titulo:''
  };
  user = {} as User;
  constructor(
    private fireService: FirebaseService,
    private route: ActivatedRoute,
    public alertController: AlertController,
    private toast: ToastServiceService,
    private nav: NavegacaoService,
    private store: StorageService,
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
    await this.recebeRelatorios();    
  }
  

  async filtrar(event) {
    let listaAux = [];
    listaAux = this.listaPermanente;
    this.listaRezas = listaAux;
    let valor = event.target.value;    
    console.log(listaAux);
    if (valor && valor.trim() != '') {
      this.listaRezas = listaAux[0].rezas.filter((item) => {
        console.log(item.titulo);
        return (
          item.titulo.toLowerCase().indexOf(valor.toLowerCase()) > -1
        );
      });
    }else {
      this.listaRezas = this.listaPermanente;
    }
  }


  async recebeRelatorios() {
    await	(await this.fireService.puxarRezas()).subscribe((listaRelatorios) => {
        listaRelatorios.forEach((doc: any) => {
          this.listaRezas.push(doc.data());
        });
        console.log(this.listaRezas[0].rezas[0]);
        this.listaRezas = this.listaRezas.sort(
          (a: any, b: any) => {
            return a.titulo < b.titulo ? -1 : a.titulo > b.titulo ? 1 : 0;
          }
        );
        this.listaPermanente = this.listaRezas;
      });
    }

    async adicionarReza(){
      this.alertEdicao();
    }


    async alertEdicao() {
      const alert = await this.alertController.create({
        header: 'Adicionar uma nova regra',
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
              if (!!bla.name1 && !!bla.name2 &&bla.name3) {
                this.reza.reza = bla.name2;
                this.reza.autor = bla.name3;
                this.reza.titulo = bla.name1;
                this.listaPermanente[0];
                this.listaPermanente[0].rezas.push(this.reza);
                this.fireService.saveRezas(this.listaPermanente[0]);
                
                // this.listaGeral[0].regras?.push(this.regra);
                // this.fireService.saveRegraGeral(this.listaGeral[0]);
                // console.log("Entrou no geral");
              }else{
                this.toast.showToast("Entre com os dados para fazer essas operação!!")
              }
            },
          },
        ],
      });
      await alert.present();
    }

    editarReza(){
      
    }
}
