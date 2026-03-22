import express from 'express';
import path from 'path';
import {ENV} from './lib/env.js';

import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname
(__filename);


const app = express();

app.get('/', (req, res) => {
    res.status(200).json({msg:"Success from API"});
});

// make our app ready for deployment 
if(ENV.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    app.get("{*any}", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend","dist","index.html"));
    });
}
app.listen(ENV.PORT, () => {
    console.log(`Server is running on port ${ENV.PORT}`);
});