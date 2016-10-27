/* property of James Boyle and David Reichert */

//The "csv" files are actually deliminated by semicolons
//so we have to change what to computer splits by
var scsv = d3.dsv(";", "test/plain");

//this reads the information in
scsv("./student/student-mat.csv", function(data) {
    //functions can be called to visualize data
    printData(data);

    //makes a double axis bar graph with the data
    makeGraph(data);

});

//prints the data from csv file
function printData(mathData) {
    for(var i = 0; i < mathData.length; i++) {
	console.log(mathData[i]);
    }
}

//make the graph
function makeGraph(data) {
    //specs of svg and graph
    var w = 1000;
    var h = 500;

    //size of graph
    var graphTop = 40;
    var graphBottom = 400 + graphTop;
    var graphLeft = 15;
    var graphRight = 400 + graphLeft;

    //makes a graph object
    var graph = {
        width: w,
        height: h,
        svg: d3.select("body").append("svg")
            .attr("width", w)
            .attr("height", h),
        data: data,
        top: graphTop,
        bottom: graphBottom,
        left: graphLeft,
        right: graphRight
    };

    //gets parent togetherness statistics
    var pstat = countParentStatus(data);

    //adds bars to graph
    graph.svg.selectAll("rect")
	.data(pstat)
	.enter()
	.append("rect")
	.attr("y", graph.top)
	.attr("x", function(d, i) {
	    return 100 * (i+1);
	})
	.attr("height", function(d) {
	    return d;
	})
	.attr("width", 20)
	.attr("fill", "red");
	
}

//records number of students with parents who are apart and together
function countParentStatus(data) {
    //storage for numbers. Index 0 is apart, 1 is together
    var p = [0, 0];

    //runs through all students and counts appropriately
    for(var i = 0; i < data.length; i++) {
	if(data[i].Pstatus.localeCompare("A") == 0) {
	    p[0] = p[0] + 1;
	} else {
	    p[1] = p[1] + 1;
	}
    }

    //returns array
    return p;
}
