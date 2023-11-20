/*
*    main.js
*    Bar chart visualization using D3.js with dynamic effects
*/

const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 100 }
const WIDTH = 800 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 600 - MARGIN.TOP - MARGIN.BOTTOM

let flag = true

const svg = d3.select("#chart-area").append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

const g = svg.append("g")
  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)



  // X label
g.append("text")
  .attr("class", "x axis-label")
  .attr("x", WIDTH / 2)
  .attr("y", HEIGHT + 80)
  .attr("font-size", "20px")
  .attr("text-anchor", "left")
  .text("Airports")

// Y label
const yLabel = g.append("text")
  .attr("class", "y axis-label")
  .attr("x", - (HEIGHT / 2))
  .attr("y", -60)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")

const x = d3.scaleBand()
  .range([0, WIDTH])
  .paddingInner(0.3)
  .paddingOuter(0.2)

const y = d3.scaleLinear()
  .range([HEIGHT, 0])

const xAxisGroup = g.append("g")
  .attr("class", "x axis")
  .attr("transform", `translate(0, ${HEIGHT})`)

const yAxisGroup = g.append("g")
  .attr("class", "y axis")

d3.csv("data/flights.csv").then(data => {
  data.forEach(d => {
    d.cancellations = Number(d.cancellations)
    d.delays = Number(d.delays)
  })

  console.log(data)

  d3.interval(() => {
    //flag = !flag
    update(data)
  }, 100)

  update(data)
})

d3.select("#selected-dropdown").text("first");
d3.select("select")
.on("change",function(d){
var selected = d3.select("#otp-select").node().value;
console.log("Selected value is ",selected );
      if (selected == "delays")
      {
        flag = 1
      }

      if (selected == "cancellations")
      {
        flag = 0
      }
  d3.select("#selected-dropdown").text(selected);
  })

function update(data) {
  const value = flag ? "delays" : "cancellations"
  const t = d3.transition().duration(185)

  x.domain(data.map(d => d.origin))
  y.domain([0, d3.max(data, d => d[value])])


  const xAxisCall = d3.axisBottom(x)
  xAxisGroup.transition(t).call(xAxisCall)
  //xAxisGroup.call(xAxisCall)
    .selectAll("text")
      .attr("y", "10")
      .attr("x", "-5")
      .attr("font-size", "18px") //Set to 18 pixels equivalent to 14 font
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-40)")

  const yAxisCall = d3.axisLeft(y)
    .ticks(4)
    .tickFormat(d => d)
  yAxisGroup.transition(t).call(yAxisCall)
      .attr("font-size", "18px") //Set to 18 pixels equivalent to 14 font
  //yAxisGroup.call(yAxisCall)

  // JOIN new data with old elements.
  const rects = g.selectAll("rect")
    .data(data)

  // EXIT old elements not present in new data.
  rects.exit().remove()

  // UPDATE old elements present in new data.
  rects.transition(t)
    .attr("y", d => y(d[value]))
    .attr("x", (d) => x(d.origin))
    .attr("width", x.bandwidth)
    .attr("height", d => HEIGHT - y(d[value]))

  // ENTER new elements present in new data.  
  rects.enter().append("rect")
    .attr("y", d => y(d[value]))
    .attr("x", (d) => x(d.origin))
    .attr("width", x.bandwidth)
    .attr("height", d => HEIGHT - y(d[value]))
    .attr("fill", "grey")
    .attr("fill", function(d){ if (d.origin == 'OAK') return "#3580BB" ; else return "#D9D9D9"})

  const text = flag ? "Average delays (min)" : "No. of Cancellations (-)"
  //const text = flag ? "Delays ($)" : "Cancellations ($)"
  yLabel.text(text)


}
