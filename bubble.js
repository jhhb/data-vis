
//gives frequencies for GPmother, father, other, / MSmother, father, other//
var frequencyData = [28,245,12,78,6,26];
var counter = -1;
var n = 3, // number of layers
    m = 2, // number of samples per layer
    stack = d3.layout.stack(),
    layers = stack(d3.range(n).map(function() { return bumpLayer(m, .1); }));

    for(var outer = 0; outer<3; outer++){
      for(var inner = 0; inner < 2; inner++){
        layers[outer][inner] = {x: inner, y: frequencyData[outer *2 + inner], y0: 0, percentOfTotal: 0, dy0: 0};
      }
    }

    setPercentOfTotal();

    setY0();



    yGroupMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y; }); }),
    yStackMax = 100;//d3.max(layers, function(layer) { return d3.max(layer, function(d) { console.log(d); return d.y0 + d.y; }); });

   // console.log(yStackMax);

var margin = {top: 40, right: 10, bottom: 20, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .domain(d3.range(m))
    .rangeRoundBands([0, width], .08);

var y = d3.scale.linear()
    .domain([0, yStackMax])  //yStackMa
    .range([height, 0]);

var yAxis = d3.svg.axis().scale(y).orient("left").ticks(5)


var color = d3.scale.linear()
    .domain([0, n - 1])
    .range(["#AED6F1", "#1B4F72"]);

var xAxis = d3.svg.axis()
    .scale(x)
    .tickSize(0)
    .tickPadding(6)
    .tickFormat(function(d){
      console.log(d);
      if(d == 1){
        return "Gabriel Pereira School (n= 349)";
      }
      else{
        return "Mousino da Silveira (n=46)";
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

//problem here

rect.transition()
    .delay(function(d, i) { return i * 10; })
    .attr("y", function(d) { return y(d.dy0 + d.percentOfTotal); })
    .attr("height", function(d) { return y(d.dy0) - y(d.dy0 + d.percentOfTotal); });

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

//http://www.d3noob.org/2012/12/adding-axis-labels-to-d3js-graph.html
svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Percent of Students");


//added y axis
var yAxisOnPage = svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + 25 + ",0)")
    .call(yAxis)

d3.selectAll("input").on("change", change);

//get rid of this timeout to prevent it from auto-switching

function change() {
 // clearTimeout(timeout);
  if (this.value === "grouped") transitionGrouped();
  else transitionStacked();
}

function transitionGrouped() {
  y.domain([0, yGroupMax]);



//console.log(yGroupMax);

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

//console.log("SSS");

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

// Inspired by Lee Byron's test data generator.
function bumpLayer(n, o) {
  counter+=1;
  function bump(a) {
    var x = 1 / (.1 + Math.random()),
        y = 2 * Math.random() - .5,
        z = 10 / (.1 + Math.random());
    for (var i = 0; i < n; i++) {
      var w = (i / n - y) * z;
      a[i] += x * Math.exp(-w * w);
    }
  }

  var a = [], i;
  for (i = 0; i < n; ++i) a[i] = o + o * Math.random();
  for (i = 0; i < 5; ++i) bump(a);
  return a.map(function(d, i) { 
    return {x: i, y: d}});
}

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

function setPercentOfTotal(){
  //console.log(layers[0][0].y);


  for(var m = 0; m <3; m++){
    layers[m][0].percentOfTotal = Math.round(parseFloat(layers[m][0].y) / (layers[0][0].y + layers[1][0].y + layers[2][0].y) * 349) / 3.49;
    layers[m][1].percentOfTotal = layers[m][1].y / 3.49;
  }

  //console.log(layers);
}



