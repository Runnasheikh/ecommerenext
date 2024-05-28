export default function handler(req,res){
    let pincodes = {
        "721302":["kooch bihar","West Bengal"],
        "110003":["kharagpur","up"],
        "560017":["sone","West "],
        "110025":["batlahouseur","new delhi"],
    }
res.status(200).json(pincodes)
}