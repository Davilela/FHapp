import { User } from 'src/app/interface/user';
import { StorageService } from 'src/app/services/storage.service';
import { NavegacaoService } from './../../services/navegacao.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {
  user = {} as User;
  constructor(
    private nav: NavegacaoService,
    private store: StorageService,
    private route: ActivatedRoute
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

  ngOnInit() {}

  irRezas() {
    this.nav.navegarPara('rezas');
  }

  irPenal() {
    this.nav.navegarPara('penal');
  }

  deslogar() {
    this.nav.navegarPara('login');
    this.store.limparUserStorage({ key: 'user' });
  }

  irSobre() {
    this.nav.navegarPara('sobre');
  }
}
