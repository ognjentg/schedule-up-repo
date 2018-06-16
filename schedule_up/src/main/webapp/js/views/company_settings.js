
var companySettingsView = {
    panel: {
        id: "settingsPanel",
        adjust:true,
        width:1500,
        height:1500,
        rows: [{
            view: "toolbar",
            padding: 8,
            css: "panelToolbar",
            cols: [{
                view: "label",
                template: "<span class='fa fa-cog'></span> Podešavanja"
            }]
        }, {view: "form",
            id: "customizeForm",
            adjust:true,
            elementsConfig: {
                labelWidth: 290,
                bottomPadding: 18,
                    width:400
            },
            elements: [{ margin:5, cols:[

                    {margin:5,rows:[ {
                        id: "timeFrom",
                        name: "timeFrom",
                        view: "datepicker",
                        stringResult: true,
                        width:400,
                        label: "Početak radnog vremena:",
                        timepicker: true,
                        type: "time",
                        format: "%H:%i",
                            on:{
                            onChange:function( item,oldv){
                                    webix.message("Value changed from:  to: "+oldv)}
                            }
                                ,
                        suggest: {
                            type: "calendar",
                            body: {
                                type: "time",
                                calendarTime: "%H:%i"
                            }
                        }
                    },{
                        id: "timeTo",
                        width:400,
                        name: "timeTo",
                        view: "datepicker",
                        stringResult: true,
                        label: "Kraj radnog vremena:",
                        timepicker: true,
                        type: "time",
                        format: "%H:%i",
                        suggest: {
                            type: "calendar",
                            body: {
                                type: "time",
                                calendarTime: "%H:%i"
                            }
                        }
                    }, {
                            id:"reminderTime",
                            view:"combo",
                            width:400,
                            value:"One",
                            options:["0 minuta", "5 minuta", "15 minuta","30 minuta", "1 sat","12 sati","1 dan"],
                            label:"Podsjetnik:"
                        },{
                            view:"combo",
                            id:"cancelTime",
                            label:"Minimalno vrijeme za otkazivanje sastanka:",
                            width:400,
                            options:["15 minuta","30 minuta", "1 sat","12 sati","1 dan"]
                        }
                ]},{rows:[{
                        id: "holiday",
                        width:600,
                        name: "holiday",
                        view: "datepicker",
                        stringResult: true,
                        label:"Neradni dani:",
                        timepicker: false,
                        type: "date",
                        format: "%d/%m/%y",
                        suggest: {
                            type: "calendar",
                            body: {
                                type: "date",
                                calendarDate: "%d/%m/%y"
                            }
                        }
                    },{
                            id:"t3",
                            template:function format(obj,oldv){
                                if (obj.value){
                                    if (webix.isArray(obj.value)){
                                        return obj.value.map(webix.i18n.dateFormatStr).join("<br>");
                                    }
                                    //return obj.value.map(webix.i18n.dateFormatStr).join("<br>");
                                    return webix.i18n.dateFormatStr( obj.value );
                                }
                                return "";
                            }, height: 185
                        }
                        ]}
                    ]}
                ]
        }]},
    customizeDialog: function () {
        var form = $$("showDialogForm");
        webix.ui(webix.copy(companySettingsView.showDialogForm)).show();

    },
    selectPanel: function() {
        $$("main").removeView(rightPanel);
        rightPanel = "settingsPanel";

        var panelCopy = webix.copy(this.panel);

        $$("main").addView(webix.copy(panelCopy));
        $$("t3").bind($$("holiday"), "value");
        var newItem = {
            timeFrom: $$("customizeForm").getValues().timeFrom + ":00",
            timeTo: $$("customizeForm").getValues().timeTo + ":00"

        };
        connection.sendAjax("GET", "settings/9",
            function (text, data, xhr) {
            var time;
            var cancelTime;
                if (text) {
                    switch(data.json().reminderTime){
                        case "00:00:00":{
                            time="0 minuta";break;
                        }
                        case "00:05:00":{
                        time="5 minuta";break;
                    }
                    case "00:15:00":{
                        time="15 minuta";break;
                    }case "00:30:00":{
                        time="30 minuta";break;
                    }case "01:00:00":{
                        time="1 sat";break;
                    }case "12:00:00":{
                        time="12 sati";break;
                    }case "24:00:00":{
                        time="1 dan ";break;
                    }


                    }
                    switch(data.json().cancelTime){
                        case "00:00:00":{
                            cancelTime="0 minuta";break;
                        }
                        case "00:05:00":{
                            cancelTime="5 minuta";break;
                        }
                        case "00:15:00":{
                            cancelTime="15 minuta";break;
                        }
                        case "00:30:00":{
                        cancelTime="15 minuta";break;
                    }case "00:15:00":{
                        cancelTime="15 minuta";break;
                    }case "00:30:00":{
                        cancelTime="30 minuta";break;
                    }case "01:00:00":{
                        cancelTime="1 sat";break;
                    }case "12:00:00":{
                        cancelTime="12 sati";break;
                    }case "24:00:00":{
                        cancelTime="1 dan";break;
                    }

                    }
                    $$("reminderTime").setValue(time);
                    $$("cancelTime").setValue(cancelTime);
                } else
                    util.messages.showErrorMessage("Greška pri učitavanju.");
            }, function () {
                util.messages.showErrorMessage("Greška pri učitavanju.");
            }, null)
        connection.sendAjax("GET", "company/1",
            function (text, data, xhr) {
                if (text) {
                    $$("timeTo").setValue(data.json().timeTo);
                    $$("timeFrom").setValue(data.json().timeFrom);
                } else
                    util.messages.showErrorMessage("Greška pri učitavanju.");
            }, function () {
                util.messages.showErrorMessage("Greška pri učitavanju.");
            }, null)
    }
        };
