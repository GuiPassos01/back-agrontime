export interface Payload {
    sub: number;
    reset?: boolean,
    iat?: number
    exp?: number;
    id_usuario: number;
    nomeCompleto: string;
    documentoFiscal: string;
    email: string;
    senha: string;
    tipo: string;
    status?: boolean;
    celular: string;
    genero: string;
    dataNascimento: string;
}