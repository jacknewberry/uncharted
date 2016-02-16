# uncharted
Web based graph application


## Purpose
To replace inpatient hospital paper-based charts

Such charts include:
- Vital Signs
- Fluid Balance
 - drain output
 - urine output
 - fluids
- Blood Sugar

Uncharted brings these benefits:
- cleaner graphs which are easier to interpret
- automatic calculations, totals, and early warning scores
- access on any device anywhere



## MVP guidelines:
- login screen
- user patient list:
 * add new patient by NHI
 * remove patient

- patient screen:
 * load patient data
 - patient header bar
  * change to another patient
 - chart list
  * select another chart
  * add a new chart

#### Charts:
- vital signs
 - HR, BP, Temp, O2 sats and delivery, RR

- input and output
 - IV and oral intake, NG feeds
 - urine output
 - drains
  - type and volume of output

- fluid balance
 - totals in and out, and the difference across days
 - weight

- blood sugar
 - fingerprick sugar level
 - insulin type & dose


## Step-by-step plan:

- [x] set up git repository
- [x] write step-by-step plan
- [x] install a bootstrap template page, such as [the 'dashboard' example](http://getbootstrap.com/examples/dashboard/)
- [x] split the page into a headerBar, chartList, and chartArea
- [x] make the chart list and chart Area scroll independently of each other
- [ ] populate the chart list with a few buttons which respond to clicks by changing the chartArea
- [x] put [this example chart](https://d3fc.io/examples/low-barrel/index.html) into one of the chart views
- [ ] it should disappear if another chart is selected, and reload when re-selected.
- [ ] make it scroll and scale appropriately if the page is panned or resized
- [ ] duplicate the example chart

_Chart Stream:_

- [ ] Make one graph of this chart have bars for blood pressure
- [ ] change the other into a line graph for heart rate
- [ ] replace the d3fc example data with some more realistic faux clinical measurements
- [ ] apply a straight horizontal value labels appear just above/below the bars
- [ ] also display the value labels for the maximum, minimum, and most recent data points
- [ ] take the team out for dinner
- [ ] write more step-by-step instructions, the next focus is data entry


- [ ] Enable data entry for vital signs, then send the entries to the server
 * ...
- [ ] Develop a fluid chart with urine output, IV and oral intake etc..
 * ...
- [ ] Display early warning scores (EWS) and calculate them when new measurements are added
- [ ] Add respiratory vitals and temperature
- [ ] Look back through Jack's old paper notes and see if there is anything important missing from the vitals signs chart
- [ ] Finish the vitals signs MVP chart!
- [ ] now make it look pretty, and work on small touch screens


_Client Stream:_
- [ ] install a login page (with trivial authentication)
- [ ] fabricate some example patient demographic data for an example user patient list
- [ ] make a user patient list page, possibly using a suitable bootstrap template
- [ ] clicking on a patient sends you to the chart viewing page (data irrespective of the patient)
- [ ] the selected patient's name, age, sex, and NHI appear in the headerBar
- [ ] provide a way to get back to the patient list
- [ ] in the patient list, implement a way to add patients (if you know their NHI)
- [ ] and remove patients from the list
- [ ] make the list of charts (in patient view) shrink to a single icon column on small screens, possibly like [this bootstrap example](http://getbootstrap.com/examples/offcanvas/#)

_Server Stream:_
- [ ] implement a real login/authentication scheme
- [ ] write an API for user and patient data exchange
- [ ] implement the API on the server and client, sending dummy data
- [ ] implement some kind of database or the like for the data
- [ ] retrieve different data for a couple of example patients and users
- [ ] accept new measurements entered via the client, save to the database
- [ ] push new measurements to other clients viewing that patient

- should you be using Grunt, or CodeKit?
