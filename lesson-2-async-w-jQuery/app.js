/* eslint-env jquery */

(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;
        $.ajax({
        	url: `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`,
        	headers: {
        		Authorization: 'Client-ID e12da19f63a3365ba6c55421e5560e2c35a70a4584e2d6f0e17fe057f7a69477'
        	}
        }).done(addImage);
        $.ajax({
        	url: `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=a1cf02d4b2714ec799f8b984984c02e8`
        }).done(addArticle);
    });

    function addImage(images) {
        let htmlContent='';
        const firstImage=images.results[0];
        if(images.results && images.results[0]){
            htmlContent=`<figure>
            <img src="${firstImage.urls.regular}" alt="${searchedForText}">
            <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
            </figure>`;
        }
        else{
            htmlContent=`<div class="error-no-image">No images available</div>`;
        }
        responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
    }

    function addArticle(data){
        let htmlContent='';
        if(data.response && data.response.docs && data.response.docs.length>1){
            htmlContent='<ul>' +data.response.docs.map(article=>`<li class="article">
                <h2><a href="${article.web_url}">${article.headline.main}</a></h2>
                <p>${article.snippet}</p>
                </li>`).join('')+'</ul>';
        }
        else{
            htmlContent=`<div class="error-no-articles">No articles found</div>`;
        }
        responseContainer.insertAdjacentHTML('beforeend', htmlContent);

    }

})();
