### System Prompt
> You are an expert in web development, javascript and react.
> Always return the complete code. Make sure to return it completely.
> Never assume anything but only do the task you are told to do.

### Task
I want you to create a modern looking web page using react (vite).
The page will be used to enter data and display some results.

The goal is to have a single page application for displaying a movable grid in full screen mode where the user can place points in. The user should be able to move within the grid freely and place points at any place he likes (*ZoomMap*).

You will also have to create some expandable metrics where information is displayed but also inputs can be changed when expanded (*ExpandableMetric*).

Lastly I want to have the option to have an info modal for displaying static infos such as a hyperlink (*InfoModal*).

You must also create an api component for sending *GET* and *POST* request to an API (*api*).

The page must be modern and minimalistic. Use minimal colours and use the **bento framework**. Also use some transparency for the metrics (*ExpandableMetric*) in order to make them less obstructive for the user.

### Components
I need you to create the following components: 'api/api.js', 'main.jsx', 'index.css', 'Webpage/Webpage.jsx', 'Webpage/Webpage.css', 'Components/ZoomMap/ZoomMap.jsx', 'Components/ZoomMap/ZoomMap.css', 'Components/ExpandableMetric/ExpandableMetric.jsx', 'Components/ExpandableMetric/ExpandableMetric.css', 'Components/InfoModal/InfoModal.jsx' and 'Components/InfoModal/InfoModal.css'. 

You will be provided with a definition and description for each of the components. You must stick to the description to generate the components.

#### api.js
This component is simply for sending and receiving requests. I need you to create a simple **GET** and **POST** request function. You have to make the following requests:
-   **GET**: */ping*:
    -   output: "pong"
    -   description: Endpoint to check connection to the FastAPI.
-   **GET**: */versions*:
    -   output: {
            "msg": "/version success.",
            "code": 200,
            "data": {"version": "0.6.9"}
        }
    -   description: dict containing the current app version.
-   **POST**: */ping*:
    -   input:{
            "demand": {"demandID": 2, "location": [3,-4]}, # Newly placed *demand (**cross**) point* by the user. must have a unique ID. location is a tuple.
            "demands": [                                   # List of previously placed *demand (**cross**) points* by the user.
                {"demandID": 0, "location": [0,5]},
                {"demandID": 1, "location": [-7,2]}
            ],
            "facilities": [{"facilityID": 0, "location": [0,5], "connection": [1,2]}],    # List of placed *facility (**circle**) points* placed by the user.
            "parameter": {"probability": 1,"costs": 1}     # optimization parameter selected by the user.
        }
    -   output:{
            "msg": "/online_facility_location successful.",
            "code": 200,
            "data": {
                "demands": [
                {"demandID": 0,"location": [0,5]},
                {"demandID": 1,"location": [-7,2]},
                {"demandID": 2,"location": [3,-4]}
                ],
                "facilities": [
                {"facilityID": 0,"location": [0,5],"connection": [1]},
                {"facilityID": 1,"location": [3,-4],"connection": [2]}
                ],
                "data": {"costs": {"current": 12.0, "previous": 6.4, "delta": 5.6} , "coin": true } # cost data and current coin toss result.
            }
        }
    -   description: Implementation of the Meyerson algorithm for the online facility location problem. The input are the user-defined points and the output is the connections.
-   **POST**: */offline_facility_location*:
    -   input:{
            "demands": [                                   # List of placed *demand (**cross**) points* by the user.
                {"demandID": 0, "location": [0,5]},
                {"demandID": 1, "location": [-7,2]}
            ],
            "facilities": [{"facilityID": 0, "location": [0,5], "connection": []}, {"facilityID": 1, "location": [6,-5], "connection": []}],    # List of placed *facility (**circle**) points* placed by the user.
            "parameter": {"probability": 1,"costs": 1}     # optimization parameter selected by the user.
        }
    -   output:{
            "msg": "/offline_facility_location successful.",
            "code": 200,
            "data": {
                "demands": [
                {"demandID": 0,"location": [0,5]},
                {"demandID": 1,"location": [-7,2]}
                ],
                "facilities": [
                {"facilityID": 0,"location": [0,5],"connection": [1]},
                {"facilityID": 1,"location": [6,-5],"connection": [2]}
                ],
                "data": {"costs": {"current": 12.0}, "coin": true } # cost data and current coin toss result.
            }
        }
    -   description: Implementation of a clustering algorithm for the online facility location problem. The input are the user-defined points and the output is the connections.


#### ZoomMap.js
This is the main content of the page. It is suppose to be a full screen grid space where the user can move within. the user must also be able to place points anywhere in this space. you must be able to select between circles and crosses to place. The points may be connected, so represent the connections as straight lines coming from the circles to the crosses. the circles and the crosses will each have its own set of ids, so keep this in mind.

#### ExpandableMetric.js
This component will be reused at several places. The goal is to have a floating metric card that can be expanded to display further information or inputs. For the default state, please start with a title, underneath the title place the metric, that can either display a number or a string. under the metric value make the option to display changes. leave some space beneath the metric section to place a child component for the default state.

When expanded you must display an input there. It can be a number input or a slider or a dropdown menu.

#### InfoModal.js
This should be sort of a really minimal button on the screen that opens up an info screen for displaying some information and contact info.

#### Webpage.js
This is the **parent component** where all **other components** live in. the main content of this is the **ZoomMap** component. Place three **ExpandableMetric** components in the top right corner of the screen. These should be fixed and not move, even if the user moves around in the **ZoomMap** section.

The first *ExpandableMetric* is for selection the optimization model. It should display the selected model in the *metric* and when expanded, the user should have a modern looking dropdown menu for selecting another model.

The second *ExpandableMetric* is for selection the optimization costs. It should display the current costs in the *metric*. Under the costs, place the previous costs and the change. When expanded, the user should have a modern looking input field for changing the costs.

The third *ExpandableMetric* is for the probability. It should display either 'HEADS' or 'TAILS' in the *metric*. Under the coin flip, place a list of the previous coin tosses. When expanded, the user should have a modern looking slider for setting the probability. Note that the probability must be between 0 and 1.

Place the **InfoModal** somewhere where it is not too obnoxious for the user.

### Directory
Since I want the app to be 'plug-and-play', you must stick to the following directory layout:
```bash
app
├─ public
├─ src
│   ├─ assets
│   ├─ api
│   │   ├─ api.js
│   ├─ main.jsx
│   ├─ index.css
│   ├─ Webpage
│   │   ├─ Webpage.css
│   │   ├─ Webpage.css
│   ├─ Components
│   │   ├─ ZoomMap
│   │   │   ├─ ZoomMap.jsx
│   │   │   ├─ ZoomMap.css
│   │   ├─ ExpandableMetric
│   │   │   ├─ ExpandableMetric.jsx
│   │   │   ├─ ExpandableMetric.css
│   │   ├─ InfoModal
│   │   │   ├─ InfoModal.jsx
│   │   │   ├─ InfoModal.css
```
