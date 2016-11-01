/* property of James Boyle and David Reichert */

//defined variables
var UNKSTR = 0;
var UNKNUM = 0;

/* CLASS FUNCTIONS */

//function for making a "student" object with no data
function EmptyStudent() {
    //sets all student variables to unknown.
    this.school = UNKSTR;
    this.sex = UNKSTR;
    this.age = UNKNUM;
    this.address = UNKSTR;
    this.famsize = UNKSTR;
    this.Pstatus = UNKSTR;
    this.Medu = UNKNUM;
    this.Fedu = UNKNUM;
    this.Mjob = UNKSTR;
    this.Fjob = UNKSTR;
    this.reason = UNKSTR;
    this.guardian = UNKSTR;
    this.traveltime = UNKNUM;
    this.studytime = UNKNUM;
    this.failure = UNKNUM;
    this.schoolsup = UNKNUM;
    this.famsup = UNKNUM;
    this.paid = UNKNUM;
    this.activities = UNKNUM;
    this.nursery = UNKNUM;
    this.higher = UNKNUM;
    this.internet = UNKNUM;
    this.romantic = UNKNUM;
    this.famrel = UNKNUM;
    this.freetime = UNKNUM;
    this.goout = UNKNUM;
    this.Dalc = UNKNUM;
    this.Walc = UNKNUM;
    this.health = UNKNUM;
    this.absences = UNKNUM;
    this.G1 = UNKNUM;
    this.G2 = UNKNUM;
    this.G3 = UNKNUM;
}


//function for making a "student" object filled with data
function Student(d) {
    //sets all student variables to unknown.
    this.school = d.school;
    this.sex = d.sex;
    this.age = d.age;
    this.address = d.address;
    this.famsize = d.famsize;
    this.Pstatus = d.Pstatus;
    this.Medu = +d.Medu;
    this.Fedu = +d.Fedu;
    this.Mjob = d.Mjob;
    this.Fjob = d.Fjob;
    this.reason = d.reason;
    this.guardian = d.guardian;
    this.traveltime = +d.traveltime;
    this.studytime = +d.studytime;
    this.failure = +d.failure;
    this.schoolsup = yesNo(d.schoolsup);
    this.famsup = yesNo(d.famsup);
    this.paid = yesNo(d.paid);
    this.activities = yesNo(d.activities);
    this.nursery = yesNo(d.activities);
    this.higher = yesNo(d.higher);
    this.internet = yesNo(d.internet);
    this.romantic = yesNo(d.romantic);
    this.famrel = +d.famrel;
    this.freetime = +d.freetime;
    this.goout = +d.goout;
    this.Dalc = +d.Dalc;
    this.Walc = +d.Walc;
    this.health = +d.health;
    this.absences = +d.absences;
    this.G1 = +d.G1;
    this.G2 = +d.G2;
    this.G3 = +d.G3;
}

//returns 1 if yes, 0 if no
function yesNo(input) {
    //if input is same as "yes", then returns 1
    if(input.localeCompare("yes")){
	return 1;
    } 

    //otherwise returns 0
    else {
	return 0;
    }
}


/* GRAPH MAKING FUNCTIONS */

//make the graph
function makeGraph(data, info) {
    //title of the graph
    var title = "Min. Absences & Min. Final Grade by Age"

    //padding for visual purposes
    var pad = 15;

    //specs of svg and graph
    var w = 800;
    var h = 600;

    //size of graph
    var graphTop = 80;
    var graphBottom = 400 + graphTop;
    var graphLeft = 100;
    var graphRight = 500 + graphLeft;

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

    //makes dual bar graph for the average absences and grades
    avgAbsenceAndGrade(graph,title,pad,info);

    //returns the graph for editting
    return graph;
}

/* LABEL MAKING FUNCTIONS */


//labels the x axis with given label
function labelX(graph, xAxis, label) {
    graph.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + graph.bottom + ")")
        .call(xAxis)
	.append("text")
	.attr("y", 6)
	.attr("dy", "2em")
	.attr("x", (graph.right + graph.left)/2)
	.style("text-anchor", "middle")
	.text(label);
}
    

//labels left Y axis with given label
function labelLeftY(graph, yAxisLeft, label) {
    graph.svg.append("g")
	.attr("class", "y axis axisLeft")
	.attr("transform", "translate(" + graph.left + "," + graph.top + ")")
	.attr("fill", "blue")
	.call(yAxisLeft)
	.append("text")
	.attr("y", 6)
	.attr("dy", "-2em")
	.attr("dx", "2em")
	.style("text-anchor", "end")
	.text(label);
}
 
