import swaggerAutogen from 'swagger-autogen';

const outputFile = './swagger_output.json';
const endpointsFiles = ['index.js'];

const swagger = swaggerAutogen({ openapi: '3.0.0' });

swagger(outputFile, endpointsFiles);
