// import connectDb from "@/middleware/mongoose";
// import Product from "@/public/models/product";



// const handler = async (req, res) => {
    
//         let products = await Product.find();
//         let tshirts = {};
//         for (let item of products) {
//             if (item.title in tshirts) {
//                  if (!tshirts[item.title].color.includes(item.color) && item.availableQty > 0) {
//                     tshirts[item.title].color.push(item.color);
//                 }
//                 if (!tshirts[item.title].size.includes(item.size) && item.availableQty > 0) {
//                     tshirts[item.title].size.push(item.size)
//                 }
//             } else {
//                 tshirts[item.title] = JSON.parse(JSON.stringify(item));
//                 if (item.availableQty > 0) {
//                     tshirts[item.title].color = [item.color];
//                     tshirts[item.title].size = [item.size];
//                 }
//             }
//         }
//         res.status(200).json({ tshirts });
   
// };

// export default connectDb(handler);
import connectDb from "@/middleware/mongoose";
import Product from "@/public/models/product";

const handler = async (req, res) => {
    let products = await Product.find();
    let tshirts = {};

    for (let item of products) {
        if (item.title in tshirts) {
            // Ensure `color` and `size` are arrays before pushing
            if (!Array.isArray(tshirts[item.title].color)) {
                tshirts[item.title].color = [];
            }
            if (!Array.isArray(tshirts[item.title].size)) {
                tshirts[item.title].size = [];
            }
            
            if (!tshirts[item.title].color.includes(item.color) && item.availableQty > 0) {
                tshirts[item.title].color.push(item.color);
            }
            if (!tshirts[item.title].size.includes(item.size) && item.availableQty > 0) {
                tshirts[item.title].size.push(item.size);
            }
        } else {
            // Initialize `color` and `size` as arrays
            tshirts[item.title] = JSON.parse(JSON.stringify(item));
            if (item.availableQty > 0) {
                tshirts[item.title].color = [item.color];
                tshirts[item.title].size = [item.size];
            } else {
                tshirts[item.title].color = [];
                tshirts[item.title].size = [];
            }
        }
    }

    res.status(200).json({ tshirts });
};

export default connectDb(handler);
