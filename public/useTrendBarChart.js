// set the dimensions and margins of the graph
const margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#usage-bar-chart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Initialize the X axis
const x = d3.scaleBand()
  .range([ 0, width ])
  .padding(0.2);
const xAxis = svg.append("g")
  .attr("transform", `translate(0,${height})`);

// // Initialize the Y axis
// const y = d3.scaleLinear()
//   .range([ height, 0]);
// const yAxis = svg.append("g")
//   .attr("class", "myYaxis");

// Initialize the Y axis
const y = d3.scaleLinear()
  .range([ height, 0]);
const yAxis = svg.append("g")
  .attr("class", "myYaxis")
// const y = d3.scaleLinear()
//     .domain( [0, 1])
//     .range([ height, 0 ]);

//     svg.append("g")
//     .call(d3.axisLeft(y).tickFormat(d3.format(".0%")));


// A function that create / update the plot for a given variable:
function update(selectedVar) {

  // Parse the Data
  d3.csv("https://raw.githubusercontent.com/chintseng/my_csv_file/master/marijuana_use_trend_age.csv", function(d){
    return { year : d.year, ageLevelOne: +d['age_12_'+selectedVar], ageLevelTwo: +d['age_18_'+selectedVar], ageLevelThree: +d['age_26_'+selectedVar] }
  }).then(
  // Now I can use this dataset:
  function(data) {
    const subgroups = ['ageLevelOne', 'ageLevelTwo', 'ageLevelThree']
    const groups = data.map(d => d.year)

    // X axis
    x.domain(groups).range([0, width]).padding([0.2])
    xAxis.transition().duration(1000).call(d3.axisBottom(x));

  // Add Y axis
    y.domain([0, d3.max(data, d => d['ageLevelThree']/100) ]);
    yAxis.transition().duration(1000).call(d3.axisLeft(y).tickFormat(d3.format(".0%")));


    const xSubgroup = d3.scaleBand()
    .domain(subgroups)
    .range([0, x.bandwidth()])
    .padding([0.05])

      // color palette = one color per subgroup
  const color = d3.scaleOrdinal()
  .domain(subgroups)
  .range(['#e41a1c','#377eb8','#4daf4a'])

  const u = svg.selectAll("rect")
      .data(data)

    // update bars
    u.join("rect")
      .transition()
      .duration(1000)
        .attr("x", d => x(d.year))
        .attr("y", d => y(d['ageLevelThree']/100))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d['ageLevelThree']/100))
        .attr("fill", "#9CCC65")

//   const u = svg.selectAll("rect")
//                .data(data, function(d) { return subgroups.map(function(key) {
//                     // console.log(key, d)
//                   return {key: key, value: d[key]/100}; }); })
// .join("rect")
//   // .transition()
//   // .duration(1000)
//     .attr("x", d => xSubgroup(d.key))
//     .attr("y", d => y(d.value))
//     .attr("width", xSubgroup.bandwidth())
//     .attr("height", function(d) {
//       console.log(d)
//     })
//     .attr("fill", d => color(d.key));


    // => height - y(d.value)
  //   // variable u: map data to existing bars
  //   const u = svg.selectAll("rect")
  //   .data(data)
  //   // update bars
  //   u.join("rect")
  //     .transition()
  //     .duration(1000)
  //       .attr("x", d => xSubgroup(d.year))
  //       .attr("y", d => y(d['age_12_'+selectedVar]/100))
  //       .attr("width", x.bandwidth())
  //       .attr("height", d => height - y(d['age_12_'+selectedVar]/100))
  //       .attr("fill", "#69b3a2")
  })

}

$( "input[name=use-pot-time]" ).on( "change", function() {
  update($(this).val())
});

update('lifetime')

// Data Source: https://www.samhsa.gov/data/release/2020-national-survey-drug-use-and-health-nsduh-releases