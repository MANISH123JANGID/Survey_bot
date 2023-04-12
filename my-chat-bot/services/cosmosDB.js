const cosmosClient= require('@azure/cosmos').CosmosClient;
const cosmos= require('../services/envConfig');

class cosmosDatabase{
    static client = null;
    static async Connection(){
        const endpoint =cosmos.endPoint;
        const key= cosmos.key;
        if(!cosmosDatabase.client){
            cosmosDatabase.client= new cosmosClient({endpoint,key});
        }
        return cosmosDatabase.client;
    }

    async upsert(email,conversion){
        try{
            const client = await cosmosDatabase.Connection();
            return await client.database('Survey_bot').container('survey_ref').items.upsert({id: email,conversion:conversion})
        }catch(error){
            console.log(error);
        }
    }

    async Find(email){
       try{
        const client = await cosmosDatabase.Connection();
        const querySpec= {
            query:'SELECT * from c WHERE c.id = @email',
            parameters:[
                {
                    name:'@email',value:email
                },
            ]
        }
        let results = await client.database('Survey_bot').container('survey_ref').items.query(querySpec).fetchAll();
        return results ? results.resources : null;
       }catch(error){
            console.log(error)
       }
    }
}

module.exports.cosmosDatabase= cosmosDatabase;