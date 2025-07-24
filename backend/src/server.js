
import {app} from './app.js';
import connectDB from './db/index.js';



connectDB()
.then(()=>{
    app.on('error', (error)=>{
        console.log('ERROR OCCURRED:',err);
        throw error
    })

    app.listen(process.env.PORT || 5000, () => {
        console.log(`App is listening on port ${process.env.PORT || 8000}`);
    });
})

.catch((error)=>{
    console.log("ERROR OCCURED:",error)
    throw error
})



