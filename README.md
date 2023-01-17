# Data Visualization Dashboard with React

## Description
This is the dashboard product to show tasks list and its analytics with visualization.\
The app has two pages - Dashboard and Chart Board.\
The link to the Dashboard page is [/dashboard](http://localhost:3000/dashboard).\
And the link to the Chard Board page is [/dashboard/chart](http://localhost:3000/dashboard/chart).\
Any other links will be redirected to the Dashboard page.\
On Dashboard page, you can see the list of the tasks on the table.\
You can filter by userId and completed status and also can search by title.\
You can manage the data show by using pagination.

Also, you can add new task, update or delete existing task.\
You can go to Chart Board page by clicking `Show on chart` button.

Chart Board page shows analytics of completed tasks for each user using bar chart.\
You can select the userId in the dropdown to select which users to be displayed on the chart.\
You can also click on the color bar with userId on top of the chart. It will toggle the userId analytics visibility on the chart.\
Whether you use dropdown or the color bar with userId, they will be synced automatically.\
By hovering the chart bar, you can see information including userId, number of completed tasks for that user and titles of the completed task.

## Installation
In the project root, run `yarn install` to install necessary modules.\
The project was built under Node v16.16.0 and yarn 1.22.18

## Run the project

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.\
By default, it will be redirected to [http://localhost:3000/dashboard](http://localhost:3000/dashboard) to show the dashboard page.

## Check lint issues

### `yarn run lint`
Check eslint issues

### `yarn run lint:fix`
Check eslint issues and automatically fix those issues

## Prettify Code

### `yarn run format`
Run prettier to beautify the code
