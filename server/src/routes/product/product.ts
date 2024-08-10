import express from 'express';
import {createProduct,addPriceToVariant ,getProducts,updateProduct,getProduct ,addSizeAndKeysToVideo, getProductsByIds} from '../../controller/product/product';
import { isAuthenticatedAdmin, isAuthenticatedCustomer } from '@src/middleware/auth';

const productRouter = express.Router(); 


// Admin 
productRouter.route("/").post(isAuthenticatedAdmin,createProduct).get(isAuthenticatedAdmin,getProducts);
productRouter.route("/video").patch(isAuthenticatedAdmin,addSizeAndKeysToVideo)
productRouter.route("/:id").patch(isAuthenticatedAdmin,updateProduct).get(getProduct);
productRouter.route( "/variant/:id" ).patch( isAuthenticatedAdmin, addPriceToVariant );
productRouter.route("/cart").post(isAuthenticatedCustomer,getProductsByIds);


//Customer

export default productRouter;   
