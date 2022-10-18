# Styfer Backend

## 1. Collections

### 1.1. Accounts

|       Field       |       Type        |           Desc            |
|-------------------|-------------------|---------------------------|
| _id               | ObjectId          | auto generated            |
| username          | String            |                           |
| email             | String            |                           |
| password_hash     | String            | encrypted password        |

### 1.2. Posts

|       Field       |       Type        |           Desc            |
|-------------------|-------------------|---------------------------|
| _id               | ObjectId          | auto generated            |
| img_src           | String            | url of image              |
| desc              | String            | description of a post     |
| created_at        | Date              | date post created         |
| creator           | ObjectId          | ref from Account          |
| likes             | Number            | number of likes           |
| liked_by          | ObjectId[]        | ref from Account          |

### 1.3. Users

|       Field       |       Type        |       Desc        |
|-------------------|-------------------|-------------------|
| _id               | ObjectId          | auto generated    |
| user              | ObjectId          | ref from Account  |
| posts             | ObjectId[]        | ref from Posts    |
| liked_posts       | ObjectId[]        | ref from Posts    |

## 2. Public Queries

### 2.1. Accounts

#### 2.1.1. GET /accounts

> get detailed info of a logged in user

required headers:

    Authorization: "token_from_logged_in_user"

response data:

    {
        "_id": "user_id_from_db",
        "username": "loremipsum",
        "email": "example@email.com"
    }

#### 2.1.2. POST /accounts/login

> authenticate a user

request body:

    {
        "username_or_email": "loremipsum",
        "password": "password"
    }

response data:

    {
        "_id": "user_id_from_db",
        "username": "loremipsum",
        "token": "jsonwebtoken_for_logged_in_user"
    }

#### 2.1.3. POST /accounts/signup

> create an account

request body:

    {
      "username": "loremipsum",
      "email": "example@email.com",
      "password": "password"
    }

response data:

    {
        "_id": "user_id_from_db",
        "username": "loremipsum",
        "token": "jsonwebtoken_for_logged_in_user"
    }

#### 2.1.4. PUT /accounts/change-password

> change account password

required headers:

    Authorization: "token_from_logged_in_user"

request body:

    {
        "old_password": "old_password",
        "new_password": "new_password"
    }

### 2.2. Posts

#### 2.2.1. GET /posts

> get list of all posts

optional query:

    page={positive integer}
    limit={positive integer}

response data:

    {
        "page": 1,
        "data_length": 20,
        "posts": [
            {
                "_id": "post_id_from_db"
                "img_src": "https://url/to/an/image.jpg",
                "desc": "description of the post",
                "created_at": "string_of_date",
                "likes": 12,
                "creator": {                    // undefined if creator doesn't have an account
                    "_id": "user_id_from_db",
                    "username": "loremipsum"
                } || undefined
            },
            ...
        ]
    }

#### 2.2.2. GET /posts/[:post_id]

> get detailed info of a post

response data:

    {
        "_id": "post_id_from_db"
        "img_src": "https://url/to/an/image.jpg",
        "desc": "description of the post",
        "created_at": "string_of_date",
        "likes": 12,
        "creator": {                    // undefined if creator doesn't have an account
            "_id": "user_id_from_db",
            "username": "loremipsum"
        } || undefined
    }

#### 2.2.3. GET /posts/[:post_id]/likes

> get post likes data

optional query:

    page={positive integer}
    limit={positive integer}

response data:

    {
        "_id": "post_id_from_db",
        "page": 1,
        "data_length": 20,
        "likes": 200
        "liked_by": [
            {
                "_id": "user_id_from_db",
                "username": "loremipsum"
            },
            ...
        ]
    }

#### 2.2.4. POST /posts

> create a post

optional headers:

    Authorization: "token_from_logged_in_user"

request body content:

    {
        "img_src": "https://url/to/an/image.jpg",
        "desc": "description of the post",
    }

response body:

    {
        "_id": "post_id_from_db"
        "img_src": "https://url/to/an/image.jpg",
        "desc": "description of the post",
        "likes": 0,
        "creator": {                    // undefined if creator didn't have an account
            "_id": "user_id_from_db",
            "username": "loremipsum"
        } || undefined
    }

#### 2.2.5. PUT /posts/[:post_id]/likes

> like or unlike a post

required headers:

    Authorization: "token_from_logged_in_user"

response data:

    {
        message: "Successfully <like|unlike> <post_id_from_db> post"
    }

#### 2.2.6. DELETE /posts/[:post_id]

> delete a post

required headers:

    Authorization: "token_from_logged_in_user"

response data:

    {
        message: "Successfully delete <post_id_from_db> post"
    }

### 2.3. Users

#### 2.3.1. GET /users/[:user_id]

> get user info with list of posts

optional query:

    page={positive integer}
    limit={positive integer}

response data:

    {
        "user": {
            "_id": "user_id_from_db",
            "username": "loremipsum"
        },
        "page": 1,
        "data_length": 20,
        "posts": [
            {
                "_id": "post_id_from_db"
                "img_src": "https://url/to/an/image.jpg",
                "desc": "desc of the post",
                "created_at": "string_of_date",
                "likes": 12
            },
            ...
        ]
    }

#### 2.3.2. GET /users/[:user_id]/likes

> get user info with list of posts liked

optional query:

    page={positive integer}
    limit={positive integer}

response data:

    {
        "user": {
            "_id": "user_id_from_db",
            "username": "loremipsum"
        },
        "page": 1,
        "data_length": 20,
        "liked_posts": [
            {
                "_id": "post_id_from_db"
                "img_src": "https://url/to/an/image.jpg",
                "desc": "desc of the post",
                "created_at": "string_of_date",
                "likes": 12,
                "creator": {                    // undefined if creator doesn't have an account
                    "_id": "user_id_from_db",
                    "username": "loremipsum"
                } || undefined
            },
            ...
        ]
    }

## 3. Special Access Queries

### 3.1. Users

#### 3.1.1. GET /users

> get list of all users

optional query:

    page={positive integer}
    limit={positive integer}

response data:

    {
        "page": 1,
        "data_length": 20,
        "users": [
            {
                "_id": "user_id_from_db",
                "username": "loremipsum"
            },
            ...
        ]
    }
