# Draw-it

## Project URL

https://draw-it.me/

## Project Video URL 

**Task:** Provide the link to your youtube video. Please make sure the link works. 

## Project Description

**Task:** Provide a detailed description of your app

## Development

**Task:** Leaving deployment aside, explain how the app is built. Please describe the overall code design and be specific about the programming languages, framework, libraries and third-party api that you have used. 

**Frontend:**

The Frontend is created using react, for which we used Chakra UI's built in components for most of the UI. We did this in order to save time and use dynamic prebuilt components instead. We are also using Redux to store the global state of the application. Finally, we are using the socket.io client in order to create socket connections between those in a shared room.

All react components are saved within the 'components' folder in the frontend package. Each subfolder represents a specific page with its inner js files being specific components. The index.js file sets up the redux reducers for its children to use. Finally, all communication with the backend is handled using api.js.

**Backend:**

The Backend has been created using Node.js, alongside the the express middleware wrapped around the apollo graphql server. We have also used mongodb alongside mongoose, used to connect mongodb with express using several models. Finally, we have used socket.io in order to create rooms and have synchronous drawing.

Each of the collections in the mongoDB database has a model in the 'models' folder, created by mongoose. All the graphql related files are in the 'schema' folder, in which we have defined our graphql types and resolvers. Finally, all this is combined alongside endpoints to save and retrive drawing images in the 'app' file.

## Deployment

**Task:** Explain how you have deployed your application. 

We deployed the application on digital ocean using a ubuntu droplet. In order to access the server you had to ssh into the server using public/private keys which 
was added to the user authorized_keys file. We used namecheap to register the domain in order to enable https and digital ocean networking to connect them together.
The application itself is running using systemd which we chose over pm2 because of the easier access to debugging logs and restarting services
when we were working on continuous deployment. We used nginx for the reverse proxy and lets encrypt for the automatic certificate authority management. For nginx we had the application
be redirected to the localhost version of the application whenever they access certain urls or endpoints it will redirect them apprioately whether if its frontend or backend. We used
github actions for continuous deployment by providing the server with its very own set of public and private key listed under github secrets for actions and there were other secrets
that was used in order for github actions to ssh in the server and pull the code, download dependancies and start the service via systemd. Since we are using environmental variables
to separate dev and server variables, the .env gets created in every deployment from the secrets as well.

## Maintenance

**Task:** Explain how you monitor your deployed app to make sure that everything is working as expected.

If it is a deployment issue we can monitor the error using github actions by going into the failed pipeline and seeing where the error is. 
This will show if there was a problem when pulling the code from github or installing independancies.

ssh into the server and check server logs using the systemd commands respectively for backend/frontend:
journalctl -u paintme -f -o cat
journalctl -u paintmebackend -f -o cat

if there are any errors you could check the project directory to view whether its an environmental variable problem or coding problem or project version problem

We also use digital ocean droplets monitoring to see if its related to resource bottlenecking or something on digital ocean's side. For example if digital ocean servers are down.


## Challenges

**Task:** What is the top 3 most challenging things that you have learned/developed for you app? Please restrict your answer to only three items. 

1. One of the most challenging parts of our project was learning how to design a functional front end using react. Since most of our team was new
   react, it was hard for us to get used to it. However, in time and with practice, we were able to get the hang of it.
2. The second most challenging part of our project was learning how to design a backend that serves Graphql. Prior the the project, all of our team 
   only had experience using REST. For things such as authentication, learning how to perform these actions using graphql was very dificult, however, with practice.
   we were able to figure it out.
3. Finally, the third most challenging part of the project was deploying our web app and subsequently fixing any bugs found on the deployed webapp. An exmaple of this
   would be when we had to migrate to https and having to fixed out backend code to support this change on the production side.

## Contributions

**Task:** Describe the contribution of each team member to the project. Please provide the full name of each team member (but no student number). 

1. Evan Ng
   Evan was involved with working on both frontend, backend, and debugging the server. For frontend, Evan mainly worked on the drawing related components on
   the front and and created the tools for drawing as well method of which users create and join drawing rooms. In addition, Evan was involved in the both the
   socket implementation for synchronous drawing for both backend and frontend. Finally, Evan was the one who worked on authentication and input sanitization
   for all graphql and rest requests. When bugs occurred on the deployed app, Evan also took time debugging and fixing any bugs that occurred. 

2. Eric Tan:
   Eric worked on everything related to deployment and continuous deployment. Which includes setting up the server with digitalocean, getting domain name from
   namecheap, setting up https and reverse proxy and finally setting up continuous deployment with github actions. He also worked on the socket synchronous drawing
   code and as well as the feature of the image being saved whenever a new person joins the room so they are able to retrieve the latest image. Eric also worked on
   modifying the backend to support https and separating server and development variables in order for the team to develop to deploy early and fast.

3. Parth Solanki:
   Parth was involved with working on both the frontend and backend services. He worked on the majority of the stylistic components of the app, 
   including the landing page, dashboard, and credits page. He also worked on the api.js which acted as the layer communicating with the backend, this, 
   connecting both the frontend and backend. Parth was also involved in authentication for graphql by creating all the resolvers, and also created the api endpoints 
   needed to save and retrieve images from the server. He was also involved in ensuring the app was secure, by using the many security tips learned in lectures. 




# One more thing? 

**Task:** Any additional comment you want to share with the course staff? 
