const axios = require('axios');

// Registration POST request
axios.post('http://localhost:3308/register', {
  userId: 'exampleUserId',
  email: 'example@example.com',
  password: 'examplePassword'
})
.then(response => {
  console.log(response.data);
})
.catch(error => {
  console.error(error);
});

// Contact form submission POST request
axios.post('http://localhost:3308/contact', {
  name: 'John Doe',
  email: 'john@example.com',
  subject: 'Regarding your course',
  message: 'I have a question about the course content.'
})
.then(response => {
  console.log(response.data);
})
.catch(error => {
  console.error(error);
});
