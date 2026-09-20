import  jwt,{ JwtPayload, SignOptions, VerifyOptions } from 'jsonwebtoken'


export type JwtOptions = {
    algorithm?: "HS256";
    expiresIn?: SignOptions["expiresIn"];
};

export function generateToken(payload:JwtPayload,secret:string,options?:JwtOptions):string{
    const signOptions:SignOptions = {
        algorithm:options?.algorithm ?? "HS256",
    }
    if(options?.expiresIn !== undefined){
        signOptions.expiresIn =options.expiresIn
    }
    const token = jwt.sign(payload,secret,signOptions);
    return token;
}

export function verifyToken(token:string,secret:string,options?:JwtOptions):JwtPayload {

    const verifyOptions:VerifyOptions={
        algorithms:[options?.algorithm??"HS256"],
    }
    
    const res = jwt.verify(token,secret,verifyOptions);
    if(typeof res === "string"){
        throw new Error("Invalid token payload")
    }

    return res
}