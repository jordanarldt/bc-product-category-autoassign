## BigCommerce Automatic Product Category Assignment
This is a basic example of a Node server to handle new product creation and automatically assign them to a category if the product meets certain criteria.

----

#### Setup
1. Rename **.env.template** to **.env** and fill in your BigCommerce API credentials.
2. Create a webhook for the **store/product/created** scope, with the **"destination"** set to your ngrok tunnel's **/api/webhooks** endpoint for this app server
3. In **src/routes/api.ts** set the **targetCategoryId** variable to your category ID that you want to assign products to.
4. Run **npm start** to run the server

**Note:** Before completing step 2, make sure you're running an ngrok tunnel already so that you can use the tunnel URL for the webhook destination.
