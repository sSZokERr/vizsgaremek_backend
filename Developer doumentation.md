Vernissage Backend Documentation

Endpoints:
1. GET

1.1 getAllImages()
This method handles a GET request to the /getImages endpoint. It retrieves all information of the images from the database and returns them as a response.

1.2 getAllFiles()
This method handles a GET request to the /getFiles endpoint. The function first calls bucket.getFiles() to retrieve a list of all files in a Google Cloud Storage bucket. It then uses Promise.all() to process each file asynchronously by mapping over the files array and creating a new array of objects with the userid, url, imageType, and projectId properties.
For each file, it generates a signed URL with file.getSignedUrl() that can be used to read the file's contents. The signed URL is set to expire on March 17, 2024.
Finally, the function returns the array of file objects in JSON format.

1.3 getProjects()
This method handles a GET request to the /getProjects endpoint. It returns every project's data in a JSON array.

1.4 getUsers()
This method handles a GET request to the /users endpoint. It returns every user's public data in a JSON array.


2. POST

2.1 register(registerDto: RegisterDTO, res: Response)
This method handles a POST request to the /register endpoint.
It expects a RegisterDTO object as the request body, which must contain the following user registration information: email, password, firstName, and lastName.
The method validates the input data and saves the new user to the database. It also saves a default profile picture to the database for the new user.

2.2 login(email: string, password: string, response: Response)
This method handles a POST request to the /login endpoint. It expects the user's email and password as the request body. The method retrieves the user from the database using the email and compares the password hash with the hashed password in the database. If the passwords match, a JWT is signed and returned in the response. The JWT is also stored as an HTTP-only cookie in the response.

2.3 uploadFile(file: Express.Multer.File, body: any)
This method handles a POST request to the /upload endpoint. It expects a file to be uploaded in the request body with the key file. The method uploads the file to the Google Cloud Storage bucket and saves its metadata to the database. If the uploaded file is a profile picture, it updates the user's profile picture URL in the database.

2.4 getProfileDetails()
This method handles a POST request to the /getProfileDetails endpoint. It accepts a JSON request body with a "userid" field. It retrieves the profile details of a user with the given "userid" from a database through calls to an "appService" instance. If no user is found with the given ID, a BadRequestException is thrown. Otherwise, the user's profile information is returned as a JSON object that includes the user's email, first name, last name, number of projects, studies, occupation, work experience, about me description, and profile picture URL.

2.5 updateProfileDetails()
This method handles a POST request to the /updateProfileDetails endpoint.
It takes in four parameters through the @Body decorator: userid (number), updateStudies (string), updateOccupation (string), updateWorkExperience (string), and updateAboutMe (string).
The function then calls the updateProfileDetails() method of appService, which updates the user's studies, occupation, work experience, and about me fields in the database.

2.6 searchUsers()
This method handles a POST request to the /searchUsers endpoint.  It takes in the search term as a string parameter in the request body. It then calls the searchUser method of the appService object, passing in the search term as an argument. This method returns a list of users matching the search term. The list of users is returned as the response to the client as a JSON object.

2.7 uploadAndroidFile()
This method handles a POST request to the /uploadAndroid endpoint. This function is identical to the uploadFile(), but it expects the file in a base64 string format.

2.8 uploadAndroidProject()
This method handles a POST request to the /newProjectAndroid endpoint. This function handles the project creation inside the Android app.
The endpoint accepts the following parameters in the request body:
	userid: a number representing the ID of the user who is creating the project.
	projectData: a string containing the JSON data of the titles and descriptions of each image inside the project.
	projectTitle: a string representing the main title of the project.

2.9 uploadProject()
This method handles a POST request to the /newProject endpoint. This function handles the project creation.
The endpoint accepts the following parameters in the request body:
	userid: a number representing the ID of the user who is creating the project.
	projectData: a string containing the JSON data of the titles and descriptions of each image inside the project.
	projectTitle: a string representing the main title of the project.
