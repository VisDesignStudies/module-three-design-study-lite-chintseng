const margin = {top: 10, right: 30, bottom: 20, left: 50},
    width = 660 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#car-sale-stack-chart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Parse the Data
d3.csv("https://raw.githubusercontent.com/chintseng/my_csv_file/master/enrgy_data/Car%20sales%20by%20size%20and%20powertrain%2C%202010-2020.csv").then ( function(data) {

  // List of subgroups = header of the csv files = soil condition here
  const subgroups = data.columns.slice(1)

  // List of groups = species here = value of the first column called group -> I show them on the X axis
  const groups = data.map(d => d.Year)

  // Add X axis
  const x = d3.scaleBand()
      .domain(groups)
      .range([0, width])
      .padding([0.2])
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).tickSizeOuter(0));

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, 100])
    .range([ height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y));

      var mouseover = function(event, d) {
        let my_data = {
            a: d.data['Conventional Car'],
            b: d.data['Conventional SUVs'],
            c: d.data['Electric Car'],
            d: d.data['Electric SUVs'],
        }
        update(my_data)
        $('#my_pie_div').css('visibility', 'visible');
      }
      var mousemove = function(event, d) {

      }
      var mouseleave = function(event, d) {
        $('#my_pie_div').css('visibility', 'hidden');
      }

    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Percentage"); 
  // color palette = one color per subgroup
  const color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#81D4FA','#03A9F4','#AED581', '#7CB342'])



  // Normalize the data -> sum of each group must be 100!
//   dataNormalized = []
  data.forEach(function(d){
    // Compute the total
    let tot = 0
    for (let i in subgroups){ name=subgroups[i] ; tot += +d[name] }
    // Now normalize
    for (let i in subgroups){ name=subgroups[i] ; d[name] = d[name] / tot * 100}
  })

  //stack the data? --> stack per subgroup
  const stackedData = d3.stack()
    .keys(subgroups)
    (data)

  // Show the bars
  svg.append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .join("g")
      .attr("fill", d => color(d.key))
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(d => d)
      .join("rect")
        .attr("x", d => x(d.data.Year))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width",x.bandwidth())
        .on("mouseover", mouseover)
              .on("mousemove", mousemove)
              .on("mouseleave", mouseleave)
})

const width_pie = 350,
    height_pie = 350,
    margin_pie = 40;

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
const radius = Math.min(width_pie, height_pie) / 2 - margin_pie;

// append the svg object to the div called 'my_dataviz'
const svg_pie = d3.select("#my_pie_div")
  .append("svg")
    .attr("width", width_pie)
    .attr("height", height_pie)
  .append("g")
    .attr("transform", `translate(${width_pie/2}, ${height_pie/2})`);

// create 2 data_set
const data1 = {a: 9, b: 20, c:30, d:8, e:12}
const data2 = {a: 6, b: 16, c:20, d:14, e:19, f:12}

// set the color scale
const color = d3.scaleOrdinal()
  .domain(["a", "b", "c", "d", "e", "f"])
  .range(['#81D4FA','#03A9F4','#AED581', '#7CB342']);

// A function that create / update the plot for a given variable:
function update(data) {

  // Compute the position of each group on the pie:
  const pie = d3.pie()
    .value(function(d) {return d[1]; })
    .sort(function(a, b) { return d3.ascending(a.key, b.key);} ) // This make sure that group order remains the same in the pie chart
  const data_ready = pie(Object.entries(data))

  // map to data
  const u = svg_pie.selectAll("path")
    .data(data_ready)

  // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
  u
    .join('path')
    .transition()
    .duration(1000)
    .attr('d', d3.arc()
      .innerRadius(0)
      .outerRadius(radius)
    )
    .attr('fill', function(d){ return(color(d.data[0])) })
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .style("opacity", 1)
    
}
svg_pie.append("circle").attr("cx",-150).attr("cy", 160).attr("r", 6).style("fill", "#81D4FA")
svg_pie.append("circle").attr("cx",-60).attr("cy",160).attr("r", 6).style("fill", "#03A9F4")
svg_pie.append("circle").attr("cx",35).attr("cy", 160).attr("r", 6).style("fill", "#AED581")
svg_pie.append("circle").attr("cx",80).attr("cy",160).attr("r", 6).style("fill", "#7CB342")
svg_pie.append("text").attr("x", -140).attr("y", 160).text("Fuel Car").style("font-size", "15px").attr("alignment-baseline", "middle")
svg_pie.append("text").attr("x", -50).attr("y", 160).text("Fuel SUV").style("font-size", "15px").attr("alignment-baseline","middle")
svg_pie.append("text").attr("x", 45).attr("y", 160).text("EV").style("font-size", "15px").attr("alignment-baseline", "middle")
svg_pie.append("text").attr("x", 90).attr("y", 160).text("EV SUV").style("font-size", "15px").attr("alignment-baseline","middle")

// Initialize the plot with the first dataset
// update(data1)