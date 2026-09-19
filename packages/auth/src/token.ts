import  jwt,{ JwtPayload, SignOptions } from 'jsonwebtoken'



export function generateToken(payload:JwtPayload,secret:string,options?:SignOptions):string{
    const token = jwt.sign(payload,secret,options);
    return token;
}

export function verifyToken(token:string,secret:string):JwtPayload {
    const res = jwt.verify(token,secret);
    if(typeof res === "string"){
        throw new Error("Invalid token payload")
    }

    return res
}