//Contenedor para todos los ambientes
var environments ={};

//Ambiente de pruebas
environments.pruebas ={
    'httpPort' : 3333,
    'envName' : 'pruebas'
};

//Obtiene que ambiente fue pasado como parámetro por línea de comandos
var currentEnvironment = typeof(process.env.NODE_ENV)== 'string'? process.env.NODE_ENV.toLowerCase() : '';

//Se valida si el ambiente enviado, corresponde a uno de los definidos
var environmentToExport = typeof(environments[currentEnvironment])=='object'? environments[currentEnvironment]:environments.pruebas;

//Se realiza la exportación del módulo
module.exports = environmentToExport;