import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from "./app.module";

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.use((req, res, next) => {
        console.log(process.env.NODE_ENV);
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', '*');
        res.header('Access-Control-Allow-Headers', '*');
        next();
    });

    app.enableCors({
        allowedHeaders: "*",
        origin: "*"
    });

    app.useGlobalPipes(new ValidationPipe());
    await app.listen('https://school-application2.vercel.app');

    //await app.listen(process.env.PORT);
}
bootstrap();
