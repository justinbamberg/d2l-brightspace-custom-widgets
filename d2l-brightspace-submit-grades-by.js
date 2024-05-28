async function getCourses() {
            const apiUrl = 'org address/d2l/api/lp/1.42/enrollments/myenrollments/';
            const startDateTime = '2024-05-09T13:15:30.067Z';
            const endDateTime = '2024-12-30T13:15:30.067Z';
            const queryParams = new URLSearchParams({
                startDateTime: startDateTime,
                endDateTime: endDateTime,
                orgUnitTypeId: 3
            });

            const response = await fetch(`${apiUrl}?${queryParams.toString()}`);
            const data = await response.json();

            const codeList = document.querySelector('#codeList');

            data.Items.forEach(item => {
                const code = item.OrgUnit.Code;
                const id = item.OrgUnit.Id;
                const startDate = item.Access.StartDate;
                const endDate = item.Access.EndDate;

                if (!startDate || !endDate) {
                    return; // Skip if either start date or end date is null
                }

                const formattedEndDate = new Date(endDate);
                formattedEndDate.setDate(formattedEndDate.getDate() - 7); // Subtract 7 days from the endDate
                const endDayOfWeek = formattedEndDate.getDay(); // 0 is Sunday, 1 is Monday, and so on
                let daysToAdd = 0;
                switch (endDayOfWeek) {
                    case 2: // Tuesday
                        daysToAdd = 7;
                        break;
                    case 3: // Wednesday
                        daysToAdd = 6;
                        break;
                    case 4: // Thursday
                        daysToAdd = 5;
                        break;
                    case 5: // Friday
                        daysToAdd = 4;
                        break;
                    case 6: // Saturday
                        daysToAdd = 10;
                        break;
                    case 0: // Sunday
                        daysToAdd = 9;
                        break;
                    case 1: // Monday
                        daysToAdd = 8;
                        break;
                }
                formattedEndDate.setDate(formattedEndDate.getDate() + daysToAdd);
                const formattedDate = formattedEndDate.toLocaleDateString();

                // Calculate the remaining days
                const remainingDays = Math.ceil((formattedEndDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24));

                const li = document.createElement('li');
                li.style.marginBottom = '10px';
                const wrapper = document.createElement('div');
                const a = document.createElement('a');
a.textContent = code + " (" + formattedDate + ") - " + remainingDays + " days left";
a.href = 'https://elearning.delta.edu/d2l/home/' + encodeURIComponent(id);
a.target = '_blank'; // Add this line to open the link in a new tab
a.style.fontSize = '12px'; // Add this line to set the font size
wrapper.appendChild(a);


                const button = document.createElement('button');
                button.textContent = "X";
                button.style.backgroundColor = 'green';
                button.style.color = 'white';
                button.style.fontSize = '14px';
                button.style.fontWeight = 'bold';
                button.style.border = 'none';
                button.style.borderRadius = '10px';
                button.style.padding = '5px';
                button.style.marginLeft = '5px';
                button.style.cursor = 'pointer';

                button.addEventListener('click', () => {
                    // Get the wrapper element that contains the list item
                    const wrapper = button.parentElement;
                    // Add the hidden class to the wrapper element
                    wrapper.style.display = 'none';
                    // Save the hidden state in localStorage
                    localStorage.setItem(code, 'hidden');
                });

                wrapper.appendChild(button);
                li.appendChild(wrapper);

                // Check if the item should be hidden based on localStorage
                if (localStorage.getItem(code) === 'hidden') {
                    wrapper.style.display = 'none';
                }

                // Add the list item to the ul element
                codeList.appendChild(li);
            });

            // Show All button functionality
            document.querySelector('#showAllButton').addEventListener('click', () => {
                // Loop through all the list items and remove the .hidden class from their wrapper divs
                const listItems = document.querySelectorAll('#codeList li');
                listItems.forEach(listItem => {
                    const wrapperDiv = listItem.querySelector('div');
                    wrapperDiv.style.display = 'block';
                    localStorage.setItem(listItem.querySelector('a').textContent.split(' ')[0], 'visible');
                });
            });

            // Hide All button functionality
            document.querySelector('#hideAllButton').addEventListener('click', () => {
                // Loop through all the list items and add the .hidden class to their wrapper divs
                const listItems = document.querySelectorAll('#codeList li');
                listItems.forEach(listItem => {
                    const wrapperDiv = listItem.querySelector('div');
                    wrapperDiv.style.display = 'none';
                    localStorage.setItem(listItem.querySelector('a').textContent.split(' ')[0], 'hidden');
                });
            });
        }

        getCourses();
