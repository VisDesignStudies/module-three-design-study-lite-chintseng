const margin = {top: 10, right: 100, bottom: 30, left: 60},
    width = 1460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#support-line-chart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

//Read the data
d3.csv("https://raw.githubusercontent.com/chintseng/my_csv_file/master/enrgy_data/Commercial%20Sector%20Energy%20Price%20and%20Expenditure%20Estimates%2C%201970-2019.csv").then(function (data) {
  // List of groups (here I have one group per column)
  const allGroup = ['Prices in Dollars per Million Btu.Primary Energy.Coal', 'Prices in Dollars per Million Btu.Primary Energy.NaturalGas', 'Prices in Dollars per Million Btu.Primary Energy. DistillateFuelOil']

  // Reformat the data: we need an array of arrays of {x, y} tuples
  const dataReady = allGroup.map( function(grpName) { // .map allows to do something for each element of the list
    return {
      name: grpName,
      values: data.map(function(d) {
        return {time: d.Year, value: +d[grpName]};
      })
    };
  });
  // I strongly advise to have a look to dataReady with
  // console.log(dataReady)

  const x_year_array = data.map(function(d) {
    return d.Year
  })

  // A color scale: one color for each group
  const myColor = d3.scaleOrdinal()
    .domain(allGroup)
    .range(d3.schemeSet2);

  // Add X axis --> it is a date format
  const x = d3.scaleBand()
  .domain(x_year_array)
  .range([0, width])
  .padding([0.2])

  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  // Add Y axis
  const y = d3.scaleLinear()
    .domain( [0, 30])
    .range([ height, 0 ]);

  // svg.append("g")
  //   .call(d3.axisLeft(y).tickFormat(d3.format(".0%")));


  svg.append("g")
  .call(d3.axisLeft(y));

  // Add the lines
  const line = d3.line()
    .x(d => x(d.time))
    .y(d => y(+d.value))

    svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Prices in Dollars per Million Btu");

  svg.selectAll("myLines")
    .data(dataReady)
    .join("path")
      .attr("d", d => line(d.values))
      .attr("stroke", d => myColor(d.name))
      .style("stroke-width", 4)
      .style("fill", "none")

       // create a tooltip
    const Tooltip = d3.select("#support-line-chart")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "#F5F5F5")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("position", "absolute")

    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function(event, d) {
      Tooltip
          .html("Price: $" +  d.value)
          .style("opacity", 1)
    }
    var mousemove = function(event, d) {
      Tooltip
      .style("left", (event.x/2+400) + "px")
        .style("top", window.scrollY + (event.y/2) + 100 + "px")
    }
    var mouseleave = function(event, d) {
      Tooltip
        .style("opacity", 0)
    }


  // Add the points
  svg
    // First we need to enter in a group
    .selectAll("myDots")
    .data(dataReady)
    .join('g')
      .style("fill", d => myColor(d.name))
    // Second we need to enter in the 'values' part of this group
    .selectAll("myPoints")
    .data(d => d.values)
    .join("circle")
      .attr("cx", d => x(d.time))
      .attr("cy", d => y(d.value))
      .attr("r", 5)
      .attr("stroke", "white")
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)

  const textMap = { "Prices in Dollars per Million Btu.Primary Energy.Coal": "Caol", "Prices in Dollars per Million Btu.Primary Energy.NaturalGas": "NaturalGas", "Prices in Dollars per Million Btu.Primary Energy. DistillateFuelOil": "DistillateFuelOil" };
  // Add a legend at the end of each line
  svg
    .selectAll("myLabels")
    .data(dataReady)
    .join('g')
      .append("text")
        .datum(d => { return {name: d.name, value: d.values[d.values.length - 1]}; }) // keep only the last value of each time series
        .attr("transform",d => `translate(${x(d.value.time)},${y(d.value.value)})`) // Put the text at the position of the last point
        .attr("x", 12) // shift the text a bit more right
        .text(d => textMap[d.name])
        .style("fill", d => myColor(d.name))
        .style("font-size", 15)
})

// Data source = https://www.statista.com/statistics/935349/us-support-for-legal-marijuana-since-2000-by-political-party/