(function checkHash () {

  if (window.location.hash) {

    loadPage();
  }
  else {

    
    var getSubredditButton = document.getElementById('getSubredditButton');
      getSubredditButton.addEventListener('click', function () {

        var subredditInput = document.getElementById('subredditInput');
        window.location.hash = subredditInput.value;  

        loadPage(event);
      });
  }
})();

window.onhashchange = function () {

  location.reload();
};

function loadPage (event) {

  if (event !== undefined) {

    event.preventDefault();
  }

  var oReq = new XMLHttpRequest();


  var subreddit = window.location.hash.slice(1);
  oReq.open('GET', 'http://www.reddit.com/r/' + subreddit + '/.json');

  oReq.onreadystatechange = function () {

    if (oReq.readyState > 1 && oReq.status === 200) {

      oReq.addEventListener('load', reqListener);
      return;
    }
    else if (oReq.readyState === 4) {

      history.pushState('', document.title, window.location.pathname);
      location.reload();
    }
  }
    
  oReq.send();
};


function reqListener (event) {

  var subredditData = JSON.parse(this.responseText);
  var addPosts = 0;
  createPageElements(subredditData, addPosts);
  
  window.onscroll = function detectScroll (event) {

    if (Math.floor(window.innerHeight + window.scrollY) >= Math.floor(document.body.offsetHeight-1)) {

      if (subredditData.data.children[addPosts] !== undefined) {

        addPosts += 5;
        console.log('addPosts', addPosts);
        createPageElements(subredditData, addPosts)        
      };
    };
  };   
};

function createPageElements (jsonData, addPosts) {

  var subredditData = jsonData;

  // Styling for feed page
  var inputContainer = document.getElementById('inputContainer');
    inputContainer.style.margin = '0';
    inputContainer.style.marginBottom = '1em';
    inputContainer.style.width = '100%';
    inputContainer.style.height = '10em';
    inputContainer.style.display = 'flex';
    inputContainer.style.borderRadius = '0';
    inputContainer.style.border = '0.1em solid #70718F';

  var currSub = document.createElement('div');
    currSub.id = 'currSub';
    currSub.innerHTML = '/r/' + window.location.hash.slice(1);
    currSub.style.marginLeft = '55%';
    currSub.style.marginTop = '0.3em';
    currSub.style.fontSize = '2em';
    currSub.style.fontFamily = 'Courgette, cursive';
    currSub.style.color = '#FFFFFF';
    inputContainer.appendChild(currSub);

  var snoo = document.getElementById('snoo');
    snoo.style.maxHeight = '8em';
    snoo.style.margin = '0.8em';

  document.getElementById('chooseSub').style.marginTop = '3em';

  var displayContentDiv = document.getElementById('displayContentDiv');
  
  var bodyTag = document.getElementsByTagName('body');
    bodyTag[0].style.backgroundColor = '#EEEDED';

  // End styling

  var posted = 0;
  var postAmt = posted+5;

  if (addPosts > 0) {

    posted = addPosts;
    postAmt += addPosts;
  };

  for (posted; posted < postAmt; posted++) {

    var posts = document.createElement('div');
      posts.id = 'posts';
      displayContentDiv.appendChild(posts);


    var srcLink = document.createElement('a');
      srcLink.id = 'srcLink';
      if (subredditData.data.children[posted].data.preview){

        srcLink.href = subredditData.data.children[posted].data.preview.images[0].source.url;
      };
        srcLink.href = subredditData.data.children[posted].data.url;
      posts.appendChild(srcLink);

    var title = document.createElement('p');
      title.id = 'title';
      if (subredditData.data.children[posted].data.preview) {
        
        title.href = subredditData.data.children[posted].data.preview.images[0].source.url
      };
      title.innerHTML = subredditData.data.children[posted].data.title;
      srcLink.appendChild(title);
    

    // If content has an embedded gif preview
    if (subredditData.data.children[posted].data.media) {

      var tempEmbed = document.createElement('div');
        tempEmbed.innerHTML = subredditData.data.children[posted].data.secure_media_embed.content;

      var gifSrc = tempEmbed.innerHTML.split(' ');
        gifSrc = gifSrc[2].replace('src=\"', '');
        gifSrc = gifSrc.replace(gifSrc[gifSrc.length-1], '');
        var gifSrcUrl = gifSrc.replace(/&amp;/g, '&');

      var gif = document.createElement('iframe');
        gif.src = gifSrcUrl;
        gif.scrolling = 'no';
        posts.appendChild(gif);
    }

    // If content has an image
    else if (subredditData.data.children[posted].data.preview){

      var image = document.createElement('img');
        image.id = 'image';
        image.src = subredditData.data.children[posted].data.preview.images[0].source.url;
        srcLink.appendChild(image);
    }

    // If content is just text
    else {

      posts.style.textAlign = 'left';
      posts.style.borderRadius = '1em';

      var threadInfo = document.createElement('div');
        threadInfo.id = 'threadInfo';
        posts.appendChild(threadInfo);

      var upvoteImg = document.createElement('img');
        upvoteImg.className = 'threadIcons';
        upvoteImg.src = 'http://i.imgur.com/nFn8U6a.png?4';
        upvoteImg.style.maxHeight = '20em';
        threadInfo.appendChild(upvoteImg);

      var upvoteCount = document.createElement('div');
        upvoteCount.className = 'iconDetails';
        upvoteCount.innerHTML = subredditData.data.children[posted].data.ups;
        threadInfo.appendChild(upvoteCount);

      var commentIcon = document.createElement('img');
        commentIcon.className = 'threadIcons';
        commentIcon.src = 'https://cdn0.iconfinder.com/data/icons/simple-darkcon-1/92/chat-128.png';
        threadInfo.appendChild(commentIcon);

      var commentCount = document.createElement('div');
        commentCount.className = 'iconDetails';
        commentCount.innerHTML = subredditData.data.children[posted].data.num_comments;
        threadInfo.appendChild(commentCount);

      var authorIcon = document.createElement('img');
        authorIcon.className = 'threadIcons';
        authorIcon.src = 'https://cdn2.iconfinder.com/data/icons/windows-8-metro-style/64/edit_user.png';
        threadInfo.appendChild(authorIcon);

      var author = document.createElement('a');
        author.id = 'author';
        author.href = 'https://www.reddit.com/user/' + subredditData.data.children[posted].data.author;
        author.innerHTML = subredditData.data.children[posted].data.author;
        threadInfo.appendChild(author);

    };
  };
};

function feedInputClicked () {

  window.location.hash = '';
}