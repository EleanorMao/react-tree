/** @jsx React.DOM */

require('./Tree.scss');
var React = require('react');
var d3 = require('d3');
var Node = require('./Node.jsx');
var {bfs, Memoizer} = require('../util');

var Tree = React.createClass({
  propTypes: {
    tree: React.PropTypes.array.isRequired,
    line: React.PropTypes.bool,
    horizontal: React.PropTypes.bool
  },

  statics : {
    bfs: bfs,
    Memoizer: Memoizer
  },

  render () {
    var ort = this.props.horizontal ? ['y', 'x'] : ['x', 'y'];
    var pathGen;
    var root = this.props.tree[0];
    var tree = d3.layout
                 .tree()
                 .size([460, 460]);
    var nodes = tree.nodes(root);
    var links = tree.links(nodes);

    if (!this.props.line)
      pathGen = d3.svg.diagonal()
                      .projection((d) => [d[ort[0]], d[ort[1]]]);
    else
      pathGen = (d) => d3.svg.line()
                       .x((d) => d[ort[0]])
                       .y((d) => d[ort[1]])([{x: d.source.x, y: d.source.y}, 
                                             {x: d.target.x, y: d.target.y}]);


    nodes.forEach((d) => {d.y = d.depth * 180;});

    var nodeElems = nodes.map((node, i) =>
      <Node x={node[ort[0]]} y={node[ort[1]]} name={node.name} 
            r={10} key={i} active={node.active} />);

    var linkElems = links.map((link, i) =>
      <path key={i} className={'Link'} d={pathGen(link, i)}></path>);

    return (
      <svg viewBox={"0 0 460 460"}
           preserveAspectRatio="xMidYMid">
        <g className={'Tree'} transform="translate(40,20)">
          {linkElems}
          {nodeElems}
        </g>
      </svg>
    );
  }
});

module.exports = Tree;
