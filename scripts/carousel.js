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
  const searchTerm='aston+martin';
  const searchUrl=`${apiUrl}?key=${apiKey}&q=${searchTerm}&image_type=photo&page=1&per_page=${max}`;

  const appContainer = document.querySelector('.carousel-container');
  const container = document.querySelector('.carousel-list');
  const errorContainer = document.querySelector('.show-on-error');
  const controlsContainer = document.querySelector('.carousel-controls');
  // these values are set in the CSS.
  const marginWidth = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--imageMargin'),10) * 2;
  const imageWidth = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--imageWidth'),10) + marginWidth;
  
  let images = [];

  function reflow() {
   
    appContainer.style.width='';
    const width=appContainer.getBoundingClientRect().width;
    // how many images are completely visible on the screen? Resize container to fit.
     appContainer.style.width = (Math.floor(width / imageWidth) * imageWidth) + 'px';
  }

  function renderImages() {
    images.map(image => renderImage(image));
  }

  function renderImage({id, small, tags, fullSize}) {
    // while the spec said have a central active image the design contradicts that
    // by giving every image equal prominence.
    // and you can't have a central image if there is an even number visible 
    // Therefore lets make all images active, and link to a bigger version of themselves.
    const img = document.createElement('IMG');
    img.src=small;
    img.alt=`${tags}`;
    img.id=`image-${id}`;

    const title = document.createElement('H2');
    title.innerText = img.alt;

    const a = document.createElement('A');
    a.href=fullSize;
    a.className = 'carousel-image';
    a.appendChild(img);
    a.appendChild(title);

    const li = document.createElement('LI');
    li.appendChild(a);
    container.appendChild(li);
  }

  function navigate(direction) {
    // rather than slide, let's just re-order the array and re-render the lot.
    let toAdd = null;
    switch (direction) {
      case 'prev':
        toAdd = images.pop();
        images.splice(0, 0, toAdd); 
        break;
      case 'next':
      toAdd = images.shift();
      images.push(toAdd);
        break;
    } 
    // remove all the images
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    // and render them again.
    renderImages();
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
              images.push({
                id : hit.id,
                small : hit.webformatURL,
                height : hit.webformatHeight,
                width : hit.webformatWidth,
                fullSize : hit.largeImageURL,
                tags : hit.tags
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

    window.addEventListener('breakpoint', reflow);
    window.onresize = reflow; // ideally this would all be on the breakpoint listener
    reflow();
  }
})()
