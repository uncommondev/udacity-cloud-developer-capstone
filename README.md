#  Capstone Project - Receipt Organizer

## Inspiration

Part of the Capstone project is to create and deploy a Serverless CRUD application and what better example than a receipt organiser.

The end user can input their receipt details such as the amount, date purchased and whether it can be expensed or not.

They can filter their claims that can be expensed as well as update and edit their receipts if the date or amount was wrong for example.

The user can also upload a copy of their receipt as a photo should their employer need it for their expense claim.

## Backend

First step is to run:

    npm install

The project is using the Serverless Framework to deploy the Lambda functions.

With your AWS Credentials configured and your own Serverless account you can deploy it with the shorthand:

    sls deploy

## Frontend

First step is to run:

    npm install

To run the frontend locally use:

    npm start

You will be able to access it via your browser on:

    http:localhost:3000
