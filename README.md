i have assumed that all website links are using https that's why i have used https instead of http and have transformed all given website urls to https://{url}

## How to Run

### Clone repo

https://github.com/codewithfaraz/caremerge-test.git

### install dependencies

npm i

### Run task 1

npm run start:task1

### Run task 2

npm run start:task2

### Run task 3

npm run start:task3

#### test routes you can use

- 127.0.0.1:8000/I/want/title/?address=www.dawn.com/events/&address=farazdev.site
- 127.0.0.1:8000/I/want/title/?address=www.dawn.com/events/&address=google.com
- 127.0.0.1:8000/I/want/title/?address=faraz
- 127.0.0.1:8000/I/want/title/?address=www.google.com
- 127.0.0.1:8000/I/want/title/?address=http://yahoo.com
- 127.0.0.1:8000/I/want/title/?address=www.yahoo.com
- 127.0.0.1:8000/I/want/title/?address=google.com&address=www.dawn.com/
  events/
- 127.0.0.1:8000/I/want/title/?address=www.google.com&address=www.dawn.com/
  events/