//labels right Y axis with given label
function labelRightY(graph, yAxisRight, label) {   
    graph.svg.append("g")
	.attr("class", "y axis axisRight")
	.attr("transform", "translate(" + graph.right + "," + graph.top + ")")
	.attr("fill", "red")
	.call(yAxisRight)
	.append("text")
	.attr("y", 6)
	.attr("dy", "-2em")
	.attr("dx", "2em")
	.style("text-anchor", "end")
	.text(label);
}

//adds title to a graph
function addTitle(graph, title) {
    graph.svg.append("g")
	.attr("class", "title")
	.attr("transform", "translate(" + (graph.right + graph.left)/2 + ",0)")
        .append("text")
        .attr("y", 6)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
	.text(title);
}

/* AXIS MAKING FUNCTIONS */


//makes right and left y axes scales
function yAxes(graph, lowBound1, upBound1, lowBound2, upBound2) {

    //makes y scales
    var y0 = d3.scale.linear().domain([lowBound1, upBound1]).range([graph.bottom - graph.top, 0]);
    var y1 = d3.scale.linear().domain([lowBound2, upBound2]).range([graph.bottom - graph.top, 0]);

    //makes object with all the information for y axes and scales
    var yInfo = {
	//records scales for y axes
	leftScale: y0,
	rightScale: y1,

	//makes right and left axes
	left: d3.svg.axis().scale(y0).ticks(5).orient("left"),
	right: d3.svg.axis().scale(y1).ticks(5).orient("right")
    }

    //returns information of y axes
    return yInfo;
}

//makes object with scale and axis for x as age
function xAge(graph, pad) {
    //makes age scale
    var age = d3.scale.ordinal()
        .rangeRoundBands([graph.left + pad, graph.right - pad], 0.1);

    //sorts array of ages to get labels
    age.domain(graph.data.map(function(d) {return d.age;}).sort());

    //makes x axis
    var xAxis = d3.svg.axis()
        .scale(age)
        .orient("bottom");

    //creates object with the information
    var xInfo = {
	scale: age,
	axis: xAxis
    };

    return xInfo;
}

/* GRAPH MAKING FUNCTIONS */

//dual bar graph for average absences and grades
function avgAbsenceAndGrade(graph, title, pad, GAinfo) {
    //adds title to the graph
    addTitle(graph, title);

    //gets x axis information (scale and axis for the bottom
    var xInfo = xAge(graph, pad);

    //gets y axis information (scales and axes for right and left)
    var yInfo = yAxes(graph, 0, 20, 0, 100); 

    //labels the axes
    labelX(graph, xInfo.axis, "Age");
    labelLeftY(graph, yInfo.left, "Final Grade");
    labelRightY(graph, yInfo.right, "Absences");


    bars = graph.svg.selectAll(".bar").data(GAinfo.gradeAbsence).enter();

    //graphs final grade on left, absences on right
    leftG3(graph, xInfo, yInfo, bars);
    //leftAllGrade(graph, xInfo, yInfo, bars);
    rightAbsence(graph, xInfo, yInfo, bars);
}

function maxAbsenceAndGrade(graph, title, pad, GAinfo) {
    //adds title to the graph
    addTitle(graph, title);

    //gets x axis information (scale and axis for the bottom
    var xInfo = xAge(graph, pad);

    //gets y axis information (scales and axes for right and left)
    var yInfo = yAxes(graph, 0, 20, 0, 100);

    //labels the axes
    labelX(graph, xInfo.axis, "Age");
    labelLeftY(graph, yInfo.left, "Final Grade");
    labelRightY(graph, yInfo.right, "Absences");


    bars = graph.svg.selectAll(".bar").data(GAinfo.max).enter();

    //graphs final grade on left, absences on right
    leftG3(graph, xInfo, yInfo, bars);
    //leftAllGrade(graph, xInfo, yInfo, bars);
    rightAbsence(graph, xInfo, yInfo, bars);
}


/* BAR DRAWING FUNCTIONS */
    
function leftAllGrade(graph, xInfo, yInfo, bars) {
    bars.append("rect")
        .attr("class", "bar11")
        .attr("fill", "green")
        .attr("x", function(d) {
            return xInfo.scale(d.age);
        })
        .attr("width", xInfo.scale.rangeBand()/6)
        .attr("y", function(d) {
            return graph.bottom - yInfo.leftScale(d.G1);
        })
        .attr("height", function(d,i,j) {
            return yInfo.leftScale(d.G1);
        });

    bars.append("rect")
        .attr("class", "bar12")
        .attr("fill", "purple")
        .attr("x", function(d) {
            return xInfo.scale(d.age) + xInfo.scale.rangeBand()/6;
        })
        .attr("width", xInfo.scale.rangeBand()/6)
        .attr("y", function(d) {
            return graph.bottom - yInfo.leftScale(d.G2);
        })
        .attr("height", function(d,i,j) {
            return yInfo.leftScale(d.G2);
        });

    bars.append("rect")
        .attr("class", "bar13")
        .attr("fill", "blue")
        .attr("x", function(d) {
            return xInfo.scale(d.age) + xInfo.scale.rangeBand()/3;
        })
        .attr("width", xInfo.scale.rangeBand()/6)
        .attr("y", function(d) {
            return graph.bottom - yInfo.leftScale(d.G3);
        })
        .attr("height", function(d,i,j) {
            return yInfo.leftScale(d.G3);
        });
}

