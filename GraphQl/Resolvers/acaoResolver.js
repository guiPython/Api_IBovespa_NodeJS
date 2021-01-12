const AcaoController = require('../../Controllers/acaoController')
const { GraphQLJSON, GraphQLJSONObject } = require('graphql-type-json');
// TODO sleep nos requests do resolver acoes

const resolvers = {
    Query:{
        acao: async (_, {nome} , { validate } ) => {

            const { keyAlphaVantage } = validate()
            const acao = new AcaoController(nome,keyAlphaVantage) ;
            console.log(await acao.getAcaoByName())
            if ( await acao.getAcaoByName() == null) { await acao.insertAcao()}
            else{ await acao.updateAcao() }
            return await acao.getAcaoByName() 
        },

        acoes: async (_,__,{validate}) => { 
            const { keyAlphaVantage } = validate()
            var acao = new AcaoController( null ,keyAlphaVantage) 

            var info = await acao.getAcoes()
            var nomeAcoes = info.map(i => i.nome)

            async function loop(nomeAcoes) {
                for (let i = 0; i < nomeAcoes.length ; i++) {
                    await new Promise(resolve => setTimeout(resolve, 10000));
                    acao = new AcaoController(nomeAcoes[i],keyAlphaVantage)
                    await acao.updateAcao()
                }
            }

            return await loop(nomeAcoes).then( async () => { return await acao.getAcoes() })

        },

    },
    Mutation:{
        createAcao: async (_ , { nome } ,{validate}) => {
            const { keyAlphaVantage } = validate()
            const query = new AcaoController(nome , keyAlphaVantage)
                if( await query.insertAcao() ) {
                    return await query.getAcaoByName();
            }
        },

        deleteAcao: async (_ , {nome} , {validate} ) => {
            validate()
            const query = new AcaoController(nome)
            await query.deleteAcao()
        }
    },
    JSON:GraphQLJSON,
    JSONObject:GraphQLJSONObject,
}

module.exports = resolvers