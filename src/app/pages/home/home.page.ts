import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/interface/user';
import { NavegacaoService } from 'src/app/services/navegacao.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  user = {} as User;
  constructor(
    private nav: NavegacaoService,
    private store: StorageService,
    private route: ActivatedRoute,
  ) {
    this.route.params.subscribe(() => {
      this.store.getStorage().then((resp) => {       
        if (resp == null) {
          this.nav.navegarPara('home');
        } else {
          this.nav.navegarPara('principal');
        }
      });
    });
   
    
   }

  ngOnInit() {
  }

  irParaLogin(){
    this.nav.navegarPara('login')
  }

  irParaCadastro(){
    this.nav.navegarPara('cadastro')
  }

}
