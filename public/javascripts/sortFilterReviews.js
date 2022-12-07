var options = {
    valueNames: ['date', 'useful', 'body']
};

var userList = new List('reviews', options);

userList.sort('useful', { order: 'desc' });