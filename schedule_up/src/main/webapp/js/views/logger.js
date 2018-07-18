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
                    width: 150,
                    template: function format(value) {
                        var date = new Date(value.created);
                        var format= webix.Date.dateToStr("%d.%m.%Y %H:%i");
                        return format(date);
                    },
                    sort: "date",
                    header: ["Datum", {
                        content: "datepickerFilter",
                        compare: function customCompare(value, filter){
                            // value - Date object (filter takes the real data)
                            // filter - selected value
                            // select the day you want to see
                            var format= webix.Date.dateToStr("%d.%m.%Y");
                            var tempFilter=format(filter);
                            var tempValue=format(new Date(value));
                            return tempFilter==tempValue;
                        }
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