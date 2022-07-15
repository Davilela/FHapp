import { Component, OnInit } from '@angular/core';
import { NavegacaoService } from 'src/app/services/navegacao.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(
    private nav: NavegacaoService,
  ) { }

  ngOnInit() {
  }

  irParaLogin(){
    this.nav.navegarPara('login')
  }

  irParaCadastro(){
    this.nav.navegarPara('cadastro')
  }

}
