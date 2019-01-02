var app = {
    initialize: (() => {
        //Use jQuery to assign a callback function when the 'search' button is clicked

        $("#submit").click(function () {
            console.log("load");
            //Use jQuery to get the value of the 'query' input box
            let userTrouble = $("#trouble").val();
            console.log(userTrouble);
            app.searching(userTrouble);
        });


    }),

    visualize: function (data) {
        var width = window.innerWidth / 3;
        var height = window.innerHeight / 1.2;
        var counters = {};
    
        data.forEach((item) => {
            if (item.year in counters) {
                counters[item.year]++;
            } else {
                counters[item.year] = 1;
            }
            item.Y = counters[item.year];
        });
    
        var yScale = d3.scaleLinear()
            .domain(d3.extent(data, d => {
                return d.Y;
            }))
            .range([height - 60, 0]);
    
        var xScale = d3.scaleLinear()
            .domain(d3.extent(data, d => {
                return d.year;
            }))
            .range([10, width - 10]);
    
        var labelScale = d3.scaleLinear()
            .domain([10, width - 10])
            .range(d3.extent(data, d => {
                return d.year;
            }))
    
        var mouseG = d3.select("svg").append("g")
            .attr("class", "mouse-over-effects");
    
        mouseG.append("path") // this is the black vertical line to follow mouse
            .attr("class", "mouse-line")
            .style("stroke", "grey")
            .style("stroke-width", "3px")
            .style("opacity", "1");
    
    
        var mouseLabel = mouseG.append('svg:g');
        mouseLabel
            .classed("mouse-label", true)
            .attr('transform', 'translate(0, 5)');
    
        mouseLabel.append('svg:rect')
            .attr('fill', 'grey')
            .attr('y', '-19.5')
            .attr('width', '42')
            .attr('height', '30');
    
        var mouseLabelText = mouseLabel
            .append("svg:text")
            .attr('x', '2')
            .style('fill', 'white');
    
    
        mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
            .attr('width', width) // can't catch mouse events on a g element
            .attr('height', height)
            .attr('fill', 'none')
            .attr('pointer-events', 'all')
    
            .on('mousemove', function () { // mouse moving over canvas
                var mouse = d3.mouse(this);
                d3.select(".mouse-line")
                    .attr("d", function () {
                        var d = "M" + mouse[0] + "," + height;
                        d += " " + mouse[0] + "," + 0;
                        return d;
                    });
    
                mouseLabel.attr('transform', 'translate(' + mouse[0] + ', 50)')
                mouseLabelText.text(Math.round(labelScale(mouse[0])))
            });
    
    
        var svg = d3.select("svg");
        svg.selectAll("*").remove();
        svg.attr("width", width)
            .attr("height", height)
            .append("g")
            .selectAll("circle")
            .data(data)
            .enter()
            .append("a")
            .attr("xlink:href", function (d) {
                return "https://www.uexpress.com/dearabby/" + d.date;
            })
            .attr("target", "_blank")
            .append("circle")
            .attr("fill", function (d) {
                return 'rgba(0, 0, 0, ' + d.score + ')';
            })
            .attr("r", 2)
            .attr("cy", function (d) {
                return yScale(d.Y);
            })
            .attr("cx", function (d) {
                return xScale(d.year);
            })
            .on('mousemove touchmove', showTooltip)
            .on('mouseout touchend', hideTooltip) 
            .on('click', tooltip2Show)



            function showTooltip(d) {
                let time = d3.select('#date');
                time
                    .text(d.date);
          
                let reader = d3.select('#question');
                reader
                    .text(d.question);
  
                var tooltip = d3.select('.tooltip');
                    
                tooltip    
                    .style('opacity', 1)
                    .style('left',  d3.event.pageX + "+ 100" + 'px' )
                    .style('top',   (d3.event.pageY - 200)  + 'px');
              }

              function hideTooltip(d) {
                d3.select('.tooltip')      
                    .style('opacity', 0);
              }


              function tooltip2Show(d){

                let time2 = d3.select('#date2');
                time2
                    .text(d.date);
                
                let abby = d3.select('response');
                abby
                    .text(d.response);
             
          
                var tooltip2 = d3.select(".tooltip2")
                tooltip2
                    .style('opacity', 1)
                    .style('left',  (d3.event.pageX + 100) + 'px' )
                    .style('top',   d3.event.pageY + 'px');  
        
              d3.event.stopPropagation();
            } 

            var tooltip2 = d3.select(".tooltip2");
            var tooltipWithContent = d3.selectAll('.tooltip2, .tooltip2 *');
            function equalToEventTarget() {
                return this == d3.event.target;
            }
      
            d3.select("body").on("click",function(){
                var outside = tooltipWithContent.filter(equalToEventTarget).empty();
                if (outside) {
                    tooltip2.classed("hidden", true);
                }
            });
    
        var xAxis = d3.axisBottom(xScale);
        d3.select("svg")
            .append("g")
            .attr("transform", "translate(0," + (height - 50) + ")")
            .call(xAxis)
            .style("fill", "grey");
    
    },

    searching: function (userTrouble) {
        $.ajax({
            url: "http://cc5847.itp.io:1225/api",
            type: 'GET',
            data: {
                query: userTrouble
            },
            dataType: 'jsonp',
            error: function (data) {
                console.log("We got problems");
                //console.log(data.status);
            },
            success: function (data) {
                // debugger;
                console.log("WooHoo!");
                const counters = {};
                for (const item of data) {
                    const { date } = item;
                    item.year = parseInt(date.substring(0, 4));
                }
                app.visualize(data);
            }
        })
    }
}