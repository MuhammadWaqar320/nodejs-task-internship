export const okHttpResponse=(res,payload)=>
{
    res.status(200).json(payload)
}
export const createdHttpResponse=(res,payload)=>
{
    res.status(201).json(payload);
}
export const unauthorizedHttpResponse=(res,payload)=>
{
    res.status(401).json(payload)
}

export const serverErrorHttpResponse=(res,error)=>
{
    res.status(500).json({message:error.message})
}
export const ErrorMessageHttpResponse=(res,error)=>
{
    res.json({message:error.message})
}