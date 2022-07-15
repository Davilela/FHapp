import { Injectable } from '@angular/core';
import { RemoveOptions, Storage } from '@capacitor/storage';
@Injectable({
	providedIn: 'root',
})
export class StorageService {
	public finalizado: boolean = false;
	public status = 'criando';
	constructor(
	) {}

	public async saveStorage(user) {
		let userString = JSON.stringify(user);
		await Storage.set({ key: 'usuario', value: userString });
	}

	public async getStorage(): Promise<string> {
		const { value } = await Storage.get({ key: 'usuario' });
		return new Promise(resolve => {
			resolve(value);
		});
	}

	public async saveRelatorio(relatorio) {
		let relatorioString = JSON.stringify(relatorio);
		await Storage.set({ key: 'relatorio', value: relatorioString });
	}

	public async getRelatorio(): Promise<string> {
		const { value } = await Storage.get({ key: 'relatorio' });
		return new Promise(resolve => {
			resolve(value);	
		});
	}

	public async remove(options: RemoveOptions) : Promise<void> {
		await Storage.remove({ key: 'relatorio' });
	}

    public async limparUserStorage(options: RemoveOptions) : Promise<void> {
		await Storage.remove({ key: 'usuario' });
	}
}