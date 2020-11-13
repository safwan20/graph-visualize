var width = 960,
    height = 500;


var fill = d3.scale.category20();


var force = d3.layout.force()
    .size([width, height])
    .nodes([{}]) // initialize with a single node
    .linkDistance(30)
    .charge(-900)
    .on("tick", tick);


var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)

var index = 1;
var nodeslist = [1];
var dict = {};
var srcdict = {};
var destdict = {};
var Graph = {};
var queue = [];
var visited = [0];
var bfslist = [];
var dfslist = [];
var edgesrc = {};
var edgedest = {};
var bootnode;


Graph[1] = new Set();

var nodes = force.nodes(),
    links = force.links(),
    node = svg.selectAll(".node");
    link = svg.selectAll(".link");

function addNode() {
  console.log("ADD NODE");

  index = index + 1;
  nodeslist.push(index);


  var btn = document.createElement("BUTTON");

  var point = d3.mouse(btn),
            node = {x: point[0], y: point[1]},
            n = nodes.push(node);

  dict[index] = nodes[nodes.length - 1];
  Graph[index] = new Set();

  restart();
}

function addEdge(s, d) {
  console.log("ADD EDGE");

  var alphaSrc = parseInt(s);
  var alphaDest = parseInt(d);

  if(nodeslist.includes(alphaSrc) && nodeslist.includes(alphaDest)) {
        var source = dict[alphaSrc];
        var target = dict[alphaDest];

        Graph[alphaSrc].add(alphaDest);
        Graph[alphaDest].add(alphaSrc);

        console.log(Graph);

        links.push({source: source, target: target});

        restart();
  }
  // else {
  //   alert("EDGE IS NOT PROPER");

  // }
}


function dekh(u) {
  visited[u] = 1;
  dfslist.push(u);
  Graph[u].forEach(function(x) {
          if(!visited[x])  {
            dekh(x);
          }
      });
}

d3.select("#dfs").on("click", function() {
  var seq = "";
  var element = document.getElementById("seq");
  console.log(element.innerHTML);
  element.innerHTML = "";
  console.log(element.innerHTML);
  queue.forEach(function(y) {
      visited.push(0);
  });
  dekh(1);

  console.log(Graph);

  for(var j=0;j<dfslist.length;j++) {
    var y = dfslist[j];
    if(j==dfslist.length-1) {
      seq = seq + y.toString();
    }
    else {
      seq = seq + y.toString() + "---->";
    }
  }
  element.innerHTML = seq;
  dfslist.length = 0;
  visited = [0];
});

d3.select("#bfs").on("click", function() {
  var seq = "";
  var element = document.getElementById("seq");
  element.innerHTML = "";
  queue.forEach(function(y) {
      visited.push(0);
  });

  console.log(Graph);

  bfslist.push(1);
  queue.push(1);
  visited[1] = 1;

  while(queue.length > 0)  {
    var front = queue.shift();
    Graph[front].forEach(function(x) {
          if(!visited[x])  {
            bfslist.push(x);
            queue.push(x);
            visited[x] = 1;
        }
    });
  }

  console.log(bfslist);

  for(var j=0;j<bfslist.length;j++) {
    var y = bfslist[j];
    if(j==bfslist.length-1) {
      seq = seq + y.toString();
    }
    else {
      seq = seq + y.toString() + "---->";
    }
  }
  element.innerHTML = seq;
  bfslist.length = 0;
  visited = [0];
});

d3.select("#built").on("click", function() {
    console.log(nodes.length);
    if(nodeslist.length!=1 || nodeslist[0]!=1) {
      alert("First Clear This Graph");
    }

    else {
      var no_nodes = parseInt(document.getElementById("nodess").value) - 1;
      var texts = document.getElementById("conn").value;
      texts = texts.split(/\r|\n/);

      console.log("no of nodes",no_nodes);

      //nodes 
      restart();
      for(var j=0;j<no_nodes;j++) {
        console.log(j);
        addNode();
      }

      //edges
      texts.forEach(function(text) {
          var h = text.split(" ");
          addEdge(h[0], h[1]);
      });   
    }  
});


d3.select("#reset").on("click", function() {
    bootnode = nodes[0]; 
    nodes.splice(0,nodes.length);
    links.splice(0,links.length);
    nodeslist.splice(0, nodeslist.length);
    index = 1;
    nodeslist = [1];
    dict = {};
    srcdict = {};
    destdict = {};
    Graph = {};
    queue = [];
    visited = [0];
    bfslist = [];
    dfslist = [];
    edgesrc = {};
    edgedest = {};

    Graph[1] = new Set();

    var element = document.getElementById("seq");
    element.innerHTML = "";

    console.log(nodes);
    console.log(links);
    console.log(nodeslist);
    update();
});



function tick() {
	console.log("Tick is called");
  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
}



function update () {
  console.log("Update is Called");
    console.log(nodes.length);
    console.log(links.length);

  //Node Code
  node = node.data(nodes);

  var gnode = node.enter().append("g").classed("gnode",true);
     
  var circle = gnode.append("circle")
      .attr("r", 15)
     
  var text = gnode.append("text")
    .attr("x", -5)
    .attr("dy", ".35em")
    .style("fill","white")
    .text(index);

  node.exit()
      .remove();

  console.log("bootnode", bootnode);

  nodes.push(bootnode);

  //Link Code
  link = link.data(links);

  link.enter().insert("line", ".node")
      .attr("class", "link");

  link.exit()
      .remove();



  force.start();
}


function restart() {
  console.log("Restart is called");

  console.log(nodes.length);
  console.log(links.length);
  
  //Node Code
  node = node.data(nodes);

  var gnode = node.enter().append("g").classed("gnode",true);
     
  var circle = gnode.append("circle")
      .attr("r", 15)
     
  var text = gnode.append("text")
    .attr("x", -5)
    .attr("dy", ".35em")
    .style("fill","white")
    .text(index);

  node.exit()
      .remove();

  dict[index] = nodes[nodes.length - 1];

  console.log(dict);

  //Link Code
  link = link.data(links);

  link.enter().insert("line", ".node")
      .attr("class", "link");

  link.exit()
      .remove();

  force.start();
}
