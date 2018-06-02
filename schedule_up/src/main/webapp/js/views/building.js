var buildingView = {

    panel: {
        id: "buildingPanel",
        adjust: true,
        rows: [{
            view: "toolbar",
            padding: 8,
            css: "panelToolbar",
            cols: [{
                view: "label",
                width: 400,
                template: "<span class='fa fa-building'></span> Zgrade"
            },{}, {
                id: "addBuildingBtn",
                view: "button",
                type: "iconButton",
                label: "Dodajte zgradu",
                icon: "plus-circle",
                autowidth: true
            }]
        }, {
            view: "datatable",
            css: "webixDatatable",
            multiselect: false,
            id: "buildingDT",
            resizeColumn: true,
            resizeRow: true,
            onContext: {},
            columns: [{
                id: "id",
                hidden: true,
                fillspace: true,

            }, {
                id: "name",
                fillspace: true,
                editor: "text",
                sort: "string",
                header: [
                    "Naziv", {
                        content: "textFilter"
                    }
                ]
            },  {
                    id: "description",
                    fillspace: true,
                    editor: "text",
                    sort: "text",
                    header: [
                        "Opis", {
                            content: "textFilter"
                        }
                    ]
                }
            ],
            select: "row",
            navigation: true,
            editable: "false",
            url: "building/",
            on: {

                onAfterContextMenu: function (item) {
                    this.select(item.row);
                }
            }
        }]
    },

    selectPanel: function(){
        $$("main").removeView(rightPanel);
        rightPanel = "buildingPanel";

        var panelCopy = webix.copy(this.panel);

        $$("main").addView(webix.copy(panelCopy));
    }
};