[![Build Status][travis-badge]][travis-url]

<!-- PROJECT LOGO -->
<p align="center">
  <h2 align="center">Paxinfy<h2>
  <h4 align="center" style="color:purple">paxinfy-app-backend<h4>

  <p align="center">
    Paxinfy is an online learning and teaching marketplace 
    <br />
    <a href="https://github.com/paxinfy/paxinfy-app-backend"><strong>Explore the Repo»</strong></a>
    <br />
    <br />
  </p>
</p>


<!-- TABLE OF CONTENTS -->
## Table of Contents

* [Vision](#vision)
  * [Built With](#built-with)
* [API Spec](#api-spec)
  * [Users](#users)
* [API Endpoints](#api-endponts)
  * [Login](#login)
  * [Registration](#registration)
* [License](#license)
* [Authors](#authors)

<!-- ABOUT THE PROJECT -->
## Vision

A community that helps organizations of all kinds to improve lives through learning


### Built With

* [Node](https://nodejs.org)
* [Express](https://reactjs.org)
* [Postgres](https://tailwindcss.com)

<!-- API SPEC -->
## API Spec
The preferred JSON object to be returned by the API should be structured as follows:

### Users (for authentication)

```source-json
{
  "user": {
    "email": "johndoe@example.com",
    "token": "session",
    "username": "jake",
    "bio": "i love my students",
    "image": null
  }
}
```

<!-- API ENDPOINTS -->
## API Endpoints

### Login:

`POST /api/users/login`

Example request body:

```source-json
{
  "user":{
    "email": "johndoe@example.com",
    "password": "johnDoe12@"
  }
}
```

No authentication required, returns a User

Required fields: `email`, `password`

### Registration:

`POST /api/users`

Example request body:

```source-json
{
  "user":{
    "username": "johndoe",
    "email": "johndoe@example.com",
    "password": "johnDoe12@"
  }
}
```

No authentication required, returns a User

Required fields: `email`, `username`, `password`

## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- AUTHORS -->
### Authors

* [Jude chinoso (cvj)](https://github.com/cvjude)
* [Igugu Efe Justin (justinefe)](https://github.com/justinefe)
* [Esegbona Kelvin (kevoese)](https://github.com/kevoese)
* [Amos Oruaroghene (amoskeyz)](https://github.com/amoskeyz) 

<!-- MARKDOWN LINKS & IMAGES -->
<<<<<<< HEAD
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[travis-badge]: https://travis-ci.com/paxinfy/paxinfy-app-backend.svg?token=syHcPiioWVYoe7Tp9xxx&branch=develop)
=======

[travis-badge]: https://travis-ci.com/paxinfy/paxinfy-app-backend.svg?token=syHcPiioWVYoe7Tp9xxx&branch=develop
>>>>>>> develop
[travis-url]: https://travis-ci.com/paxinfy/paxinfy-app-backend
