const express = require('express');
const fs = require('fs');


const users = require('./MOCK_DATA.json')

const app = express();
const port = 3000; 

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Routes

// this is a test route
app.get('/', (req, res) => {
  return res.send('Welcome to our API');
});

// this route render the HTML Document
app.get('/users', (req, res) => {
  const html =`
  <ul>
    ${users.map(user => `<li>${user.first_name} ${user.last_name}</li>`).join('')}
  </ul>
  `;

  res.send(html);
})

// this route returns all users With the JSON 
app.get('/api/users', (req, res) => {
   return res.json(users);
});


app
.route("/api/users/:id")
// this route returns a single user by id
.get( (req, res) => {
  const id  = Number(req.params.id); // get the id from the request
  const user = users.find(user => user.id === id); // find the user by id
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  return res.json(user);
})
.app.post("/api/users", (req, res) => {
  const body = req.body;
  users.push({ ...body, id: users.length + 1 });

  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
      return res.json({ status: "success", id: users.length });
  });
})
.patch((req,res)=>{
  // update a user
  // Extracting id and body from the request
  const id = Number(req.params.id);
  const body = req.body;
  // Find the user by id
  const user = users.find(user => user.id === id);
  // If the user is not found, return a 404 error
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  
  }
  // Update the user
  const index = users.indexOf(user);
  users[index] = { ...user, ...body };
  // Write the updated users to the
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    return res.json({ status: "success", id: id });
    });
    
})
.delete((req,res)=>{
  // delete a user
  // Extracting id from the request
  const id = Number(req.params.id);
  // Find the user by id
  const user = users.find(user => user.id === id);
  // If the user is not found, return a 404 error
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  
  }
  // Remove the user from the users array
  const index = users.indexOf(user);
  users.splice(index, 1);
  // Write the updated users to the file
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    return res.json({ status: "success", id: id });
    });
})

// Start the server


app.listen(port,() =>
  console.log(`Server is running on port ${port}`)
);