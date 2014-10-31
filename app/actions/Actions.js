var _ = require('lodash-node');
var { Promise } = require('when');
var API = require('./API');

var Actions = module.exports = {
  articles: () => API
    .get('topstories.json')
    .then(
      res => getArticles(res),
      err => err
    ),

  article: params => API
    .get(`item/${params.id}.json`)
    .then(
      res => getAllKids(res),
      err => err
    ),

  user: params => API.get(`user/${params.id}.json`)
};

function getArticles(articles) {
  console.log('get articles');
  return Promise.all(_.map(_.first(articles, 10),
    article => API.get(`item/${article}.json`)
  ));
}

function getAllKids(item) {
  item.closed = false;

  if (!item.kids) {
    return new Promise(res => res(item));
  }
  else {
    return Promise
      .all(item.kids.map(item =>
        API
          .get(`item/${item}.json`)
          .then(res => getAllKids(res)))
      )
      .then(res => {
        item.kids = res;
        return item;
      });
  }
}