//graphs the final grade on the left axis
function leftG3(graph, xInfo, yInfo, bars) {
    bars.append("rect")
	.attr("class", "bar1")
	.attr("fill", "blue")
	.attr("x", function(d) { 
	    return xInfo.scale(d.age); 
	})
	.attr("width", xInfo.scale.rangeBand()/2)
	.attr("y", function(d) {
	    return yInfo.leftScale(d.G3) + graph.top; 
	})
	.attr("height", function(d,i,j) {
	    return graph.bottom - yInfo.leftScale(d.G3) - graph.top; 
	})
	.on("mouseover", function(d, i) {
	    //get the x and y of the bar
	    var x = parseFloat(d3.select(this).attr("x"));
	    var y = parseFloat(d3.select(this).attr("y"));

            //Create the tooltip label
            graph.svg.append("text")
                .attr("id", "tooltip")
                .attr("x", x + 5)
                .attr("y", y - 5)
                .attr("fill", "black")
                .text(d.G3);

        })
        .on("mouseout", function() {
            d3.select("#tooltip").remove();
        });

}

//graphs average amount of absences on the right axis
function rightAbsence(graph, xInfo, yInfo, bars) {
    bars.append("rect")
	.attr("class", "bar2")
	.attr("fill", "red")
	.attr("x", function(d) { 
	    return xInfo.scale(d.age) + xInfo.scale.rangeBand()/2; 
	})
	.attr("width", xInfo.scale.rangeBand() / 2)
	.attr("y", function(d) {
	    return yInfo.rightScale(d.absences) + graph.top; 
	})
	.attr("height", function(d,i,j) {
	    return graph.bottom - yInfo.rightScale(d.absences) - graph.top; 
	})
	.on("mouseover", function(d, i) {
            //get the x and y of the bar
            var x = parseFloat(d3.select(this).attr("x"));
            var y = parseFloat(d3.select(this).attr("y"));

            //Create the tooltip label
            graph.svg.append("text")
                .attr("id", "tooltip")
                .attr("x", x + 5)
                .attr("y", y - 5)
                .attr("fill", "black")
                .text(d.absences);

        })
        .on("mouseout", function() {
            d3.select("#tooltip").remove();
        });
}

//records number of students with parents who are apart and together
//currently unused
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

/* DATA PARSING FUNCTIONS */


