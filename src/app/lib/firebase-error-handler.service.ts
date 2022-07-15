export default function FirebaseErrorHandler(error: any): string {
	const errorString: string = `${error}`;

	if (
		errorString.includes('wrong-password') ||
		errorString.includes('invalid-email')
	)
		return 'Senha ou e-mail incorretos';
	if (errorString.includes('internal-error')) return 'Insira sua senha';
	if (errorString.includes('missing-email')) return 'Insira um e-mail';
	if (errorString.includes('user-not-found')) return 'Usuário não encontrado';
	return 'Erro no login';
}