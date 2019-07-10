let inNotify = $app.env == $env.today
let inApp = $app.env == $env.app

let fontSize = inApp ? 20 : 12
let navigateBarHeight = inApp ? 40 : 30
let iconSize = $size(navigateBarHeight * 0.6, navigateBarHeight * 0.6)
let cellHeight = inApp ? 24 : 20

async function dataSource(content) {
  let res = await $text.tokenize({ text: content });

  return res.map(item => {
    return { tile: { text: item } };
  });
}

async function apart(content) {
  let picked = [], pickedText = [];

  $ui.render({
    props: {
      bgcolor: $rgba(255, 255, 255, 0.28),
      navBarHidden: 1,
      statusBarStyle: 0
    },
    views: [
      {
        type: "view",
        props: {
          id: "apartb",
          bgcolor: $color("white")
        },
        layout: $layout.fillSafeArea,
        views: [
          {
            type: "views",
            props: {
              id: "apart",
              borderWidth: 0.4,
              borderColor: $rgba(100, 100, 100, 0.25),
              radius: 10,
              bgcolor: $rgba(200, 200, 200, 0.25)
            },
            layout: make => {
              make.top.left.right.bottom.inset(4);
            },
            views: [
              {
                type: "views",
                props: {
                  id: "NavigateBar",
                  borderWidth: 0.4,
                  borderColor: $rgba(100, 100, 100, 0.25),
                  radius: 10,
                  bgcolor: $rgba(200, 200, 200, 0.25)
                },
                layout: (make, view)=> {
                  make.top.left.right.equalTo(view.super);
                  make.height.equalTo(navigateBarHeight);
                },
                views: [
                  {
                    type: "button",
                    props: {
                      id:"CloseBtn",
                      icon: $icon("225", $color("tint"), iconSize),
                      bgcolor: $color("clear")
                    },
                    layout: (make, view) => {
                      make.left.equalTo(view.super).offset(5);
                      make.centerY.equalTo(view.super);
                    },
                    events: {
                      tapped(sender) {
                        $device.taptic(0);
                        let callback = $context.query["x-cancel"]
                        if (callback != undefined && callback.length > 0) {
                          $app.openURL(callback)
                        }

                        if (inNotify) {
                          apart($clipboard.text);
                          $ui.toast("Reload");
                        } else {
                          $app.close()
                        }
                      }
                    }
                  },
                  {
                    type: "button",
                    props: {
                      icon: $icon("21", $color("tint"), iconSize),
                      bgcolor: $color("clear")
                    },
                    layout: (make, view) => {
                      make.left.equalTo($("CloseBtn").right).offset(20);
                      make.centerY.equalTo(view.super);
                    },
                    events: {
                      async tapped(sender) {
                        apartReset()
                        let info = content.replace(/[^A-Z\u4e00-\u9fa5]/ig," ")
                        $("matrix").data = await dataSource(info)
                      }
                    }
                  },
                  {
                    type: "label",
                    props: {
                      text: "Word Storm",
                      font: $font("bold", fontSize),
                      textColor: $color("tint")
                    },
                    layout: (make, view) => {
                      make.center.equalTo(view.super);
                    },
                    events: {
                      async tapped(sender) {
                        apartReset()
                        $("matrix").data = await dataSource(content)
                      }
                    }
                  },

                  {
                    type: "button",
                    props: {
                      id: "ClipBtn",
                      icon: $icon("019", $color("tint"), iconSize),
                      bgcolor: $color("clear")
                    },
                    layout: (make, view) => {
                      make.right.equalTo(view.super).offset(-5);
                      make.centerY.equalTo(view.super);
                    },
                    events: {
                      tapped(sender) {
                        let text =  pickedText.join("");
                        if (text.length > 0) {
                          $clipboard.set({ type: "public.plain-text", value: text });

                          let callback = $context.query["x-success"];
                          if (callback !== undefined && callback.length > 0) {
                            let res = $text.URLEncode(text);
                            let url = callback + `?result=${res}`;
                            $app.openURL(url)
                          }
                          $ui.toast("Copied to clipboard");

                          if (inNotify) {
                            apart($clipboard.text);
                          } else {
                            $app.close()
                          }
                        } else {
                          $ui.toast("Not selected");
                          $device.taptic(0);
                        }
                      }
                    }
                  },
                  {
                    type: "button",
                    props: {
                      icon: $icon("162", $color("tint"), iconSize),
                      bgcolor: $color("clear")
                    },
                    layout: (make, view) => {
                      make.right.equalTo($("ClipBtn").left).offset(-20);
                      make.centerY.equalTo(view.super);
                    },
                    events: {
                      tapped(sender) {
                        apartReset()
                      }
                    }
                  },
                  {
                    type: "label",
                    props: { bgcolor: $rgba(100, 100, 100, 0.25) },
                    layout: (make, view) => {
                      make.right.bottom.left.equalTo(view.super);
                      make.height.equalTo(0.3);
                    }
                  },
                ]
              },
              {
                type: "label",
                props: {
                  id: "CurrentTextLb",
                  text: "",
                  lines: 0,
                  font: $font(fontSize),
                  textColor: $color("purple"),
                  align: $align.left,
                },
                layout: (make, view) => {
                  make.left.right.equalTo(view.super).inset(10);
                  make.top.equalTo($("NavigateBar").bottom).offset(5);
                  make.height.greaterThanOrEqualTo(25);
                }
              },
              {
                type: "matrix",
                props: {
                  spacing: fontSize / 3,
                  template: [
                    {
                      type: "label",
                      props: {
                        id: "tile",
                        radius: 5,
                        font: $font(fontSize),
                        scrollEnabled: 0,
                        bgcolor: $rgba(255, 255, 255, 0.28),
                        textColor: $color("#333"),
                        borderColor: $rgba(100, 100, 100, 0.25),
                        borderWidth: 0.4,
                        align: $align.center
                      },
                      layout: $layout.fill
                    }
                  ],
                  data: await dataSource(content)
                },
                layout: make => {
                  make.left.right.bottom.inset(0.2);
                  make.top.equalTo($("CurrentTextLb").bottom).offset(5);
                },
                events: {
                  didSelect: (sender, indexPath) => {
                    $device.taptic(0);
                    let cell = sender.cell(indexPath),
                        row = indexPath.row,
                        label = cell.get("tile");

                    let test = testRow(picked, row);
                    if (test >= 0) {
                      picked.splice(test, 1);
                      pickedText.splice(test, 1);
                      deselected(label);
                    } else {
                      picked.push(row);
                      pickedText.push(label.text);
                      selected(label);
                    }

                    $("CurrentTextLb").text = pickedText.join("  ")
                  },
                  itemSize: (sender, indexPath) => {
                    let data = sender.object(indexPath),
                        size = $text.sizeThatFits({
                          text: data.tile.text,
                          width: 320,
                          font: $font(fontSize)
                        });
                    return $size(size.width + fontSize, cellHeight);
                  },
                  forEachItem: function(view, indexPath) {
                    const row = indexPath.row;
                    let tile = view.get("tile");
                    if (picked.includes(row)) {
                      selected(tile);
                    } else {
                      deselected(tile);
                    }
                  },
                }
              }
            ]
          }
        ]
      }
    ]
  });

  function apartReset() {
    $device.taptic(0);

    for (let i of picked) {
      let cell = $("matrix").cell($indexPath(0, i));
      deselected(cell.get("tile"));
    }
    picked = [];
    pickedText = [];
    $("CurrentTextLb").text = ""
  };
}

function selected(label) {
  label.textColor = $color("white");
  label.bgcolor = $color("lightGray");
  label.borderColor = $color("gray");
  label.borderWidth = 1;
}

function deselected(label) {
  label.textColor = $color("#333");
  label.bgcolor = $rgba(255, 255, 255, 0.28);
  label.borderColor = $rgba(100, 100, 100, 0.25);
  label.borderWidth = 0.5;
}

function testRow(_picked, row) {
  let i = _picked.indexOf(row);
  if (i >= 0) return i;
}

apart($clipboard.text);
