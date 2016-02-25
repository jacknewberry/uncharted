/*
  Generate false clinical measurements

  Format:
  data = {
      measurement : [
          {date:_date_, value:_integer_}
      ],
  }
*/

fauxdata = {} // namespace

fauxdata.getSomeData = function(amount, withGaps){
  /*
    Produce some data.

    A random walk is used to generate a 'warning level' from which the measurements are computed. This is so there are nice trends in the data similar to in a real patient.
    The real EWS can then be calculated from the measurements
  */
  out = {BP:[], HR:[]}

  var walk = fc.data.random.walk()
    .period(1)   // Projection period, by default = 1
    .steps(amount)   // Number of steps to take, by default = 20
    .mu(0.5)     // Drift component, by default = 0.1
    .sigma(0.2); // Volatility, by default = 0.1
  var warningLevels = walk(100) // the walk starts from 100

  var time = new Date().getTime() // start at the current datetime as an integer

  for(var wl in warningLevels){
    // Generate a heart rate measurement
    if(Math.random()<0.90){
        newHR = {}
        /*vary time by 20 minutes*/
        newHR.time = new Date(time + Math.random()*20*60*1000);
        newHR.value = Math.floor(warningLevels[wl] - 20 - Math.random()*15)
        out.HR.push(newHR)
    }
    // Generate a BP measurement
    if(Math.random()<0.90){
        newBP = {}
        /*vary time by 20 minutes*/
        newBP.time = new Date(time + Math.random()*20*60*1000);
        newBP.systolic = Math.floor(warningLevels[wl] + 20 + Math.random()*40)
        newBP.diastolic = Math.floor(newBP.systolic - 20 - (newBP.systolic*0.3))
        // Occasionally provide no diastolic measurement
        if(newBP.diastolic > newBP.systolic){newBP.diastolic = undefined;}
        if(Math.random()>0.95){newBP.diastolic = undefined;}
        else {
            if(Math.random()>0.95){newBP.systolic = undefined;}
        }
        out.BP.push(newBP)
    }
    time += 4*60*60*1000 // 4 hour obs
  }

  return out;
}
