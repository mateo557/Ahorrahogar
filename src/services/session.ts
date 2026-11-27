import * as SecureStore from 'expo-secure-store';

// El token se guarda cifrado en el almacén seguro del teléfono (Keychain / Keystore)
const CLAVE_TOKEN = 'auth_token';

export const guardarToken = (token: string) => SecureStore.setItemAsync(CLAVE_TOKEN, token);
export const leerToken = () => SecureStore.getItemAsync(CLAVE_TOKEN);
export const borrarToken = () => SecureStore.deleteItemAsync(CLAVE_TOKEN);
