## Install and start server:
1. npm install
2. npm run dev

## Get filtered image (local): 
  ```
    curl "http://localhost:8082/filteredimage?image_url=https://upload.wikimedia.org/wikipedia/commons/b/bd/Golden_tabby_and_white_kitten_n01.jpg" --output filtered.jpg
  ```

## Get filtered image (aws): 
  ```
    http://frontend-dev22.us-east-1.elasticbeanstalk.com/filteredimage?image_url=https://upload.wikimedia.org/wikipedia/commons/b/bd/Golden_tabby_and_white_kitten_n01.jpg
  ```