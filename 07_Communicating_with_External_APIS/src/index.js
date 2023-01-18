const resultsDiv = document.querySelector('#results');
document.addEventListener('DOMContentLoaded', () => {
  const apiSearchForm = document.querySelector('#api-Search');
  
  apiSearchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = encodeURI(e.target.search.value);
    console.log(query);
    // fetch(`https://api.tvmaze.com/search/shows?q=${query}`)
    //   .then(response => response.json())
    //   .then(results => {
    //     resultsDiv.innerHTML = "";
    //     const showDiv = document.createElement('div');
        
    //     results.forEach(result => {
    //       const show = result.show;
          
    //       const h1 = document.createElement('h1')
    //       h1.textContent = show.name;
    //       showDiv.appendChild(h1);
          
    //       const img = document.createElement('img');
    //       img.src = show.image.medium;
    //       showDiv.appendChild(img);
          
    //       const description = document.createElement('p');
    //       description.innerHTML = show.summary;
    //       showDiv.appendChild(description);
  
    //       resultsDiv.appendChild(showDiv);
    //     })

    //   });

    fetch(`https://api.tvmaze.com/singlesearch/shows?q=${query}&embed=episodes`)
      .then(response => response.json())
      .then(show => {
        resultsDiv.innerHTML = "";
        const showDiv = document.createElement('div');
        if (!show) {
          resultsDiv.append("No results found");
          return;
        }
        const h1 = document.createElement('h1')
        h1.textContent = show.name;
        showDiv.appendChild(h1);
        
        const img = document.createElement('img');
        img.src = show.image.medium;
        showDiv.appendChild(img);
        
        const description = document.createElement('p');
        description.innerHTML = show.summary;
        showDiv.appendChild(description);
        
        resultsDiv.appendChild(showDiv);
        
        resultsDiv.innerHTML += ('<h2>Episodes</h2>');
        
        show._embedded.episodes.forEach(episode => {
          const h3 = document.createElement('h3');
          h3.textContent = `S${episode.season} E${episode.number} - ${episode.name}`
          resultsDiv.appendChild(h3);
          
          if (episode.image) {
            const episodeImg = document.createElement('img');
            episodeImg.src = episode.image.medium;
            resultsDiv.appendChild(episodeImg);
          } else {
            resultsDiv.innerHTML += '<p>No image availalbe</p>';
          }
  
          const summaryDiv = document.createElement('div');
          summaryDiv.innerHTML = episode.summary;
          resultsDiv.appendChild(summaryDiv);
          
        })

      });
  })
})

