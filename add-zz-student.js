 document.getElementById("enrollButton").addEventListener("click", () => manageZZStudent('enroll'));
    document.getElementById("unenrollButton").addEventListener("click", () => manageZZStudent('unenroll'));

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

    function getCurrentCourseId() {
        try {
            const parentUrl = parent.window.location.pathname;
            const pathParts = parentUrl.split('/');
            const homeIndex = pathParts.indexOf("home");
            if (homeIndex !== -1 && pathParts.length > homeIndex + 1) {
                const courseId = pathParts[homeIndex + 1];
                console.log('Extracted Course ID:', courseId); // Log the extracted course ID
                return courseId;
            } else {
                console.error('Failed to extract course ID from parent URL:', parentUrl);
                return null;
            }
        } catch (error) {
            console.error('Error accessing parent URL:', error);
            return null;
        }
    }

    async function manageZZStudent(action) {
        console.log(`${action}ZZStudent function called`); // Log function call
        const currentCourseId = getCurrentCourseId();
        if (!currentCourseId) {
            console.error('No course ID found. Aborting.');
            document.getElementById("successMessage").innerHTML = `Failed to extract course ID. Please check the URL structure.`;
            return;
        }
        console.log('Current Course ID:', currentCourseId); // Log current course ID

        if (action === 'enroll') {
            await enrollDemoStudent(currentCourseId);
        } else if (action === 'unenroll') {
            await unenrollDemoStudent(currentCourseId);
        }
    }

    async function enrollDemoStudent(courseId) {
        const demoStudentUserName = `ZZDemoStudent-${courseId}`;
        const userCheckUrl = `https://${window.location.hostname}/d2l/api/lp/1.45/users/?userName=${demoStudentUserName}`;
        const checkUserResponse = await BrightspaceFetch("GET", userCheckUrl, null);

        let userId;
        if (checkUserResponse.status === 200 && checkUserResponse.data && checkUserResponse.data.UserId) {
            console.log("User already exists, skipping creation.");
            userId = checkUserResponse.data.UserId;
        } else {
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
            };

            const createUserUrl = `https://${window.location.hostname}/d2l/api/lp/1.45/users/`;
            const createUserResult = await BrightspaceFetch("POST", createUserUrl, demoStudentData);
            if (createUserResult.status === 200) {
                console.log("Demo student created successfully:", createUserResult.data);
                userId = createUserResult.data.UserId;
            } else {
                console.error("Failed to create demo student:", createUserResult);
                document.getElementById("successMessage").innerHTML = `Failed to create demo student.`;
                return; // Exit if user creation failed
            }
        }

        // Proceed to enroll the student
        const enrollStudentUrl = `https://${window.location.hostname}/d2l/api/lp/1.45/enrollments/`;
        const enrollStudentData = {
            "OrgUnitId": courseId,
            "UserId": userId,
            "RoleId": 112,
            "IsCascading": false
        };

        const enrollStudentResult = await BrightspaceFetch("POST", enrollStudentUrl, enrollStudentData);
        if (enrollStudentResult.status === 200) {
            console.log("Demo student enrolled successfully:", enrollStudentResult.data);
            document.getElementById("successMessage").innerHTML = 'Demo student enrolled successfully!';
        } else {
            console.error("Failed to enroll demo student:", enrollStudentResult);
            document.getElementById("successMessage").innerHTML = 'Failed to enroll demo student.';
        }
    }

    async function unenrollDemoStudent(courseId) {
        const demoStudentUserName = `ZZDemoStudent-${courseId}`;
        const userApiUrl = `https://${window.location.hostname}/d2l/api/lp/1.45/users/?userName=${demoStudentUserName}`;
        const userResponse = await BrightspaceFetch("GET", userApiUrl, null);

        console.log("User Response:", userResponse); // Log the entire response object
        console.log("Complete userResponse data:", userResponse.data); // Detailed data log

        // Check if the response is successful and if the UserId is present
        if (userResponse.status === 200 && userResponse.data && userResponse.data.UserId) {
            console.log("Demo student found:", userResponse.data);
            console.log("User exists. Proceeding with unenrollment.");

            // Proceed to unenroll the user
            const unenrollUrl = `https://${window.location.hostname}/d2l/api/lp/1.45/enrollments/orgUnits/${courseId}/users/${userResponse.data.UserId}`;
            const unenrollResponse = await BrightspaceFetch("DELETE", unenrollUrl, null);

            if (unenrollResponse.status === 200) {
                console.log("Demo student unenrolled successfully!");
                document.getElementById("successMessage").innerHTML = 'Demo student unenrolled successfully!';
            } else {
                console.error("Failed to unenroll demo student:", unenrollResponse);
                document.getElementById("successMessage").innerHTML = 'Failed to unenroll demo student.';
            }
        } else {
            console.error("Failed to find demo student with username:", userResponse);
            document.getElementById("successMessage").innerHTML = 'Failed to find demo student.';
        }
    }
