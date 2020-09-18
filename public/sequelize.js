function getUser() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      if(xhr.status === 200) {
        var users = JSON.parse(xhr.responseText);
        console.log(users);
        var tbody = document.querySelector('#user-list tbody');
        tbody.innerHTML = '';
        users.map(function (user) {
          var row = document.createElement('tr');
          var td = document.createElement('td');
          td.textContent = user.id;
          row.appendChild(td);
          td = document.createElement('td');
          td.textContent = user.name;
          row.appendChild(td);
          td = document.createElement('td');
          td.textContent = user.score; 
          row.appendChild(td);
          tbody.appendChild(row);
        });
      } else {
        console.error(xhr.responseText);
      }
    };
    xhr.open('GET', '/users');
    xhr.send();
  }

  document.getElementById('user-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var score=localStorage.getItem("score");
    var name = e.target.name.value;
    var score = e.target.score.value;
    if (!name) {
      return alert ('이름을 입력하세요');
    }
    if(!score) {
      
      return alert('점수를 입력하세요');
    }
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      if(xhr.status === 201) {
        console.log(xhr.responseText);
        getUser();
      } else {
        console.error(xhr.responseText);
      }
    };
    xhr.open('post', 'users');
    xhr.setRequestHeader('content-Type', 'application/json');
    xhr.send(JSON.stringify({name: name, score: score }));
    e.target.name.value = '';
    e.target.score.value = '';
  });

