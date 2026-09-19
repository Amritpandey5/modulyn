import argon2 from 'argon2'


export async function hashPassword(password:string):Promise<string>{
    const hashedPass = await argon2.hash(password)
    return hashedPass
}

export async function verifyPassword(password:string,hash:string):Promise<boolean>{
    const isValid = await argon2.verify(hash,password);

    return isValid;

}