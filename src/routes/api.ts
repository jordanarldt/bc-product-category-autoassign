import express from "express";
import BigCommerce from "node-bigcommerce";

export const apiRouter = express.Router();

const { ACCESS_TOKEN, CLIENT_ID, STORE_HASH } = process.env;

const bigC = new BigCommerce({
  logLevel: "info",
  accessToken: ACCESS_TOKEN,
  clientId: CLIENT_ID,
  storeHash: STORE_HASH,
  apiVersion: "v3"
});

function meetsCriteria(data: any): boolean {
  return data.custom_fields.findIndex(
    (field: any) => field.name === "MoveToCategory" && field.value === "true"
  ) !== -1;
}

apiRouter.post("/webhooks", async (req, res) => {
  // Send success status to BC immediately
  res.status(200).send("Webhook received");

  console.log("New Product Created");
  console.log(req.body);

  const { data: { id: productId } } = req.body;
  try {
    const targetCategoryId = 113;
    const { data: productData } = await bigC.get(`/catalog/products/${productId}?include=custom_fields`);
    // To keep this example app simple, I'll only check to see if a single custom field exists
    // If the custom field exists, I'll assign it to the "Auto Assign Category" on my store.
    // Change the targetCategoryId accordingly if you're testing this on your own store

    console.log(`Fetched data for product ID ${productId}, checking to see if it matches criteria...`);

    if (meetsCriteria(productData) && !productData.categories.includes(targetCategoryId)) {
      const updateBody = {
        categories: [
          ...productData.categories,
          targetCategoryId
        ]
      };
      
      console.log(`Product ${productId} meets criteria, sending update request`);

      const { data: updateResponse } = await bigC.put(`/catalog/products/${productId}`, updateBody);
      if (updateResponse) {
        console.log(`Product ${productId} successfully assigned to category ID ${targetCategoryId}`);
      }
    } else {
      console.log(`Product ID ${productId} was not updated. Either did not match criteria, or it has already been assigned to the target category`);
    }
  } catch (err) {
    console.log(`Failed to get product data for ${productId}`, err);
  }
});
