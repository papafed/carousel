/*


## Pixabay API
API url `https://pixabay.com/api/`
API key: `9656065-a4094594c34f9ac14c7fc4c39`
Documentation: `https://pixabay.com/api/docs/`
Example search: `https://pixabay.com/api/?key=9656065-a4094594c34f9ac14c7fc4c39&q=beautiful+landscape&image_type=photo`
This will return an object with a `hits` property, which will be an array of images. Relevant properties in the request result are:
`hits[0].imageURL` 
`hits[0].user` 
`hits[0].likes`
 
 */

(function(){
  const apiUrl = 'https://pixabay.com/api/';
  const apiKey = '9656065-a4094594c34f9ac14c7fc4c39';
  const max = 6;
  const searchTerm='beautiful+landscape';
  const searchUrl=`${apiUrl}?key=${apiKey}&q=${searchTerm}&image_type=photo&page=1&per_page=${max}`;

  const container = document.querySelector('#carousel .carousel-list');
  const errorContainer = document.querySelector('.show-on-error');

  let images = {};

  function renderImage(url, height, width) {
    const img = document.createElement('IMG');
    //img.height=height;
   // img.width=width;
    img.src=url;
    const li = document.createElement('LI');
    li.className = 'carousel-image';
    li.appendChild(img);
    container.appendChild(li);
  }

  
  if (container) {
    fetch(searchUrl)
    .then(
      function(response) {
        if (response.status !== 200) {
          console.log('There was an error fetching images: ', response);
          return;
        }
        response.json().then(function(data) {
          if (data.hits) {
            data.hits.map(hit => {
              renderImage(hit.largeImageURL, hit.imageHeight, hit.imageWidth, hit.previewURL)
            });
          }
        });
      }
    )
    .catch(function(err) {
      console.log('There was an error fetching images: ', err);
    });
  
  }
})()
