# D2L Brightspace Submit Grades By
Custom widget built using D2L API Calls, local authentication and javascript.  This widget will query a list of courses that the instructor is enrolled in as "Instructor" role.  It will skip any course that has a NULL value for either start date or end data as this will break the code.  I have not been able to figure out why.  It is also filtered by a time period <br><br>
const startDateTime = '2024-05-09T13:15:30.067Z';
const endDateTime = '2024-12-30T13:15:30.067Z'; 
<br><br>
This will need to be adjusted each semester.  I'm working on adjusting the code to grab another API call to render courses based on semester, but haven't been able to make that work.

This is designed to be a self-check off for the instructor.  Set the widget to be visible to Admins and Faculty.

PREREQUISITE: You should have basic knowledge of D2L Brightspace Admin Tools and setting up Manage Extensibility --> OAuth 2.0 and registering an app and setting up scopes.  Refer to the D2L API documentation for more information. [Scopes Tables](https://docs.valence.desire2learn.com/http-scopestable.html)

NOTE: Don't forget to set the permissions for the widget for Admin and Instructor use only.
## HTML version

This version is has everything included, the HTML, css and javascript used to make this work.  Create a new widget in D2L, drop the code and add the widget to the ORG homepage. Make sure your Instructor role has the necessary permissions to create a course and add a user.

## JavaScript Version

Just the code used to make the process work.  

![Create Course](https://github.com/justinbamberg/d2l-brightspace-custom-widgets/blob/main/rsz_submit-grades-by.png)
