import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util.js';



  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get( "/", ( req, res ) => {
    res.status(200).send("Welcome to the Cloud!/n");
  } );

  // Displays a simple message to the user
  app.get("/filteredimage", async (req, res) => {
    const { image_url } = req.query;
  
    if (!image_url) {
      return res.status(400).send("image_url is required");
    }
  
    let filteredPath;
  
    try {
      // 1. llamar al helper
      filteredPath = await filterImageFromURL(image_url);
  
      // 2. borrar archivo cuando termine la respuesta
      res.on("finish", () => {
        if (filteredPath) {
          deleteLocalFiles([filteredPath]);
        }
      });
  
      // 3. enviar archivo
      return res.status(200).sendFile(filteredPath);
  
    } catch (error) {
      console.error("Filter error:", error);
      return res.status(422).send("Unable to process image_url");
    }
  });

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
