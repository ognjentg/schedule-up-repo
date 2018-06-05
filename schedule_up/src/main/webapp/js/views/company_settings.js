
var companySettingsView = {


    panel: {
        id: "notePanel",
        adjust: true,
        width:1500,
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
            elements: [{
                id: "timeFrom",
                editable:false,
                editor: "text",
                header: ["Radno vrijeme od",
                    {
                        content: "textFilter"
                    }]
            },
                {
                    id: "timeTo",
                    fillspace: true,
                    editable:false,
                    editor: "text",
                    header: ["Radno vrijeme do",{
                        content: "textFilter"
                    }]
                },
                {}, {
                    id: "saveSettings",
                    view: "button",
                    value: "Sačuvajte",
                    type: "form",
                    click: "companySettingsView.save",
                    hotkey: "enter",
                    width: 150
                }]
        }]
    },
    formatDate:function format(obj){
    if (obj.value){
        if (webix.isArray(obj.value))
            return obj.value.map(webix.i18n.dateFormatStr).join("<br>");
        return webix.i18n.dateFormatStr( obj.value );
    }
    return "";
},
    customizeDialog: function () {
        var form = $$("showDialogForm");
        webix.ui(webix.copy(companySettingsView.showDialogForm)).show();

    },
    selectPanel: function(){
        $$("main").removeView(rightPanel);
        rightPanel = "settingsPanel";

        var panelCopy = webix.copy(this.panel);

        $$("main").addView(webix.copy(panelCopy));

    },
    showDialogForm: {
        view: "popup",
        id: "customizeDialog",
        modal: true,
        position: "center",
        body: {
            id: "customizeInside",
            rows: [{
                view: "toolbar",
                cols: [{
                    view: "label",
                    label: "<span class='webix_icon fa fa-building'></span> Podešavanja kompanije",
                    width: 400
                }, {}, {
                    hotkey: 'esc',
                    autowidth: true,
                    view: "icon",
                    icon: "close",
                    align: "right",
                    click: "util.dismissDialog('customizeDialog');"
                }]
            }, {
                view: "form",
                id: "customizeForm",
                width: 600,
                elementsConfig: {
                    labelWidth: 200,
                    bottomPadding: 18
                },
                elements: [{
                    id: "timeFrom",
                    invalidMessage:"Unesite početak radnog vremena!",
                    name: "timeFrom",
                    view: "datepicker",
                    stringResult: true,
                    label: "Početak radnog vremena",
                    timepicker: true,
                    type: "time",
                    required: true,
                    format: "%H:%i",
                    suggest: {
                        type: "calendar",
                        body: {
                            type: "time",
                            calendarTime: "%H:%i"
                        }
                    }
                },
                    {
                        id: "timeTo",
                        fillspace: true,
                        editable:false,
                        editor: "text"
                    }, {
                        id: "timeTo",
                        invalidMessage:"Unesite kraj radnog vremena!",
                        name: "timeTo",
                        view: "datepicker",
                        stringResult: true,
                        label: "Kraj radnog vremena",
                        timepicker: true,
                        type: "time",
                        required: true,
                        format: "%H:%i",
                        suggest: {
                            type: "calendar",
                            body: {
                                type: "time",
                                calendarTime: "%H:%i"
                            }
                        }
                    },{

                            id:"c3",
                            date:new Date(2018,1,16),
                            view:"calendar",
                            multiselect:"touch"

                    },{
                            id: "saveSettings",
                            view: "button",
                            value: "Sačuvajte",
                            type: "form",
                            click: "companySettingsView.save",
                            hotkey: "enter",
                            width: 150
                        }]
                    }]


                }
            },


        };

