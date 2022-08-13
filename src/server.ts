import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

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
    async ( req: Request, res: Response ) => {
      // Retreiving query of the request
      let { image_url } = req.query;
      const url : string = image_url;

      // if the url does not exist, we respond by an error
      if ( !url ) {
        return res.status(400)
                  .send(`url is required`);
      }

      //else
      // We filter the requested image
      let filteredimage : string;
      filteredimage = await filterImageFromURL(url);
      // If we have a result
      if(filteredimage){
        return res.sendFile(filteredimage, filteredimage, function (err) {
          console.log('Error : ' + err);
            if (err) {
              return res.status(400)
                .send(`An error has occured while sendig filtered image`);
            } else {
                deleteLocalFiles([filteredimage]);
            }
        });
      }
      else
        // show that there was an error in the filtering
        return res.status(400)
          .send(`An error has occured while processing image`);
  } );
  
  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();