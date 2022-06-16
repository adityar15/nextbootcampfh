

export default function handler(req, res)
{
    
    res.status(200).json({loggedIn: req.cookies.uid ? true : false})
}