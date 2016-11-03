//gives frequencies for GPmother, father, other, / MSmother, father, other//
//this is essentially the dataset. I used these calculations from Excel rather than loading in the entire CSV.
//Was simpler and made more sense.
var frequencyData = [28,245,12,78,6,26];
var n = 3, // number of layers
    m = 2, // number of samples per layer

stack = d3.layout.stack(),
layers = [ [[],[]], [[],[]], [[],[]] ];

initializeValuesForData();

//I left the below as one function / just sitting out in the code because modularizing it seemed like more trouble than it was worth, and not actually that useful.
yGroupMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y; }); }),
yStackMax = 100;

var margin = {top: 40, right: 10, bottom: 60, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .domain(d3.range(m))
    .rangeRoundBands([0, width], .08);

var y = d3.scale.linear()
    .domain([0, yStackMax])  
    .range([height, 0]);

var yAxis = d3.svg.axis().scale(y).orient("left").ticks(5)


var color = d3.scale.linear()
    .domain([0, n - 1])
    .range(["#AED6F1", "#1B4F72"]);

//had to do the tickFormat function d to display text instead of a number for the tick mark. Cool thing!
var xAxis = d3.svg.axis()
    .scale(x)
    .tickSize(0)
    .tickPadding(10)
    .tickFormat(function(d){
      console.log(d);
      if(d == 1){
        return "Gabriel Pereira School (n= 349)";
      }
      else{
        return "Mousino da Silveira School (n=46)";
      }
    })
    .orient("bottom");

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var layer = svg.selectAll(".layer")
    .data(layers)
  .enter().append("g")
    .attr("class", "layer")
    .style("fill", function(d, i) { return color(i); });

var rect = layer.selectAll("rect")
    .data(function(d) { return d; })
  .enter().append("rect")
    .attr("x", function(d) {return x(d.x); })
    .attr("y", height)
    .attr("width", x.rangeBand())
    .attr("height", 0);


//Code for my legend
var colors = ["#1B4F72","#6593B2", "#AED6F1"];
var names = ["Other", "Father", "Mother"];

var legend = d3.select("body").append("svg")
  .attr("width", 300)
  .attr("height", 500)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

legend.selectAll("rect")
    .data(colors).enter()
    .append("rect")
    .attr("x", function (d, i){  100 })
    .attr("y", function(d, i){ return height/3 * i })
    .attr("width", 200)
    .attr("height", height/3)
    .attr("fill", function (d){ return d; });
//end code for my legend

var text = legend.selectAll("text")
                        .data(names)
                        .enter()
                        .append("text");

//Add SVG Text Element Attributes
var textLabels = text
                 .attr("x", function(d) { return 20; })
                 .attr("y", function(d, i) { return 50 + height/3 * i; })
                 .text( function (d) {return d})
                 .attr("font-family", "sans-serif")
                 .attr("font-size", "20px")
                 .attr("fill", "white");

rect.transition()
    .delay(function(d, i) { return i * 10; })
    .attr("y", function(d) { return y(d.dy0 + d.percentOfTotal); })
    .attr("height", function(d) { return y(d.dy0) - y(d.dy0 + d.percentOfTotal); });

svg.append("g")
    .attr("class", "xaxis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

var yAxisLabel = svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("id", "y-axis-label")
    .style("text-anchor", "middle")
    .attr("font-size", "20")
    .text("Percent of Students");

svg.append("text")
        .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom) + ")")
        .style("text-anchor", "middle")
        .attr("font-size", "28")
        .text("School Name");

svg.append("text")
  .attr("transform", "translate(" + (width/2) + " ," + (-15) + ")")
  .style("text-anchor", "middle")
  .attr("font-size", "30")
  .text("Primary caretaker for children at two Portugese secondary schools");


//added y axis
var yAxisOnPage = svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + 25 + ",0)")
    .call(yAxis)

d3.selectAll("input").on("change", change);

function change() {
  if (this.value === "grouped") transitionGrouped();
  else transitionStacked();
}

function transitionGrouped() {
  y.domain([0, yGroupMax]);

  yAxisLabel.text("Number of Students");

  yAxisOnPage.call(yAxis);

  rect.transition()
      .duration(500)
      .delay(function(d, i) { return i * 10; })
      .attr("x", function(d, i, j) { return x(d.x) + x.rangeBand() / n * j; })
      .attr("width", x.rangeBand() / n)
    .transition()
      .attr("y", function(d) { return y(d.y); })
      .attr("height", function(d) { return height - y(d.y); });
}

function transitionStacked() {

  yAxisLabel.text("Percent of Students");

  y.domain([0, yStackMax]);

  yAxisOnPage.call(yAxis);

  rect.transition()
      .duration(500)
      .delay(function(d, i) { return i * 10; })
      .attr("y", function(d) { return y(d.dy0 + d.percentOfTotal); })
      .attr("height", function(d) { return y(d.dy0) - y(d.dy0 + d.percentOfTotal); })
    .transition()
      .attr("x", function(d) { return x(d.x); })
      .attr("width", x.rangeBand());
}


//this sets a value in the data that magically got set in the example I looked at, but did not magically get set when I tried to use it.
function setY0(){
  for(var m = 0; m <3; m++){
    if(m==0){
      layers[m][0].y0 = 0;
      layers[m][0].dy0 = 0;
    }
    else{
      layers[m][0].y0 = layers[m-1][0].y + layers[m-1][0].y0;
      layers[m][0].dy0 = layers[m-1][0].percentOfTotal + layers[m-1][0].dy0;
    }
  }

  for(var m = 0; m <3; m++){
    if(m==0){
      layers[m][1].y0 = 0;
      layers[m][1].dy0 = 0;
    }
    else{
      layers[m][1].y0 = layers[m-1][1].y + layers[m-1][1].y0;
      layers[m][1].dy0 = layers[m-1][1].percentOfTotal + layers[m-1][1].dy0;
    }
  }
}

//gets a percentage for each caretaker type for both schools so they can be displayed on the same scale for the stacked graph.
function setPercentOfTotal(){

  for(var m = 0; m <3; m++){
    layers[m][0].percentOfTotal = Math.round(parseFloat(layers[m][0].y) / (layers[0][0].y + layers[1][0].y + layers[2][0].y) * 349) / 3.49;
    layers[m][1].percentOfTotal = layers[m][1].y / 3.49;
  }

}

function initializeValuesForData(){

//initializes data members in layers
  for(var outer = 0; outer<3; outer++){
    for(var inner = 0; inner < 2; inner++){
      layers[outer][inner] = {x: inner, y: frequencyData[outer *2 + inner], y0: 0, percentOfTotal: 0, dy0: 0};
    }
  }

  //determines the corresponding percentage for different caretakers for the two schools.
  //this is necessary because the schools have different totals (349 vs about 50 students surveyed)
  setPercentOfTotal();

  //Something that was and still is unclear to me from the bl.ocks I followed was where the d0 values were being set for each bar.
  //So it seemed magical in the tutorial / code sample and it seemed the only way I could set these values to be used in the visualization
  //for determining layer sizes was by manually setting them. Hence I did this.
  setY0();

}

//References, sources:
/*

https://bl.ocks.org/mbostock/3943967

//http://www.d3noob.org/2012/12/adding-axis-labels-to-d3js-graph.html

And possibly another one or two that I lost track of along the way. But the two here are the major ones I used.
*/
