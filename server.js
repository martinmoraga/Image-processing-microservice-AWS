import express from 'express';
import bodyParser from 'body-parser';
import fs from "fs";
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
      filteredPath = await filterImageFromURL(image_url);
  
      res.on("finish", () => {
        try {
          fs.unlinkSync(filteredPath);
        } catch (err) {
          if (err.code !== "ENOENT") {
            console.error("Error deleting file:", err);
          }
        }
      });
  
      res.set("Content-Type", "image/jpeg");
      res.set("Content-Disposition", 'inline; filename="filtered.jpg"');
      return res.status(200).sendFile(filteredPath);
    } catch (error) {
      console.error("Jimp/read error:", error);
    
      return res.status(422).json({
        message: "Unable to process image_url"
      });
    }
  });

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
