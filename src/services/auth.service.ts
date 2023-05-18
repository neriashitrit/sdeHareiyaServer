import bcrypt from 'bcrypt-nodejs';
import crypto from 'crypto';
import generator from 'generate-password';

const encryptionKey = process.env.ENCRYPTION_KEY || '';
const algorithm = 'aes256';

export const hashPassword = (password: string): string =>
	bcrypt.hashSync(password);

export const comparePasswords = (password: string, hash: string): boolean =>
	bcrypt.compareSync(password, hash);

export const encryptPassword = async (Password: string) => {
	if (!Password) {
		return '';
	}
	const IV = crypto.randomBytes(8).toString('hex');
	const cipher = crypto.createCipheriv(algorithm, encryptionKey, IV);
	const encoded = cipher.update(Password, 'utf8', 'hex') + cipher.final('hex');
	return `${IV}:${encoded}`;
};

export const decryptPassword = (Password: string) => {
	if (!Password) {
		return '';
	}
	const textParts = Password.split(':');
	const IV = textParts[0];
	const encryptedText = textParts[1];
	const decipher = crypto.createDecipheriv(algorithm, process.env.ENCRYPTION_KEY!, IV);
	let decrypted = decipher.update(encryptedText, 'hex', 'utf8') + decipher.final('utf8');

	return decrypted.toString();
};

export const generateRandomPassword = (length: number, useNumbers: boolean, useSymbols: boolean, useLower?: boolean, useUpper?: boolean) => {
    return generator.generate({
        length: length,
        numbers: useNumbers,
        symbols: useSymbols,
        lowercase: useLower,
        uppercase: useUpper
    });
}