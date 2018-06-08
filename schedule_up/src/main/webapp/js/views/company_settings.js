
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
                            id:"reminder",
                            view:"combo",
                            width:400,
                            value:"One",
                            options:["0 minuta", "5 minuta", "15 minuta","30 minuta", "1 sat","12 sati","1 dan","1 sedmica"],
                            label:"Podsjetnik:"
                        },{
                            view:"combo",
                            id:"cancellation",
                            label:"Minimalno vrijeme za otkazivanje sastanka:",
                            width:400,
                            options:["15 minuta","30 minuta", "1 sat","12 sati","1 dan","1 sedmica"]
                        }
                ]},{view:"calendar", id:"calendar",multiselect:true,select:true},{rows:[{id:"aa",view:"label",label:"Neradni dani:"},{
                        id:"t3",template:function format(obj){
                            if (obj.value){
                                if (webix.isArray(obj.value))
                                    return obj.value.map(webix.i18n.dateFormatStr).join("<br>");
                                return webix.i18n.dateFormatStr( obj.value );
                            }
                            return "";
                        }, height: 185
                    }]}
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
        $$("t3").bind($$("calendar"), "value");
    }
        };
