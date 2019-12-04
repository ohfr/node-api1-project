// implement your API here

const express = require("express");
const db = require("./data/db");

const server = express();

server.use(express.json());

const port = 8080;
const host = "127.0.0.1";

server.listen(port, host, () => {
    console.log(`Server running on port ${port}`)
})

server.get("/api/users", async (req, res) => {
    let users = await db.find();

    if (users) {
        res.json(users)
    } else {
        res.status(500).json({error: "The users information could not be retrieved"})
    }
});

server.get("/api/users/:id", async (req,res) => {
    let user = await db.findById(req.params.id);

    if (user) {
        res.status(200).json(user)
    } else {
        res.status(404).json({error: "The user with the specified ID does not exist"})
    }
})

server.post("/api/users", async (req, res) => {

    if (!req.body.name || !req.body.bio) {
        return res.status(400).json({Error: "Please provide name and bio for the user"})
    }
    let user = {
        name: req.body.name,
        bio: req.body.bio,
        created_at: new Date().toString(),
        updated_at: new Date().toString()
    }
    
    let newUser = await db.insert(user);

    if (newUser) {
        res.status(201).json(newUser)
    } else {
        res.status(500).json({Error: "There was an error while saving the user to the database"})
    }

})

server.delete("/api/users/:id", async (req, res) => {
    let user = await db.findById(req.params.id);

    if (user) {
        let deleted = await db.remove(req.params.id);
        if (deleted) {
            res.status(200).json(deleted)
        } else {
            res.status(500).json({Error: "The user could not be removed"})
        }
    } else {
        res.status(404).json({message: "The user with the specified ID does not exist"})
    }
})

server.put("/api/users/:id", async (req, res) => {
    let user = await db.findById(req.params.id);

    if (!req.body.name || !req.body.bio) {
        return res.status(400).json({error: "Please provide a name and bio for user"})
    } 
    let newUser = {
        name: req.body.name,
        bio: req.body.bio,
        updated_at: new Date().toString()
    }
    
    if (user) {
        let updated = await db.update(req.params.id, newUser);
        if (updated) {
            res.status(200).json(updated)
        } else {
            res.status(500).json({error: "The user information could not be modified"})
        }
    } else {
        res.status(404).json({error: "The user with the specified ID could not be found"})
    }
})