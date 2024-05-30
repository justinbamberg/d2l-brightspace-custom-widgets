# D2L Add ZZ Student
This custom widget built using D2L API Calls, local authentication and javascript.  This widget allows the instructor to add a ZZ Student or Demo Student to their class for impersonation reasons.  Its the only role "Student View" that the instructor can impersonate.  

The instructor has two buttons, enroll ZZStudent or unenroll ZZStudent. We use ZZStudent as a way for faculty to impersonate and participate in the class like a student to get a full experience.

## Process

The button, depending on which one you click, will run through the process. The Enroll Demo Student button will create a new user and attach the course ID number to the end of the user name. This makes it uniquely set to this course only. But first, the code before creating the user, will check to see if a user is already enrolled with this unique name. If so, it will not proceed. If no user is listed, the code will create the user and enroll that user into the course.

Mainly the opposite action is done with the Unenroll Demo Student. The first action is checking to see if the user exists. Since we are using unique user accounts, it know which student to look for. If the user is found on the classlist, the code will process and remove the student. The user account is not deleted, just removed from the course. This allows the Instructor to add and remove as needed throughout the semester over and over. This way a new user is not created everytime, just once.

The reason for this widget and page is to reduce help desk tickets for our Admins, the Instructor can now do it on their own.

PREREQUISITE: You should have basic knowledge of D2L Brightspace Admin Tools and setting up Manage Extensibility --> OAuth 2.0 and registering an app and setting up scopes.  Refer to the D2L API documentation for more information. [Scopes Tables](https://docs.valence.desire2learn.com/http-scopestable.html).  Make sure the instructor has the right permissions to create a user and enroll that user.  

NOTE: Don't forget to set the permissions for the widget for Admin and Instructor use only.  You will need to update the code to reflect your role for the ZZ Student.  

        const demoStudentData = {
            "OrgDefinedId": "",
            "FirstName": "ZZDemo",
            "MiddleName": "",
            "LastName": "ZZStudent",
            "ExternalEmail": null,
            "UserName": demoStudentUserName,
            "RoleId": 112,
            "IsActive": true,
            "SendCreationEmail": false,
            "Pronouns": ""

the Get Courses function is also set to the course offering type, you may need to adjust this as well.  

## HTML version

This version is has everything included, the HTML, css and javascript used to make this work.  Create a new widget in D2L, drop the code and add the widget to the Course homepage. Make sure your Instructor role has the necessary permissions to create a course and add a user.

## JavaScript Version

Just the code used to make the process work.  


<img width="397" alt="Add ZZ Student" src="https://github.com/justinbamberg/d2l-brightspace-custom-widgets/blob/main/manage-zz-student.png">




