import { UnauthorizedException } from "@nestjs/common";
import { LoginDataDto } from "src/auth/dto/auth.login.dto";
import { IHeadersData } from "src/auth/interfaces/headers.data.interface";

export const decodeBasicAuth = (headersData: IHeadersData): LoginDataDto =>{

    const authHeader = headersData.authorization;
    
    if (!authHeader) throw new UnauthorizedException('Credenciales no proporcionadas.');
    
    // decoding simple
    const encodedCredentials = authHeader.split(' ')[1];
    const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString('ascii');
    const [email, password] = decodedCredentials.split(':');
    const credentialsDecoded = {email, password};

    if( !email || email === '' || !password || password === '') throw new UnauthorizedException(`Falta algun dato verifica el Email o la contraseña`);
    
    return credentialsDecoded;
}