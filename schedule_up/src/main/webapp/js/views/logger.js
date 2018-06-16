var loggerView = {
    panel: {
        id: "loggerPanel",
        adjust: true,
        rows: [{
            view: "toolbar",
            padding: 8,
            css: "panelToolbar",
            cols: [{
                view: "label",
                width: 400,
                template: "<span class='fa fa-history'></span> Logovi "
            }]
        }, {
            view: "datatable",
            css: "webixDatatable",
            multiselect: false,
            id: "loggerDT",
            resizeColumn: true,
            resizeRow: true,
            onContext: {},
            columns: [{
                id: "id",
                hidden: true,
                fillspace: true,

            },
                // add user name in 1st column
                {
                    id: "username",
                    fillspace: false,
                    editor: "text",
                    width: 200,
                    editable: false,
                    header: [
                        "Korisnik", {
                            content: "textFilter"
                        }
                    ]
                },
                {
                    id: "actionType",
                    editable: false,
                    fillspace: true,
                    editor: "text",
                    header: [
                        "Tip akcije", {
                            content: "textFilter"
                        },
                    ]
                }, {
                    id: "actionDetails",
                    fillspace: true,
                    editable: false,
                    editor: "text",
                    header: ["Detaljnije",
                        {
                            content: "textFilter"
                        }]
                },
                {
                    id: "tableName",
                    fillspace: true,
                    editable: false,
                    editor: "text",
                    header: ["Izvršeno nad", {
                        content: "textFilter"
                    }],
                }, {
                    id: "created",
                    fillspace: false,
                    editable: false,
                    editor: "Date",
                    width: 150,
                    format: function (value) {
                        date = new Date(value);
                        var hours = date.getHours();
                        var minutes = date.getMinutes();

                        minutes = minutes < 10 ? '0' + minutes : minutes;
                        var strTime = hours + ':' + minutes;
                        return date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear() + ".  " + strTime;
                    },
                    header: ["Datum", {
                        content: "textFilter"
                    }],
                }
            ],
            select: false,
            navigation: true,
            editable: false,
            url: "logger/",
        }]
    },

    selectPanel: function () {
        $$("main").removeView(rightPanel);
        rightPanel = "loggerPanel";
        var panelCopy = webix.copy(this.panel);
        $$("main").addView(webix.copy(panelCopy));
        connection.attachAjaxEvents("loggerDT", "loggerUser", true);
    }
};