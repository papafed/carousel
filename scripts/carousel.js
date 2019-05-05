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
  const controlsContainer = document.querySelector('.carousel-controls');

  let images = [];

  function renderImages() {
    images.map(image => renderImage(image));
    container.style.width=`${container.getBoundingClientRect().width}px`;
  }

  function renderImage({id, small, tags}) {
    const img = document.createElement('IMG');
    img.src=small;
    img.alt=`${tags}`;
    img.id=`image-${id}`;
    const title = document.createElement('H2');
    title.innerText = img.alt;
    const li = document.createElement('LI');
    li.className = 'carousel-image';
    li.appendChild(img);
    li.appendChild(title);
    container.appendChild(li);
  }

  function removeImage(id){
    const imageToRemove = document.getElementById(`image-${id}`);
    if (imageToRemove) {
      const li = imageToRemove.closest('.carousel-image');
      container.removeChild(li);
    }
  }

  function navigate(direction) {
    console.log('dir', direction);
    // append the first array item to the end, or vice versa
    // render new image
    // remove the original item from the start/end as appropriate.
    // remove old image
  }

  if (container) {
    errorContainer.classList.remove('error');
    images.length = 0;
    fetch(searchUrl)
    .then(
      function(response) {
        if (response.status !== 200) {
          console.log('There was an error fetching images: ', response);
          errorContainer.innerText = response;
          errorContainer.classList.add('error');
          return;
        }
        response.json().then(function(data) {
          if (data.hits) {
            data.hits.map(hit => {
              console.log('hit',hit)
              images.push({
                id : hit.id,
                small : hit.webformatURL,
                height : hit.webformatHeight,
                width : hit.webformatWidth,
                fullSize : hit.largeImageURL,
                fullHeight : hit.imageHeight,
                fullWidth : hit.imageWidth,
                tags : hit.tags,
                user : hit.user,
              });
            });
            renderImages();
          }
        });
      }
    )
    .catch(function(err) {
      console.log('There was an error fetching images: ', err);
      errorContainer.innerText = err;
      errorContainer.classList.add('error');
    });

    if (controlsContainer) {
      controlsContainer.querySelectorAll('button').forEach(button => {
        button.onclick = () => navigate(button.className);
      });
    }
  
  }
})()
