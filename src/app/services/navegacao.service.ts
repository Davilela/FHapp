import { ToastServiceService } from 'src/app/services/toast-service.service';
import { NavController } from '@ionic/angular';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class NavegacaoService {
	constructor(
		private navCtrl: NavController,
		private toast: ToastServiceService
	) {}

	// opções para a variável tipo:
	// Forward: navega para a próxima página
	// Back: navega para a página anterior
	// Root: navega para a página inicial
    
  navegarPara(nomeDaRota: string, tipo: string = 'Forward') {
		try {
			this.navCtrl[`navigate${tipo}`](nomeDaRota);
		} catch (error) {
			this.toast.showToast(
				`Ocorrera um erro de navegação: ${error.message}`,
				3000
			);
		}
	}
}