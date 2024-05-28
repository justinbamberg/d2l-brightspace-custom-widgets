async function BrightspaceFetch(fetchMethod, fetchUrl, fetchData) {
            console.log('BrightspaceFetch');
            const headers = {
                "Content-Type": "application/json",
                "Access-Control-Origin": "*",
                "X-Csrf-Token": localStorage["XSRF.Token"],
            };

            let options = {
                "headers": headers,
                "method": fetchMethod,
                "credentials": "include"
            };

            let strToSend = '';

            if (fetchData !== null) {
                const objToSend = {};
                objToSend.Data = JSON.stringify(fetchData);
                console.log(objToSend.Data);
                strToSend = JSON.stringify(objToSend);
                options = {
                    "headers": headers,
                    "method": fetchMethod,
                    "credentials": "include",
                    "body": (objToSend.Data),
                };
            }

            const res = await fetch(fetchUrl, options);

            const result = {
                "status": res.status,
                "data": {}
            };

            if (res.status === 200) {
                result.data = await res.json();
                return result;
            }

            console.log(res);
            console.log('BrightspaceFetch - After fetch');

            return result; // Return result even if status is not 200
        }

        function updateCourseCode() {
            const courseName = document.getElementById("courseName").value;
            const formattedCourseName = courseName.replace(/ /g, '-'); // Replace spaces with dashes
            document.getElementById("courseCode").value = `Sandbox-${formattedCourseName}`;
        }

        async function createSandboxCourse() {
            const courseName = document.getElementById("courseName").value;
            const formattedCourseName = courseName.replace(/ /g, '-'); // Replace spaces with dashes

            const courseData = {
                "Name": courseName,         // Get the course name from the input field
                "Code": `Sandbox-${formattedCourseName}`,  // Generate the course code
                "Path": "",
                "CourseTemplateId": 6607,  // Assuming this is the correct template ID for your sandbox courses
                "SemesterId": null,
                "StartDate": null,
                "EndDate": null,
                "LocaleId": null,
                "ForceLocale": false,
                "ShowAddressBook": false,
                "Description": {
                    "Content": "",
                    "Type": "Text"
                },
                "CanSelfRegister": false
            };

            const createCourseUrl = "https://" + window.location.hostname + "/d2l/api/lp/1.45/courses/";

            const result = await BrightspaceFetch("POST", createCourseUrl, courseData);

            if (result.status === 200) {
                console.log("Sandbox course created successfully:", result.data);
                const courseId = result.data.Identifier;
                const courseLink = `https://${window.location.hostname}/d2l/home/${courseId}`;
                document.getElementById("successMessage").innerHTML = `<a href="${courseLink}" target="_blank">Course "${courseName}" created successfully. Click here to view</a>`;
                document.getElementById("demo").innerHTML = ""; // Clear demo area

                // Create demo student
                const demoStudentData = {
                    "OrgDefinedId": "",
                    "FirstName": "ZZDemo",
                    "MiddleName": "",
                    "LastName": "ZZStudent",
                    "ExternalEmail": null,
                    "UserName": `ZZDemoStudent-${courseId}`,
                    "RoleId": 112, // Assuming this is the role ID for student
                    "IsActive": true,
                    "SendCreationEmail": false,
                    "Pronouns": ""
                };

                const createUserUrl = "https://" + window.location.hostname + "/d2l/api/lp/1.45/users/";
                const createUserResult = await BrightspaceFetch("POST", createUserUrl, demoStudentData);

                if (createUserResult.status === 200) {
                    console.log("Demo student created successfully:", createUserResult.data);

// Enroll demo student into the course
const enrollStudentUrl = `https://${window.location.hostname}/d2l/api/lp/1.45/enrollments/`;
const enrollStudentData = {
    "OrgUnitId": courseId, // This should be the course identifier
    "UserId": createUserResult.data.UserId, // User ID of the demo student
    "RoleId": 112, // Assuming this is the role ID for student
    "IsCascading": false
};

const enrollStudentResult = await BrightspaceFetch("POST", enrollStudentUrl, enrollStudentData);

if (enrollStudentResult.status === 200) {
    console.log("Demo student enrolled successfully:", enrollStudentResult.data);
} else {
    console.error("Failed to enroll demo student:", enrollStudentResult);
}



                } else {
                    console.error("Failed to create demo student:", createUserResult);
                }
            } else {
                console.error("Failed to create sandbox course:", result);
                document.getElementById("successMessage").innerHTML = "";
                document.getElementById("demo").innerHTML = `Failed to create course "${courseName}".`;
            }
        }
