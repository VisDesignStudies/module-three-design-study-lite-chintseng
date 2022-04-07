const svg = d3.select("#my_dataviz"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

const projection = d3.geoMercator()
  .scale(450) // This is the zoom
  .translate([1150, 600]); // You have to play with these values to center your map

// Path generator
const path = d3.geoPath()
  .projection(projection)

function updateChart(selectYear){
  // Data and color scale
  let data = new Map()

  Promise.all([
      d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/us_states_hexgrid.geojson.json"),
      d3.csv("https://raw.githubusercontent.com/chintseng/my_csv_file/master/enrgy_data/State%20Electricity%20Profiles_"+selectYear+".csv", function(d) {
          data.set(d.iso3166_2, d['Average retail price (cents/kWh)'])
      })
      ]).then(function(loadData){
          console.log(data, Math.min(...data.values()))
          const color = d3.scaleSequential().domain([Math.min(...data.values()), Math.max(...data.values())])
    .interpolator(d3.interpolateGnBu);

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
            .html("State: " +  d.properties.google_name + "<br/>Average retail price (cents/kWh): " + data.get(d.properties.iso3166_2))
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


          // Draw map
          let topo = loadData[0]
          svg.append("g")
          .selectAll("path")

          .data(topo.features)
          .join("path")
              .attr("fill", d => color(data.get(d.properties.iso3166_2)))
              .attr("d", path)
              .attr("stroke", "white")
              .on("mouseover", mouseover)
              .on("mousemove", mousemove)
              .on("mouseleave", mouseleave)
      
          // Add the labels
          svg.append("g")
              .selectAll("labels")
              .data(topo.features)
              .join("text")
              .attr("x", function(d){return path.centroid(d)[0]})
              .attr("y", function(d){return path.centroid(d)[1]})
              .text(function(d){ return d.properties.iso3166_2})
              .attr("text-anchor", "middle")
              .attr("alignment-baseline", "central")
              .style("font-size", 11)
              .style("fill",  '#000')

      })
  }
  updateChart('2019')
    $('input[name=map-radio]').on("change", function() {
      updateChart($(this).val())
    })