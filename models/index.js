const { dynamodb } = require('../config');
const { v4: uuidv4 } = require('uuid');
const { get } = require('../routes');
const tableName = 'Products';

const ProductModel = {
    create: async data => {
        const id = uuidv4();
        const params = {
            TableName: tableName,
            Item: { id, ...data }
        }
        try {
            await dynamodb.put(params).promise();
            return { id, ...data }
        } catch (error) {
            console.log("ERROR: ", error);
            throw error;
        }
    },

    search: async (keyword) => {
        const params = {
            TableName: tableName
        };

        if (keyword && keyword.trim() !== "") {
            params.FilterExpression = "contains(#name, :keyword)";
            params.ExpressionAttributeNames = {
                "#name": "name"
            };
            params.ExpressionAttributeValues = {
                ":keyword": keyword
            };
        }

        try {
            const res = await dynamodb.scan(params).promise();
            return res.Items;

        } catch (error) {
            console.log("ERROR:", error);
            throw error;
        }
    },

    update: async (id, data) => {

        let updateExpression = "set #name = :name, price = :price, quantity = :quantity";
        let expressionAttributeNames = {
            "#name": "name"
        };
        let expressionAttributeValues = {
            ":name": data.name,
            ":price": data.price,
            ":quantity": data.quantity
        };

        if (data.image) {
            updateExpression += ", image = :image";
            expressionAttributeValues[":image"] = data.image;
        }

        const params = {
            TableName: tableName,
            Key: { id },
            UpdateExpression: updateExpression,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: "ALL_NEW"
        };

        try {
            const res = await dynamodb.update(params).promise();
            return res.Attributes;
        } catch (error) {
            console.log("ERROR: ", error);
            throw error;
        }
    },

    delete: async (id) => {
        const params = {
            TableName: tableName,
            Key: { id }
        };
        try {
            const res = await dynamodb.delete(params).promise();
            return true;
        } catch (error) {
            console.log("ERROR: ", error);
            throw error;
        }
    },
    getById: async (id) => {
        const params = {
            TableName: tableName,
            Key: { id }
        };
        try {
            const res = await dynamodb.get(params).promise();
            return res.Item;
        } catch (error) {
            console.log("ERROR: ", error);
            throw error;
        }
    }
}

module.exports = ProductModel;