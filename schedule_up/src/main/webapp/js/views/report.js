

var reportView = {
    reportId: null,
    panel: {
        id: "reportPanel",
        adjust: true,
        rows: [{
            view: "toolbar",
            padding: 8,
            css: "panelToolbar",
            cols: [{
                view: "label",
                width: 400,
                template: "<span class='fa fa-percent'></span> Procenat zauzetosti sala"
            }, {},{
                id: "datePickerReport",
                view:"daterangepicker",
                name:"dateRangePicker",
                label:"Od-Do:",
                suggest:{
                    view:"daterangesuggest",
                    body:{
                        calendarCount:1,
                        icons:true,
                        css:"custom_date_picker_report",

                    }
                },on:{
                    /*onItemClick:function(){
                        $$("datePickerReport").setValue("");

                    },
                      */
                    onChange: function (dates) {
                        if (dates.start != null && dates.end != null){
                            var startingDate = new Date(dates.start);
                            var endingDate = new Date(dates.end.getFullYear(),dates.end.getMonth(),dates.end.getDate()+1);
                            var day =endingDate.getDate();
                            var month=endingDate.getMonth()+1;
                            var year=endingDate.getFullYear();
                            $$("reportDT").clearAll()
                            $$("reportDT").load("room/getListOccupancy/"+startingDate.getFullYear()+"-"+(startingDate.getMonth()+1)+"-"+startingDate.getDate()+"/"+year+"-"+month+"-"+day);
                            $$("datePickerReport").getPopup().hide();
                        }
                    }
                }

            }]
        }, {
            view: "datatable",
            adjust: true,
            tooltip: true,
            multiselect: false,
            id: "reportDT",
            resizeColumn: true,
            resizeRow: true,
            on:{
                onBeforeLoad:function(){
                    this.showOverlay("Učitavanje...");
                },
                onAfterLoad:function(){
                    this.hideOverlay();
                }
            },
            onContext: {},
            columns: [{
                id: "id",
                hidden: true,
                fillspace: true,

            }, {
                id: "name",
                fillspace: true,
                tooltip: false,
                sort: "string",
                header: [
                    "Naziv sale", {
                        content: "textFilter"
                    }
                ]
            }, {
                id: "floor",
                fillspace: true,
                tooltip: false,
                sort: "int",
                header: ["Sprat",
                    {
                        content: "numberFilter"
                    }]
            },
                {
                    id: "capacity",
                    fillspace: true,
                    tooltip: false,
                    sort: "int",
                    header: ["Kapacitet", {
                        content: "numberFilter"
                    }],
                },
                {
                    id: "buildingName",
                    fillspace: true,
                    tooltip: false,
                    sort: "string",
                    header: [
                        "Naziv zgrade", {
                            content: "textFilter"
                        }
                    ]
                },
                {
                    id: "description",
                    fillspace: true,
                    sort: "string",
                    header: [
                        "Opis", {
                            content: "textFilter"
                        }
                    ]

                },
                {
                    id:"occupancy",
                    name:"occupancy",
                    header:"Procenat zauzetosti",
                    tooltip: false,
                    template:function(obj){
                        return parseFloat(Math.round(obj.occupancy * 100) / 100).toFixed(2)+"%</span>";
                    }
                }
            ],
            navigation: true,

        }],

    },
    selectPanel: function () {
        $$("main").removeView(rightPanel);
        rightPanel = "reportPanel";

        var panelCopy = webix.copy(this.panel);

        $$("main").addView(webix.copy(panelCopy));
        var last=new Date(new Date().getTime() + (7 * 24 * 60 * 60 * 1000));
        var day =last.getDate();
        var month=last.getMonth()+1;
        var year=last.getFullYear();
        $$("reportDT").load("room/getListOccupancy/"+new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate()+"/"+year+"-"+month+"-"+day);


    }}
