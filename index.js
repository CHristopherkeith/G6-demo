const width = document.getElementById("container").scrollWidth;
const height = document.getElementById("container").scrollHeight || 500;
const MY_TREE_NODE = "my-tree-node";
const COLLAPSE_ICON = function COLLAPSE_ICON(x, y, r) {
  return [
    ["M", x - r, y],
    ["a", r, r, 0, 1, 0, r * 2, 0],
    ["a", r, r, 0, 1, 0, -r * 2, 0],
    ["M", x - r + 4, y],
    ["L", x - r + 2 * r - 4, y]
  ];
};
const EXPAND_ICON = function EXPAND_ICON(x, y, r) {
  return [
    ["M", x - r, y],
    ["a", r, r, 0, 1, 0, r * 2, 0],
    ["a", r, r, 0, 1, 0, -r * 2, 0],
    ["M", x - r + 4, y],
    ["L", x - r + 2 * r - 4, y],
    ["M", x - r + r, y - r + 4],
    ["L", x, y + r - 4]
  ];
};
const nodeBasicMethod = {
  createNodeBox: function createNodeBox(group, config, width, height, isRoot) {
    let { size, style, labelCfg } = config;
    width = size[0];
    height = size[1];
    // if(config.id === 'root'){
    //     // size: [288, 63],
    //     width = 288
    //     height = 63
    // }
    let isLeft = config.position === "left";
    /* 最外面的大矩形 */
    const container = group.addShape("rect", {
      attrs: {
        x: 0,
        y: 0,
        width,
        height: height + 20,
        // stroke: "red"
      }
    });
    // if (!isRoot) {
    //   /* 左边的小圆点 */
    //   group.addShape("circle", {
    //     attrs: {
    //       x: 3,
    //       y: height / 2,
    //       r: 6,
    //       fill: config.basicColor
    //     }
    //   });
    // }
    /* 矩形 */
    group.addShape("rect", {
      attrs: {
        x: 0,
        y: isLeft ? 20 : 0,
        width: width,
        height: height,
        // fill: config.bgColor,
        // stroke: config.borderColor,
        // radius: 2,
        // cursor: "pointer",
        ...style,
        // labelCfg: { ...labelCfg },
      }
    });
    return container;
  },
  /* 生成树上的 marker */
  createNodeMarker: function(group, collapsed, config) {
    let { size, style, labelCfg } = config;
    let width = size[0];
    let height = size[1];
    let isLeft = config.position === "left";
    // group.addShape("circle", {
    //   attrs: {
    //     x: width/2,
    //     y: height+10,
    //     // r: 11,
    //     fill: "rgba(47, 84, 235, 0.05)",
    //     opacity: 0,
    //     zIndex: -2
    //   },
    //   className: "collapse-icon-bg"
    // });
    group.addShape("marker", {
      attrs: {
        x: width / 2,
        y: isLeft ? 10 : height + 10,
        radius: 10,
        symbol: collapsed ? EXPAND_ICON : COLLAPSE_ICON,
        stroke: "rgba(0,0,0,0.25)",
        fill: "rgba(0,0,0,0)",
        lineWidth: 1,
        cursor: "pointer"
      },
      className: "collapse-icon"
    });
  },
  setState: function(name, value, item) {
    graph.setAutoPaint(true);
  }
};
G6.registerNode(
  MY_TREE_NODE,
  {
    drawShape: function(cfg, group) {
      const config = cfg;
        console.log(config, "[cfg]");
      let { labelCfg = {} } = cfg;

      const container = nodeBasicMethod.createNodeBox(
        group,
        config,
        184,
        94
        // isRoot
      );

      /* name */
      group.addShape("text", {
        attrs: {
          //   text: fittingString(cfg.name, 133, 12),
          //   text: "11111111111122222\n2222333333",
          text: cfg.name,
          x: 0,
          y: config.position === "left" ? 60 : 40,
          //   fontSize: 14,
          //   fontWeight: 700,
          // textAlign: "center",
          //   textBaseline: "middle",
          // fill: "red",
          ...labelCfg.style
          //   cursor: "pointer"
        }
      });

      /* amount */
      cfg.amount &&
        group.addShape("text", {
          attrs: {
            //   text: fittingString(cfg.name, 133, 12),
            //   text: "11111111111122222\n2222333333",
            text: `${cfg.amount}万元`,
            x: 0,
            y: config.position === "left" ? 90 : 70,
            fontSize: 13,
            //   fontWeight: 700,
            //   textAlign: "left",
            //   textBaseline: "middle",
            fill: "#666666"
            //   ...labelCfg.style,
            //   cursor: "pointer"
          }
        });

      const hasChildren = cfg.children && cfg.children.length > 0;
      if (hasChildren) {
        nodeBasicMethod.createNodeMarker(group, cfg.collapsed, config);
      }
      return container;
    },
    // afterDraw: nodeBasicMethod.afterDraw,
    // setState: nodeBasicMethod.setState,
  },
  "single-shape"
);
const graph = new G6.TreeGraph({
  container: "container",
  width,
  height,
  //   pixelRatio: 2,
  //   fitView: true,
  modes: {
    default: [
      {
        type: "collapse-expand",
        shouldUpdate: function shouldUpdate(e) {
          /* 点击 node 禁止展开收缩 */
          if (e.target.get("className") !== "collapse-icon") {
            return false;
          }
          return true;
        },
        onChange: function onChange(item, collapsed) {
          //   selectedItem = item;
          const icon = item.get("group").findByClassName("collapse-icon");
          if (collapsed) {
            icon.attr("symbol", EXPAND_ICON);
          } else {
            icon.attr("symbol", COLLAPSE_ICON);
          }
        }
        // animate: {
        //   callback: function callback() {
        //     graph.focusItem(selectedItem);
        //   }
        // }
      },
      "drag-canvas",
      "zoom-canvas"
    ]
  },
  defaultNode: {
    size: [184, 94],
    // shape: "rect",
    shape: MY_TREE_NODE,
    anchorPoints: [
      [0.5, 0],
      [0.5, 1]
    ],
    style: {
      fill: "#FFFFFF",
      stroke: "#D3D9E6"
      //   fontSize: 20,
    },
    labelCfg: {
      style: {
        fontSize: 14,
        fill: "#333333"
      }
    }
  },
  defaultEdge: {
    shape: "cubic-vertical",
    style: {
      stroke: "#ABB3C0"
    }
  },
  layout: {
    // type: "mindmap",
    type: "compactBox",
    direction: "V",
    getHeight: () => {
      return 94;
    },
    getWidth: () => {
      return 184;
    },
    getVGap: () => {
      return 50;
    },
    getHGap: () => {
      return 15;
    },
    getSide: d => {
      if (d.data.position === "left") {
        return "left";
      }
      return "right";
    }
  }
});

// let centerX = 0;
graph.node(function(node) {
  if (node.id === "root") {
    // centerX = node.x;
    return {
      //   label: node.name,
      size: [288, 63],
    //   anchorPoints: [
    //     [0.5, 0],
    //     [0.5, 1]
    //   ],
      style: {
        fill: "#408FFF",
        stroke: "#D3D9E6"
      },
      labelCfg: {
        style: {
          fontSize: 20,
          fill: "#FFFFFF"
        }
      }
    };
  }

  return {
    // label: node.name
    // labelCfg: {
    //   style: {
    //     fontSize: 14,
    //     fill: '#333333',
    //   }
    // }
    // anchorPoints: [
    //     [0.5, 0],
    //     [0.5, 1]
    //   ],
  };
});

graph.data(DATA);
graph.render();
graph.fitView();
