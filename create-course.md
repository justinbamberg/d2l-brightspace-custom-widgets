# D2L Brightspace Create Course
Custom widget built using D2L API Calls, local authentication and javascript.  This widget goes one step beyond the course create widget that D2L has.  First, the widget creates a new course shell, enrolls the user (Instructor) and then creates a ZZStudent with "Student View" role which allows the instructor to impersonate the user to participate in activities as a full student.  

Don't forget to set the permissions for the widget for Admin and Instructor use only.  

## HTML version

This version is has everything included, the HTML, css and javascript used to make this work.  Create a new widget in D2L, drop the code and add the widget to the ORG homepage. Make sure your Instructor role has the necessary permissions to create a course and add a user.

## JavaScript Version

Just the code used to make the process work.  

![Create Course](https://github.com/justinbamberg/d2l-brightspace-custom-widgets/blob/main/create-course-widget-resized.png)
