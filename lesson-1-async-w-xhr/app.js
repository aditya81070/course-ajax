(function() {
	const form = document.querySelector('#search-form');
	const searchField = document.querySelector('#search-keyword');
	let searchedForText;
	const responseContainer = document.querySelector('#response-container');
	form.addEventListener('submit', function(e) {
		e.preventDefault();
		responseContainer.innerHTML = '';
		searchedForText = searchField.value;
		const imgRequest = new XMLHttpRequest();
		imgRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
		imgRequest.onload = addImage;
		imgRequest.onerror = function(err) {
			requestError(err,'image');
		};

		imgRequest.setRequestHeader('Authorization', 'Client-ID e12da19f63a3365ba6c55421e5560e2c35a70a4584e2d6f0e17fe057f7a69477');
		imgRequest.send();
        const articleRequest=new XMLHttpRequest();
        articleRequest.open('GET',`http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=a1cf02d4b2714ec799f8b984984c02e8`);
        articleRequest.onload=addArticle;
        articleRequest.onerror=function(err){
            requestArticleError(err,'articles');
        }
        articleRequest.send();
	});
    function requestError(e,type){
        let htmlContent=`<p>${e}</p>`
        if(type==='image'){
            responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
        }
        else{
         responseContainer.insertAdjacentHTML('beforeend', htmlContent);   
        }
        
    }
	function addImage() {
        let htmlContent='';
        const data=JSON.parse(this.responseText);
        const firstImage=data.results[0];
        if(data && data.results && data.results[0]){
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

    function addArticle(){
        let htmlContent='';
        const data=JSON.parse(this.responseText);
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