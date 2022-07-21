import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from '../interface/user';
import FirebaseErrorHandler from '../lib/firebase-error-handler.service';
import { ToastServiceService } from './toast-service.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NavController } from '@ionic/angular';
import { StorageService } from './storage.service';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor(
    private auth: AngularFireAuth,
    private toastService: ToastServiceService,
    private fireStore: AngularFirestore,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private storageService: StorageService
  ) {}

  private userID = '';
  private user = {} as User;

  public async signUp(data, senha): Promise<string> {
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Aguarde...',
    });
    await loading.present();
    console.log(data);
    await this.auth
      .createUserWithEmailAndPassword(data.email, senha)
      .then(async (userCredential) => {
        const user = userCredential.user;
        await this.saveDetails({
          ...data,
          uid: userCredential.user.uid,
        })
          .then(async () => {
            console.log('salvou no banco');
            await loading.dismiss();
          })
          .catch(async (erro) => {
            console.log(erro);
            await loading.dismiss();
          });
        return userCredential.toString();
      })
      .catch((erro) => {
        this.toastService.showToast(FirebaseErrorHandler(erro));
        return null;
      });
    return null;
  }

  public async updateUser(user) {
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Aguarde...',
    });
    await loading.present();
    try {
      await this.fireStore.collection('users').doc(user.uid).update(user);
      await loading.dismiss();
    } catch (erro: any) {
      console.log(erro);
      this.toastService.showToast(FirebaseErrorHandler(erro));
      await loading.dismiss();
    }
  }

  public async loginWithEmail(email: string, senha: string): Promise<any> {
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Aguarde...',
    });
    await loading.present();
    try {
      const userCredential = await this.auth.signInWithEmailAndPassword(
        email,
        senha
      );
      const uid = userCredential.user.uid;
      (await this.getDetails(uid)).subscribe(async (query) => {
        let usuario = query.data();
        this.storageService.saveStorage(usuario);
        this.userID = uid;
        this.navCtrl.navigateForward('principal');
        await loading.dismiss();
      });
    } catch (erro: any) {
      console.log(erro);
      this.toastService.showToast(FirebaseErrorHandler(erro));
      await loading.dismiss();
    }
  }

  // manipulando usuários
  public async getDetails(uid) {
      return this.fireStore.collection('users').doc(uid).get();
  }

  public async saveDetails(data) {
      return this.fireStore.collection('users').doc(data.uid).set(data);
  }

  public async puxarUsuarios() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Aguarde...',
    });
    await loading.present();
    try {
      await loading.dismiss();
      return this.fireStore.collection('users').get();
    } catch (erro: any) {
      console.log(erro);
      this.toastService.showToast(FirebaseErrorHandler(erro));
      await loading.dismiss();
    }
  }

  public async puxarRezas() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Aguarde...',
    });
    await loading.present();
    try {
      await loading.dismiss();
      return this.fireStore.collection('rezas').get();
    } catch (erro: any) {
      console.log(erro);
      this.toastService.showToast(FirebaseErrorHandler(erro));
      await loading.dismiss();
    }
  }

  public async puxarRegrasGeral() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Aguarde...',
    });
    await loading.present();
    try {
      await loading.dismiss();
      return this.fireStore.collection('regras').get();
    } catch (erro: any) {
      console.log(erro);
      this.toastService.showToast(FirebaseErrorHandler(erro));
      await loading.dismiss();
    }
  }

  public async puxarRegrasBixos() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Aguarde...',
    });
    await loading.present();
    try {
      await loading.dismiss();
      return this.fireStore.collection('bixos').get();
    } catch (erro: any) {
      console.log(erro);
      this.toastService.showToast(FirebaseErrorHandler(erro));
      await loading.dismiss();
    }
  }

  public async puxarContas() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Aguarde...',
    });
    await loading.present();
    try {
      await loading.dismiss();
      return this.fireStore.collection('contas').get();
    } catch (erro: any) {
      console.log(erro);
      this.toastService.showToast(FirebaseErrorHandler(erro));
      await loading.dismiss();
    }
  }

  public async saveRegraBixo(data) {
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Aguarde...',
    });
    await loading.present();
    try {
      await loading.dismiss();
      return this.fireStore
        .collection('bixos').doc('getRegras').set({...data});
    } catch (erro: any) {
      console.log(erro);
      this.toastService.showToast(FirebaseErrorHandler(erro));
      await loading.dismiss();
    }
  }
  public async saveRegraGeral(data) {
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Aguarde...',
    });
    await loading.present();
    try {
      await loading.dismiss();
      return this.fireStore
        .collection('regras')
        .doc('getRegras')
        .set({ ...data });
    } catch (erro: any) {
      console.log(erro);
      this.toastService.showToast(FirebaseErrorHandler(erro));
      await loading.dismiss();
    }
  }

  public async saveConta(data) {
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Aguarde...',
    });
    await loading.present();
    try {
      await loading.dismiss();
      return this.fireStore
        .collection('contas')
        .doc('getContas')
        .set({ ...data });
    } catch (erro: any) {
      console.log(erro);
      this.toastService.showToast(FirebaseErrorHandler(erro));
      await loading.dismiss();
    }
  }

 

  public async saveRezas(data) {
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Aguarde...',
    });
    await loading.present();
    try {
      await loading.dismiss();
      return this.fireStore
        .collection('rezas')
        .doc('getRezas')
        .set({ ...data });
    } catch (erro: any) {
      console.log(erro);
      this.toastService.showToast(FirebaseErrorHandler(erro));
      await loading.dismiss();
    }
  }

  public async deletarConta(uid) {
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Aguarde...',
    });
    await loading.present();
    try {
      await loading.dismiss();
      return this.fireStore.collection('contas').doc(uid).delete();
    } catch (erro: any) {
      console.log(erro);
      this.toastService.showToast(FirebaseErrorHandler(erro));
      await loading.dismiss();
    }
  }
  public async deletarRegras(uid) {
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Aguarde...',
    });
    await loading.present();
    try {
      await loading.dismiss();
      return this.fireStore.collection('regras').doc(uid).delete();
    } catch (erro: any) {
      console.log(erro);
      this.toastService.showToast(FirebaseErrorHandler(erro));
      await loading.dismiss();
    }
  }
  public async deletarBixos(uid) {
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Aguarde...',
    });
    await loading.present();
    try {
      await loading.dismiss();
      return this.fireStore.collection('bixos').doc(uid).delete();
    } catch (erro: any) {
      console.log(erro);
      this.toastService.showToast(FirebaseErrorHandler(erro));
      await loading.dismiss();
    }
  }
}