export interface Videogame {
    id: number
    nombre: string
    descripcion: string
    plataforma: string
    imagen: Uint8Array
    nuCopias: number
    genero: string
    feReg?: Date
    precio: number
}
