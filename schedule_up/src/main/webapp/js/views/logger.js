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
                template: "<span class='fa fa-history'></span> Logger korisničkih akcija"
            },{},{
                id: "datePickerFilter",
                view:"daterangepicker",
                name:"dateRangePicker",
                label:"Od-Do:",
                on:{
                    onChange: function (dates) {
                        if (dates.start != null && dates.end != null){
                            $$("loggerDT").filterByAll();
                            var startingDate = new Date(dates.start);
                            var endingDate = new Date(dates.end.getFullYear(),dates.end.getMonth(),dates.end.getDate()+1);
                            $$("loggerDT").filter(function (obj) {
                                var dateOfObj= new Date(obj.created);
                                if (dateOfObj >= startingDate && dateOfObj <= endingDate)
                                    return true;
                                return false;
                            });
                            $$("datePickerFilter").getPopup().hide();
                        }
                    }
                }
            },{
                id: "richSelectFilter",
                view: "richselect",
                label: "Prikaži:",
                value: 1,
                editable: false,
                options: [
                    {id: 1, value: "Sve"},
                    {id: 2, value: "Prošla 24h"},
                    {id: 3, value: "Prošla sedmica"}
                ],
                on: {
                    onChange: function (id) {
                        //My custom date filter for last number of days
                        var customFilterForDate = function(days){
                            var today = new Date();
                            var startDate;
                            var tempDay = today.getDate()-days;
                            if(tempDay>0 && today.getMonth()>1)
                                startDate= new Date(today.getFullYear(),today.getMonth(),tempDay);
                            else if (tempDay<0 && today.getMonth()>1)
                                startDate= new Date(today.getFullYear(),today.getMonth()-1,tempDay);
                            else if (tempDay<0 && today.getMonth()==1)
                                startDate = new Date(today.getFullYear()-1,12,tempDay);
                            $$("loggerDT").filter(function (obj) {
                                var dateOfObj= new Date(obj.created);
                                if (dateOfObj >= startDate)
                                    return true;
                                return false;
                            })
                        }
                        switch (id){
                            case 1:
                                util.messages.showMessage("i guess something one");
                                $$("loggerDT").filterByAll();
                                break;
                            case 2:
                                customFilterForDate(1);
                                util.messages.showMessage("i guess something 2");
                                break;
                            case 3:
                                customFilterForDate(7);
                                break;
                        }
                    }
                }
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
                    header: ["Detaljnije", {
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