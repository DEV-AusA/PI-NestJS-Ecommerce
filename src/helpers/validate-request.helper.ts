
export const validateRequest = (request: any): boolean => {
    // token recibido en headers/Front
    const tokenHeaders: string = request.headers['token'];

    // logica de desencriptacion de token a futuro

    const tokenDB: string = "token1234";
    // return tru o false al guard
    return tokenHeaders === tokenDB;
}