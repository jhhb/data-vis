/* property of James Boyle and David Reichert */

//defined variables
var UNKSTR = "Un";
var UNKNUM = Number.MIN_VALUE;

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


//transforms data into an array of student objects
//useful as it converts unneccessary strings
function formatData(data) {
    //runs through all the data and converts it to an array of students
    var students = [];
    for(var i = 0; i < data.length; i++) {
	console.log(i);
	students[i] = new Student(data[i]);
    }

    return students;
}

//The "csv" files are actually deliminated by semicolons
//so we have to change what to computer splits by
var scsv = d3.dsv(";", "test/plain");

//this reads the information in
scsv("./student/student-mat.csv", function(data) {
    //functions can be called to visualize data
    //printData(data);

    //converts data into an array of students
    console.log("HELLO");
    var students = formatData(data);

    //makes a double axis bar graph with the data
    makeGraph(students);

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
    var w = 800;
    var h = 600;

    //size of graph
    var graphTop = 80;
    var graphBottom = 400 + graphTop;
    var graphLeft = 100;
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

    dualBarGraph(graph);
}

//labels left Y axis with given label
function labelLeftY(graph, yAxisLeft, label) {
    graph.svg.append("g")
	.attr("class", "y axis axisLeft")
	.attr("transform", "translate(" + graph.left + "," + graph.top + ")")
	.call(yAxisLeft)
	.append("text")
	.attr("y", 6)
	.attr("dy", "-2em")
	.style("text-anchor", "end")
	.text(label);
}
 
//labels right Y axis with given label
function labelRightY(graph, yAxisRight, label) {   
    graph.svg.append("g")
	.attr("class", "y axis axisRight")
	.attr("transform", "translate(" + graph.right + "," + graph.top + ")")
	.call(yAxisRight)
	.append("text")
	.attr("y", 6)
	.attr("dy", "-2em")
	.attr("dx", "2em")
	.style("text-anchor", "end")
	.text(label);
}

//dual bar graph
function dualBarGraph(graph) {
    //padding for visuals
    var pad = 15;

    //makes age scale
    var age = d3.scale.ordinal()
	.rangeRoundBands([graph.left + pad, graph.right - pad], 0.1);

    //sorts array of ages to get labels
    age.domain(graph.data.map(function(d) {return d.age;}).sort());

    //makes y scales for 
    var y0 = d3.scale.linear().domain([0, 20]).range([graph.bottom - graph.top, 0]);
    var y1 = d3.scale.linear().domain([0, 100]).range([graph.bottom - graph.top, 0]);

    //makes x axis
    var xAxis = d3.svg.axis()
	.scale(age)
	.orient("bottom");

    //create left yAxis
    var yAxisLeft = d3.svg.axis().scale(y0).ticks(5).orient("left");

    //create right yAxis
    var yAxisRight = d3.svg.axis().scale(y1).ticks(5).orient("right");

    graph.svg.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + graph.bottom + ")")
	.call(xAxis);

    labelLeftY(graph, yAxisLeft, "Final Grade");
    labelRightY(graph, yAxisRight, "Absences");

    //gets grades and absences
    var gradesAbsences = gradesAndAbsences(graph.data);

    bars = graph.svg.selectAll(".bar").data(gradesAbsences).enter();

    bars.append("rect")
	.attr("class", "bar1")
	.attr("fill", "blue")
	.attr("x", function(d) { 
	    return age(d.age); 
	})
	.attr("width", age.rangeBand()/2)
	.attr("y", function(d) {
	    return graph.bottom - y0(d.G3); 
	})
	.attr("height", function(d,i,j) { 
	    return y0(d.G3); 
	}); 

    bars.append("rect")
	.attr("class", "bar2")
	.attr("fill", "red")
	.attr("x", function(d) { 
	    return age(d.age) + age.rangeBand()/2; 
	})
	.attr("width", age.rangeBand() / 2)
	.attr("y", function(d) { 
	    return graph.bottom - y1(d.absences); 
	})
	.attr("height", function(d,i,j) { 
	    return y1(d.absences); 
	}); 

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

//records final grades and absences for ages 15 through 22, then averages them
function gradesAndAbsences(data) {
    //counts number of students in age group
    var ageGroupSize = [];
    
    //records absenses and grades for each student
    var gradeAbsence = [];

    //zeroes data
    var ageGroups = 22 - 15; //number of age groups
    for(var i = 0; i <= ageGroups; i++) {
	ageGroupSize[i] = 0;
	gradeAbsence[i] = new EmptyStudent();
	gradeAbsence[i].absences = 0;
	gradeAbsence[i].G3 = 0;
    }
    
    //runs through all the data, recording relevant info
    var baseAge = 15;
    var currIndex;
    for(var i = 0; i < data.length; i++) {
	currIndex = data[i].age - baseAge;
	ageGroupSize[currIndex]++;
	gradeAbsence[currIndex].absences = data[i].absences + gradeAbsence[currIndex].absences;
	gradeAbsence[currIndex].G3 = data[i].absences + gradeAbsence[currIndex].G3;
	gradeAbsence[currIndex].age = data[i].age;
    }

    //gets average data for all of them
    for(var i = 0; i <= ageGroups; i++) {
	//deletes object of no data for age group
	if(gradeAbsence[i].age == UNKNUM) {
	    gradeAbsences.splice(i, 1);
	}

	//calculates average for the age
	gradeAbsence[i].absences = gradeAbsence[i].absences/ageGroupSize[i];
	gradeAbsence[i].G3 = gradeAbsence[i].G3/ageGroupSize[i];

    }

    return gradeAbsence;
}
	

