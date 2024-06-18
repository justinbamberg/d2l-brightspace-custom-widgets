<script>
  async function BrightspaceFetch(fetchMethod, fetchUrl, fetchData) {
    console.log('BrightspaceFetch initiated');
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

    if (fetchData !== null) {
      options.body = JSON.stringify(fetchData);
      console.log('Request Body:', options.body);
    }

    try {
      const res = await fetch(fetchUrl, options);
      const result = { "status": res.status, "data": {} };

      if (res.ok) {
        result.data = await res.json();
      } else {
        const errorText = await res.text();
        result.error = errorText;
        console.error('Fetch error:', errorText);
      }

      console.log('BrightspaceFetch completed', result);
      return result;
    } catch (error) {
      console.error('Fetch exception:', error);
      return { "status": 500, "error": error.toString() };
    }
  }

  function updateCourseCode() {
    const courseName = document.getElementById("courseName").value;
    const formattedCourseName = courseName.replace(/ /g, '-'); // Replace spaces with dashes
    document.getElementById("courseCode").value = `Sandbox-${formattedCourseName}`;
  }

  async function createSandboxCourse() {
    console.log('createSandboxCourse initiated');
    const courseName = document.getElementById("courseName").value;
    console.log('Course Name:', courseName);
    const formattedCourseName = courseName.replace(/ /g, '-'); // Replace spaces with dashes
    console.log('Formatted Course Name:', formattedCourseName);

    const courseData = {
      "Name": courseName,
      "Code": `Sandbox-${formattedCourseName}`,
      "Path": "",
      "CourseTemplateId": 6607,
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

    const createCourseUrl = "https://" + window.location.hostname + "/d2l/api/lp/1.47/courses/";
    console.log('createCourseUrl:', createCourseUrl);
    console.log('Course Data:', courseData);

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
        "RoleId": 112,
        "IsActive": true,
        "SendCreationEmail": false,
        "Pronouns": ""
      };

      const createUserUrl = "https://" + window.location.hostname + "/d2l/api/lp/1.47/users/";
      console.log('createUserUrl:', createUserUrl);
      console.log('Demo Student Data:', demoStudentData);

      const createUserResult = await BrightspaceFetch("POST", createUserUrl, demoStudentData);

      if (createUserResult.status === 200) {
        console.log("Demo student created successfully:", createUserResult.data);

        // Enroll demo student into the course
        const enrollStudentUrl = `https://${window.location.hostname}/d2l/api/lp/1.47/enrollments/`;
        const enrollStudentData = {
          "OrgUnitId": courseId,
          "UserId": createUserResult.data.UserId,
          "RoleId": 112,
          "IsCascading": false
        };
        console.log('enrollStudentUrl:', enrollStudentUrl);
        console.log('Enroll Student Data:', enrollStudentData);

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
</script>
