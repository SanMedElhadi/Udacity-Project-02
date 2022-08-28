import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles, isImage} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  app.get( "/filteredimage/", 
    // Making the call async because of the utilities function used that are async
    async ( req : express.Request, res : express.Response) => {
      // Retreiving query of the request
      //let { image_url } = req.query;
      const url : string = req.query.image_url;

      // if the url does not exist, we respond by an error
      if ( !url ) {
        return res.status(400)
                  .send(`url is required`);
      }
      // if the url is not for image
      if(!isImage(url)){
        return res.status(400)
                  .send('a url of an image is required'); 
      }
      
      // The path to the filtered image
      let filteredimage : string;
      
      // We filter the requested image
      try{
        filteredimage = await filterImageFromURL(url);
        // If we have a result, we return the file
        if(filteredimage){
          return res.status(200).sendFile(filteredimage, function (err) {
              if (err) {
                return res.status(400)
                  .send(`An error has occured while sendig filtered image or the url is not valid`);
              } else {
                  deleteLocalFiles([filteredimage]).catch(Error);
              }
          });
        }
        else
          // show that there was an error in the filtering
          return res.status(422)
            .send(`An error has occured while processing image`);
      }catch(e){
        return res.status(422)
          .send(`An error has occured while processing image`); 
      }
      
  } );

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req : express.Request, res : express.Response ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();