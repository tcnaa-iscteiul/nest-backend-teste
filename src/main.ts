import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from "./app.module";

import express from "express";


async function bootstrap() {

    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    /*
    // No CORS Headder set
    app.get('/', function (request, response) {
        response.sendFile(__dirname + '/message.json');
    });

    // CORS header `Access-Control-Allow-Origin` set to accept all
    app.get('/allow-cors', function (request, response) {
        response.set('Access-Control-Allow-Origin', '*');
        response.sendFile(__dirname + '/message.json');
    });

    // listen for requests :)
    const listener = app.listen(process.env.PORT, function () {
        console.log('Your app is listening on port ' + listener.address().port);
    });
    
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', '*');
        res.header('Access-Control-Allow-Headers', '*');
        next();
    });
   */
    const allowCors = fn => async (req, res) => {
        res.setHeader('Access-Control-Allow-Credentials', true)
        res.setHeader('Access-Control-Allow-Origin', '*')
        // another common pattern
        res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
        res.setHeader(
            'Access-Control-Allow-Headers',
            'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
        )
        if (req.method === 'OPTIONS') {
            res.status(200).end()
            return
        }
        return await fn(req, res)
    }

    const handler = (req, res) => {
        const d = new Date()
        res.end(d.toString())
    }

    module.exports = allowCors(handler);
    
  /*
    app.use(function (req, res, next) {

        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);

        // Pass to next layer of middleware
        next();
    });
    
    app.enableCors({
        allowedHeaders: "*",
        origin: "*"
    });
    
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "https://school-application2.vercel.app/", "https://localhost:3000/"); // update to match the domain you will make the request from
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    */

    
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(process.env.PORT || 3000, function () {
        console.log('CORS-enabled web server listening on port 80')
    });
}
bootstrap();