//records final grades and absences for ages 15 through 22, then averages them
function gradesAndAbsences(data) {
    //counts number of students in age group
    var ageGroupSize = [];
    
    //Information for grades and absences
    var GAinfo = {
	//holds average for grades and absences
	gradeAbsence: [],

	//holds min and max for grades and absences
	min: [], 
	max: [],

	//counts students above avg in each category
	aboveGAvgStu: [],
	belowGAvgStu: [],
	aboveAAvgStu: [],
	belowAAvgStu: [],

	//counts total students
	totalStu: 0
    }
	

    //initializes data
    var ageGroups = 22 - 15; //number of age groups
    for(var i = 0; i <= ageGroups; i++) {
	ageGroupSize[i] = 0;
	GAinfo.gradeAbsence[i] = new EmptyStudent();
	GAinfo.min[i] = new EmptyStudent();
	GAinfo.max[i] = new EmptyStudent();
	GAinfo.aboveGAvgStu[i] = {age: 0, number: 0};
	GAinfo.belowGAvgStu[i] = {age: 0, number: 0};
	GAinfo.aboveAAvgStu[i] = {age: 0, number: 0};
	GAinfo.belowAAvgStu[i] = {age: 0, number: 0};
    }
    
    //runs through all the data, recording relevant info
    var baseAge = 15;
    GAinfo.totalStu = data.length;
    var currIndex;
    for(var i = 0; i < GAinfo.totalStu; i++) {
	currIndex = data[i].age - baseAge;
	ageGroupSize[currIndex]++;

	//totals for grades and absences
	GAinfo.gradeAbsence[currIndex].absences = data[i].absences + GAinfo.gradeAbsence[currIndex].absences;
	GAinfo.gradeAbsence[currIndex].G1 = data[i].G1 + GAinfo.gradeAbsence[currIndex].G1;	
	GAinfo.gradeAbsence[currIndex].G2 = data[i].G2 + GAinfo.gradeAbsence[currIndex].G2;
	GAinfo.gradeAbsence[currIndex].G3 = data[i].G3 + GAinfo.gradeAbsence[currIndex].G3;

	//min and max for grades
	GAinfo.max[currIndex].G1 = Math.max(GAinfo.max[currIndex].G1, data[i].G1);
	GAinfo.max[currIndex].G2 = Math.max(GAinfo.max[currIndex].G2, data[i].G2);
	GAinfo.max[currIndex].G3 = Math.max(GAinfo.max[currIndex].G3, data[i].G3);
	GAinfo.min[currIndex].G1 = Math.min(GAinfo.min[currIndex].G1, data[i].G1);
	GAinfo.min[currIndex].G2 = Math.min(GAinfo.min[currIndex].G2, data[i].G2);
	GAinfo.min[currIndex].G3 = Math.min(GAinfo.min[currIndex].G3, data[i].G3);

	//min and max for absences
	GAinfo.max[currIndex].absences = Math.max(GAinfo.max[currIndex].absences, data[i].absences);
	GAinfo.min[currIndex].absences = Math.min(GAinfo.min[currIndex].absences, data[i].absences);
	
	GAinfo.gradeAbsence[currIndex].age = 
	    GAinfo.max[currIndex].age =
	    GAinfo.min[currIndex].age = data[i].age;
	
    }

    //gets average data for all of them
    for(var i = 0; i <= ageGroups; i++) {
	//calculates average for the age
	GAinfo.gradeAbsence[i].absences = GAinfo.gradeAbsence[i].absences/ageGroupSize[i];
	GAinfo.gradeAbsence[i].G1 = GAinfo.gradeAbsence[i].G1/ageGroupSize[i];
	GAinfo.gradeAbsence[i].G2 = GAinfo.gradeAbsence[i].G2/ageGroupSize[i];
	GAinfo.gradeAbsence[i].G3 = GAinfo.gradeAbsence[i].G3/ageGroupSize[i];

    }

    //runs through all data again and counts students above and below averages
    for(var i = 0; i < GAinfo.totalStu; i++) {
	currIndex = data[i].age - 15;
	//counts grade average students
	if (data[i].G3 < GAinfo.gradeAbsence[currIndex].G3) {
	    GAinfo.belowGAvgStu[currIndex].age = data[currIndex].age;
	    GAinfo.belowGAvgStu[currIndex].number++;
	} else {
	    GAinfo.aboveGAvgStu[currIndex].age = data[currIndex].age;
	    GAinfo.aboveGAvgStu[currIndex].number++;
	}

	//counts absences avg students
	if (data[i].absences < GAinfo.gradeAbsence[currIndex].absences) {
	    GAinfo.belowAAvgStu[currIndex].age = data[currIndex].age;
	    GAinfo.belowAAvgStu[currIndex].number++;
	} else {
	    GAinfo.aboveAAvgStu[currIndex].age = data[currIndex].age;
	    GAinfo.aboveAAvgStu[currIndex].number++;
	}
    }	    

    //returns info on grades and absences
    return GAinfo;
}

//transforms data into an array of student objects
//useful as it converts unneccessary strings
function formatData(data) {
    //runs through all the data and converts it to an array of students
    var students = [];
    for(var i = 0; i < data.length; i++) {
	students[i] = new Student(data[i]);
    }

    return students;
}	

//The "csv" files are actually deliminated by semicolons
//so we have to change what to computer splits by
var scsv = d3.dsv(";", "test/plain");
var mathGraph, portGraph; //graphs of math and portuguese classes
var mathGAinfo, portGAinfo; //holds info on Grades and absences

//this reads the information in from the math class
scsv("./student/student-mat.csv", function(data) {
    //converts data into an array of students
    var mathStudents = formatData(data);

    //gets GA info from math
    mathGAinfo = gradesAndAbsences(mathStudents);
    console.log(mathGAinfo.min.map(function(d) {return d.absences;}));
    console.log(mathGAinfo.max.map(function(d) {return d.absences;}));
    console.log(mathGAinfo.gradeAbsence.map(function(d) {return d.absences;}));

    //makes a double axis bar graph with the data
    mathGraph = makeGraph(mathStudents, mathGAinfo);

});

//this reads the information in from the portugeuse class
scsv("./student/student-por.csv", function(data) {
    //converts data into an array of students
    var portStudents = formatData(data);

    //gets GA info from portugeuse
    portGAinfo = gradesAndAbsences(portStudents);

    //makes a double axis bar graph with the data
    portGraph = makeGraph(portStudents, portGAinfo);

});


/* INTERACTIVE FUNCTIONS */

function displayMinGA() {
    //changes title
    var title = "Max. Final Grade & Max. Absences in Age Group";

    //padding for visuals
    var pad = 15;

    //changes graph to display max absence and grade
    maxAbsenceAndGrade(mathGraph, title, pad, GAinfo);
}

